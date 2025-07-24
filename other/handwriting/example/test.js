Function.prototype.MyCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Type error");
  }
  if (context === null || context === undefined) return this.apply(args);
  if (typeof context == !"object") context = new Object(context);
  context.fn = this;

  const result = context.fn(...args);
  delete context.fn;
  return result;
};

Function.prototype.MyApply = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Type error");
  }
  if (context === null || context === undefined) return this.apply(args);
  if (typeof context == !"object") context = new Object(context);
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};

Function.prototype.MyApply = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Type error");
  }
  if (context === null || context === undefined) return this;
  if (typeof context !== "object") context = new Object(context);
  const self = this;

  function Fn() {}
  Fn.prototype = self.prototype;

  const _bind = function () {
    return self.apply(
      this instanceof Fn ? this : context,
      ...args,
      ...arguments
    );
  };

  _bind.prototype = new Fn();
  return _bind;
};

function MyInstaceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  let protorype = right.prototype;
  while (true) {
    if (proto === null) return false;
    if (proto === protorype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}

class ExecutorLimiter {
  constructor(limiter) {
    this.limiter = limiter;
    this.queue = [];
    this.activeCount = 0;
  }
  enqueue(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        fn()
          .then(resolve, reject)
          .finally(() => {
            this.activeCount--;
            this.dequeue();
          });
      });
      this.dequeue();
    });
  }
  dequeue() {
    if (this.queue.length && this.activeCount < this.limiter) {
      this.activeCount++;
      this.queue.shift()();
    }
  }
}

function debounce(fn, time, options = {}) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}

function throttle(fn, time) {
  let timer = null;
  let lastTime = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (timer) clearTimeout(timer);
    if (!lastTime || now - lastTime > time) {
      fn.apply(this, args);
      lastTime = now;
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, time - (now - lastTime));
    }
  };
}

function deepClone(obj, map = new WeakMap()) {
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Function) return obj;
  if (typeof obj !== "object") return obj;
  if (map.has(obj)) return map.get(obj);
  const cloneObj = new obj.constructor();
  map.set(obj, cloneObj);
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key], map);
    }
  }
  return cloneObj;
}



function objectFactory() {
  const obj = new Object();
  const Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, arguments);
  if(result === null || result === undefined) return obj;
  return result;
}



const PEDDING = "pedding";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(exector) {
    this.init();
    try {
      exector(this.resolve, this.rejected)
    } catch (error) {
      this.rejected(error)
    }
  }
  init() {
    this.status = PEDDING;
    this.value = undefined;
    this.resolveCallbacks = [];
    this.rejectedCallbacks = [];
    this.resolve= this.resolve.bind(this)
    this.rejected = this.rejected.bind(this)


  }
  resolve(value) {
    if(this.status == PEDDING) {
      this.status = FULFILLED;
      this.value = value;
      while(this.resolveCallbacks.length) {
        this.resolveCallbacks.shift()(this.value)
      }

    }

  }
  rejected(error) {
    if(this.status == PEDDING) {
      this.value = error;
      this.status = REJECTED;
      while(this.rejectedCallbacks.length) {
        this.rejectedCallbacks.shift()(error)
      }

    }

  }
  then(onResolved, onRejected) {
    onResolved = typeof onResolved === "function" ? onResolved : value => value;
    onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };

    return new MyPromise((resolve, rejected) => {
      function tryCatchFn(fn, params, resolve, reject) {
        try {
          const result = fn(params)
          if(result instanceof MyPromise) {
            result.then(resolve, reject)
          } else {
            resolve(result);
          }
  
        } catch (error) {
          reject(error)
        }
        

      }
      if(this.status === PEDDING) {
        this.resolveCallbacks.push(
          (params) =>  tryCatchFn(onResolved, params, resolve, reject)
        )
        this.rejectedCallbacks.push(
          (params) =>  tryCatchFn(onRejected, params, resolve, reject)
        )
      }
      if(this.status === FULFILLED) {
        tryCatchFn(onResolved, this.value, resolve, reject)
      }
      if(this.status === REJECTED) {
        tryCatchFn(onRejected, this.value, resolve, reject)
      }

    })
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }
  finally(onFinally) {
    return this.then(() => {
      onFinally()
    }, () => {
      onFinally()
    })
  }


  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(value) {
    return  new MyPromise((resolve, reject) => {
      reject(value);
    });
  }
}


