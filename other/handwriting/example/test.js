const ajax = function (options) {
  const { url, method = "GET", data = {}, success, fail } = options;
  let xmlHttp;
  const objTostring = function (data) {
    let str = "";
    Object.keys(data).forEach((key) => {
      str += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
    });
    return str;
  };
  const str = objTostring(data);
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (method.toUpperCase === "GET") {
    xmlHttp.open(method, `${url}?${str}`, true);
  } else {
    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xmlHttp.send(str);
  }

  xmlHttp.onreadystateChange = function () {
    if (xmlHttp.readyState === 4) {
      if (
        (xmlHttp.status >= 200 && xmlHttp.status < 300) ||
        xmlHttp.status === 304
      ) {
        success(xmlHttp.responseText);
      } else {
        fail(xmlHttp.responseText);
      }
    } else {
      fail(xmlHttp.responseText);
    }
  };
};

Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("this is not a function");
  }
  if (typeof context === "undefined" || context === null) {
    return this(args);
  }
  if (typeof context !== "object") {
    context = new Object(context);
  }
  const fn = this;
  context.fn = fn;
  const res = context.fn(...args);
  delete context.fn;
  return res;
};

Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("this is not a function");
  }
  if (typeof context === "undefined" || context === null) {
    return this(...args);
  }
  if (typeof context !== "object") {
    context = new Object(context);
  }
  const fn = this;
  context.fn = fn;
  const res = context.fn(...args);
  delete context.fn;
  return res;
};

Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("this is not a function");
  }
  if (typeof context === "undefined" || context === null) {
    return this(...args);
  }
  if (typeof context !== "object") {
    context = new Object(context);
  }
  const self = this;

  // const _bind = function(...args1) {
  //   return self.apply(this instanceof _bind ? this  : context, args.concat(args1))
  // }
  // _bind.prototype = Object.create(this.prototype)
  function Fn() {}
  const _bind = function (...args2) {
    // 判断当前是否当作构造函数使用
    // 这里的this 指向的是创建的实例
    return self.apply(this instanceof Fn ? this : context, args.concat(args2));
  };
  Fn.prototype = this.prototype;
  _bind.prototype = new Fn();
  return _bind;
};

function debounce(fn, time, { immediately = false }) {
  let timer = null;
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    if (immediately && !timer) {
      fn.apply(this, args);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
  return _debounce;
}

// 节流
function throttle(fn, time) {
  let timer = null;
  const _throttle = function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, time);
  };
  return _throttle;
}

function throttle(fn, time) {
  let last, timer;
  const _throttle = function (...args) {
    const now = Date.now();
    if (!last || (last && now - last >= time)) {
      last = now;
      fn.apply(this, args);
    }
  };
  return _throttle;
}

function deepClone(obj, map = new WeakMap()) {
  if (typeof obj !== "object") return obj;
  if (obj === null) return null;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj === "function") return obj;
  if (map.has(obj)) return map.get(obj);
  const newObj = new obj.constructor();
  map.set(obj, newObj);
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepClone(obj[key], map);
    }
  }
  return newObj;
}

class EventCommon {
  constructor(element) {
    if (!element) {
      throw new Error("element is required");
    }
    this.element = element;
  }
  addEvent(type, callback) {
    if (this.element.addEventListener) {
      this.element.addEventListerner(type, callback);
    } else if (this.element.attachEvent) {
      this.element.attachEvent(`on${type}`, callback);
    } else {
      this.element[`on${type}`] = callback;
    }
  }
  removeEvent(type, callback) {
    if (this.element.removeEventListener) {
      this.element.removeEventListener(type, callback);
    } else if (this.element.dettachEvent) {
      this.element.dettachEvent(`on${type}`, callback);
    } else {
      this.element[`on${type}`] = null;
    }
  }

  event(e) {
    return e || window.event;
  }
  target(e) {
    return e.target || e.srcElement;
  }

  stopPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }
  preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
}

function myInstanceof(left, right) {
  const prototype = right.prototype;
  left = left.__proto__;
  while (true) {
    if (left === null) return false;
    if (left === prototype) return true;
    left = left.__proto__;
  }
}

function MyNew() {
  const obj = new Object();
  const Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, arguments);
  return typeof result === "object" && result !== null ? result : obj;
}

function reverseNumber(num) {
  if (!num) return;
  let newNum = 0;
  while (num) {
    newNum = newNum * 10 + (num % 10);
    num = Math.floor(num / 10);
  }
  return newNum;
}

console.log(reverseNumber(203));

const PEDDING = "pedding";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this.initData();
    this.initBind();
    try {
      executor((this.resolve, this.reject))
    } catch (error) {
      this.reject(error)
    }
    

  }
  initData() {
    this.status = PEDDING;
    this.value = undefined;
    this.fulfilledCallbacks = [];
    this.rejectedCallbacks = [];
  }
  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value) {
    if (this.status === PEDDING) {
      this.status = FULFILLED;
      this.value = value;
      this.fulfilledCallbacks.forEach((fn) => fn(this.value));
    }
  }
  reject(value) {
    if (this.status === PEDDING) {
      this.status = REJECTED;
      this.value = value;
      this.rejectedCallbacks.forEach((fn) => fn(this.value));
    }
  }

  then(resolveFn, rejectFn) {
    resolveFn = typeof resolveFn === "function" ? resolveFn : (value) => value;
    rejectFn = typeof rejectFn === "function" ? rejectFn : (value) => {
      throw value;
    };  


    const executorWidthTryCatch = (fn, params,resolve,reject) => {
      try {
        const result = fn(params);
        if(result instanceof MyPromise) {
          result.then(resolve,reject)
        }else {
          resolve(result)
        }

      } catch (error) {
        reject(error)
      }
    }

    return new MyPromise((resolve,rejected) => {
      if(this.status === FULFILLED) {
        executorWidthTryCatch(resolveFn,this.value,resolve,rejected)
      }
      if(this.status === REJECTED) {
        executorWidthTryCatch(rejectFn,this.value,resolve,rejected)
      }
      if(this.status === PEDDING) {
        this.fulfilledCallbacks.push((params) => executorWidthTryCatch(resolveFn,params,resolve,rejected))
        this.rejectedCallbacks.push((params) => executorWidthTryCatch(rejectFn,params,resolve,rejected))
      }
      
    })

  }
}
