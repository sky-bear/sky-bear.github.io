function debounce(fun, time, options = { context: null, immediately: true }) {
  let timer;
  return function (...args) {
    if (options.immediately && !timer) {
      fun.apply(options.context || this, args);
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fun.apply(options.context || this, args);
    }, time);
  };
}

function throttle(fun, time, options = { context: null, immediately: true }) {
  let timer;
  let lastTime = 0;
  return function (...args) {
    let now = new Date().getTime();
    if (lastTime && now < lastTime + time) {
      if (timer) return;
      timer = setTimeout(() => {
        clearTimeout(timer);
        lastTime = now;
        fun.apply(options.context || this, args);
      }, time);
    } else {
      lastTime = now;
      if (options.immediately) {
        fun.apply(this, args);
      }
    }
  };
}

function deepClone(obj, map = new WeakMap()) {
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj === "function") return obj;
  if (typeof obj !== "object" || obj === null) return obj;
  if (map.has(obj)) return map.get(obj);
  const cloneObj = new obj.constructor();
  map.set(obj, cloneObj);
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key], map);
    }
  }
  return cloneObj;
}

function MyInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  let prototype = right.prototype;
  while (true) {
    if (proto === null) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}

function MyNew() {
  const Constructor = arguments[0];
  if (typeof Constructor !== "function") {
    throw new TypeError("Constructor must be a function");
  }
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(
    obj,
    Array.prototype.slice.call(arguments, 1)
  );
  return typeof result === "object" && result !== null ? result : obj;
}

class EventCommon {
  constructor(element) {
    this.element = element;
  }
  addEvent(type, handler) {
    if (this.element.addEventListener) {
      this.element.addEventListener(type, handler);
    } else if (this.element.attachEvent) {
      this.element.attachEvent("on" + type, handler);
    } else {
      this.element["on" + type] = handler;
    }
  }
  removeEvent(type, handler) {
    if (this.element.removeEventListener) {
      this.element.removeEventListener(type, handler);
    } else if (this.element.detachEvent) {
      this.element.detachEvent("on" + type, handler);
    } else {
      this.element["on" + type] = null;
    }
  }

  preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
  stopProgation(e) {
    if (e.stopProgation) {
      e.stopProgation();
    } else {
      e.cancelBubble = true;
    }
  }

  once(type, handler) {
    const wrapper = (e) => {
      handler(e);
      this.removeEvent(type, wrapper);
    };
    this.addEvent(type, wrapper);
  }
}

Function.prototype.MyBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("this must be a function");
  }
  const _this = this;
  function _bind(...args2) {
    return _this.apply(this instanceof Fn ? this : context, args.concat(args2));
  }
  function Fn() {}
  Fn.prototype = this.prototype;
  _bind.prototype = new Fn();
  return _bind;
};

const PEDDING = "pedding";
const FULFILLED = "fulfilled";
const GEJECTED = "rejected";
class MyPromise {
  constructor(excutor) {
    this.init();
    this.bind();
    try {
      excutor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  init() {
    this.value = undefined;
    this.status = PEDDING;
    this.onFulFilledCallBack = [];
    this.onRejectedCallBack = [];
  }
  bind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  resolve(value) {
    if (this.status !== PEDDING) return;
    this.status = FULFILLED;
    this.value = value;
    this.onFulFilledCallBack.forEach((fn) => fn(value));
  }
  reject(value) {
    if (this.status !== PEDDING) return;
    this.status = GEJECTED;
    this.value = value;
    this.onRejectedCallBack.forEach((fn) => fn(value));
  }
  then(onResolved, onRejected) {
    onResolved = typeof onResolved === "function" ? onResolved : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (r) => {
            throw r;
          };
    const executorWithTryCatch = (fn, params, resolve, reject) => {
      try {
        let result = fn(params);
        if (result instanceof MyPromise) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    };

    return new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        executorWithTryCatch(onResolved, this.value, resolve, reject);
      }
      if (this.status === GEJECTED) {
        executorWithTryCatch(onRejected, this.value, resolve, reject);
      }

      if (this.status === PEDDING) {
        this.onFulFilledCallBack.push((params) => {
          executorWithTryCatch(onResolved, params, resolve, reject);
        });
        this.onRejectedCallBack.push((params) => {
          executorWithTryCatch(onRejected, params, resolve, reject);
        });
      }
    });
  }
  catch() {
    return this.then(null, onRejected);
  }
  finally(onFinally) {
    return this.then(
      () => {
        onFinally(); // finally不需要处理参数
      },
      () => {
        onFinally();
      }
    );
  }

  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value);
    });
  }
  
}

