# 手写代码汇总

## call

```js
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("this is not a function");
  }
  if (context === null || context === undefined) return this(...args);
  const fn = this;
  // 把基本类型包装成对象
  if (typeof context !== "object") context = new Object(context);
  context.fn = fn;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
```

## apply

```js
Function.prototype.MyApply = function (context, args) {
  // 1.判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError(this + "is not a function");
  }
  if (typeof context === "undefined" || context === null) return this(args);
  const fn = this;
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
```

## bind

```js
Function.prototype.MyBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }
  const self = this;
  // 1
    // const _bind = function(...args1) {
  //   return self.apply(this instanceof _bind ? this  : context, args.concat(args1))
  // }
  // _bind.prototype = Object.create(this.prototype)
  // 2
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
```

## promise

```js
const PEDDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this.bindThis();
    this.initValue();
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  initValue() {
    this.status = PEDDING;
    this.value = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
  }
  bindThis() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  resolve(value) {
    if (this.status === PEDDING) {
      this.status = FULFILLED;
      this.value = value;
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(this.value);
      }
    }
  }

  reject(reason) {
    if (this.status === PEDDING) {
      this.status = REJECTED;
      this.value = reason;
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.value);
      }
    }
  }
  then(onFulfilled, onRejected) {
    // 定义一个带有try-catch的执行器函数
    const executorWithTryCatch = (fn, params, resolve, reject) => {
      try {
        const result = fn(params);
        // 如果返回值是Promise
        // 如果返回值是promise对象，返回值为成功，新promise就是成功
        // 如果返回值是promise对象，返回值为失败，新promise就是失败
        // 谁知道返回的promise是失败成功？只有then知道
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
      onFulfilled =
        typeof onFulfilled === "function" ? onFulfilled : (value) => value;
      onRejected =
        typeof onRejected === "function"
          ? onRejected
          : (reason) => {
              throw reason;
            };
      if (this.status === FULFILLED) {
        executorWithTryCatch(onFulfilled, this.value, resolve, reject);
      }
      if (this.status === REJECTED) {
        executorWithTryCatch(onRejected, this.value, resolve, reject);
      }
      if (this.status === PEDDING) {
        this.onFulfilledCallbacks.push((params) => {
          executorWithTryCatch(onFulfilled, params, resolve, reject);
        });
        this.onRejectedCallbacks.push(() => {
          executorWithTryCatch(onRejected, params, resolve, reject);
        });
      }
    });
  }
  catch(onRejected) {
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

  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    });
  }
  static all(promiseList) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      for (let i = 0; i < promiseList.length; i++) {
        promiseList[i]
          .then((res) => {
            result[i] = res;
            if (result.length === promiseList.length) {
              resolve(result);
            }
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseList.length; i++) {
        promiseList[i]
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  static allSettled(promiseList) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      for (let i = 0; i < promiseList.length; i++) {
        promiseList
          .then((res) => {
            result[i] = res;
            if (result.length === promiseList.length) {
              resolve(result);
            }
          })
          .catch((err) => {
            result[i] = err;
            if (result.length === promiseList.length) {
              resolve(result);
            }
          });
      }
    });
  }

  static any(promiseList) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      for (let i = 0; i < promiseList.length; i++) {
        promiseList[i]
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            result[i] = err;
            if (result.length === list.length) {
              reject(result);
            }
          });
      }
    });
  }
}

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
promise
  .then((res) => {
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        resolve("success2");
      }, 1000);
    });
  })
  .then((res) => {
    console.log("55", res);
  });
```

## 事件

外观模式

```js
class EventCommon {
  constructor(element) {
    if (!this.element) {
      throw new Error("element is required");
    }
    this.element = element;
  }
  addEvent(type, handler) {
    if (this.element.addEventListener) {
      this.element.addEventListener(type, handler);
    } else if (this.element.attachEvent) {
      this.element.attachEvent("on" + type, handler.bind(this.element));
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

  // 取消事件默认行文
  preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
  // 阻止事件冒泡
  stopPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }
}
```

## ajax

```js
function ajax(options) {
  const { url, method, data, success, fail, timeout } = options;
  let xmlHttp, timer;
  const objToString = (data) => {
    let str = "";
    for (let key in data) {
      str += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
    }
    return str;
  };
  const str = objToString(data || {});
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (method.toUpperCase === "GET") {
    xmlHttp.open(method, `${url}?${str}`, true);
    xmlHttp.send();
  } else {
    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
     xmlHttp.send(str);
  }

  

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4) {
      if (
        xmlHttp.status >= 200 ||
        xmlHttp.status < 300 ||
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

  if (timeout) {
    timer = setTimeout(() => {
      xmlHttp.abort();
      fail("请求超时");
      clearTimeout(timer);
    }, timeout);
  }
}
```

## 柯里化累加

```js
function sum() {
  const args = Array.prototype.slice.call(arguments);
  const add = function () {
    args.push(...arguments);
    return add;
  };
  add.toString = function () {
    return args.reduce((a, b) => a + b, 0);
  };
  add.get = function () {
    return args.reduce((a, b) => a + b, 0);
  };
  return add;
}

console.log(sum(1)(2)(3)().get()); // 6
```

## 深复制

```js
function deepClone(obj, map = new WeakMap()) {
  if (obj === null) {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  if (typeof obj === "function") {
    return obj;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }
  const cloneObj = new obj.constructor();
  map.set(obj, newObj);
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key], map);
    }
  }
  return cloneObj;
}
```

## 标签路径解析

```js
function getPathToElement(element: any) {
  const path = [];
  let currentElement = element;

  try {
    while (currentElement?.tagName?.toLowerCase() !== "body") {
      const parentNode = currentElement.parentNode;
      const children = Array.from(parentNode?.children);
      const nodeIndex = children.indexOf(currentElement) + 1;
      const name = `${currentElement.tagName.toLowerCase()}:nth-child(${nodeIndex})`;
      // 将当前元素的标签和其兄弟索引添加到路径数组中
      path.unshift(name);
      // 移动到父元素
      currentElement = parentNode;
    }
  } catch (error) {
    console.log(error);
  }
  // 最后添加 body 标签
  path.unshift("body");

  return path.join(" > ");
}
```

## instanceof

在 a 的整条[[prototype]]链中 是否有指向 Foo.prototype 的对象

```js
function myInstance(left, right) {
  // 获取对象的原型
  let _proto = Object.getPrototypeOf(left);
  // 构造函数的prototype
  let _prototype = right.prototype;

  while (true) {
    if (!_proto) {
      return false;
    }

    if (_proto === _prototype) {
      return true;
    }

    _proto = Object.getPrototypeOf(_proto);
  }
}
```

## debounce

```js
function debounce(
  fn,
  delay = 100,
  options = {
    context: null,
    immediately: true, // 是否第一次立即执行
  }
) {
  let timer = null;
  const _debounce = function (...args) {
    if (timer) clearTimeout(timer);
    if (options.immediately && !timer) {
      timer = setTimeout(null, delay);
      return fn.apply(options.context, args);
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(options.context, args);
      timer = null;
    }, delay);
  };
  // 返回句柄
  const clear = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  return { debounce: _debounce, clear };
}
```



## new 的实现

```js
function objectFactory() {
  const obj = new Object();
  const Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, arguments);
  return typeof result === "object" && result !== null ? result : obj;
}
```



## throttle

```js
function throttle(fn, time = 100, options = {}) {
  let last, timer;
  const _throttle = function () {
    const that = this;
    const now = new Date().getTime();
    // 如果上一次执行时间不存在，或者大于等于间隔时间，则执行函数
    if(last &&  now < last +time) {
      if(timer) return;
      timer = setTimeout(() => {
        timer = null
        last = now;
        fn.apply(options.context || that, arguments);
      }, time)

    } else {
      last = now;
      if(options.immediately) {
        fn.apply(options.context || that, arguments);
      }
    }
  }
  return  _throttle
```

