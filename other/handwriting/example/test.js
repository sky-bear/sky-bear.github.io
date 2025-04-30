
// 定义一个ajax函数，返回一个Promise对象
function ajax(options) {
  return new Promise((resolve, reject) => {
      const { url, method, data, timeout = 5000 } = options;
      let xhr, timer;
      const  objToString = (obj) => {
        let str = '';
        for (let key in obj) {
          str += `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}}&`
        }
        return str.slice(0, -1);
      }
      
      const str = objToString(data);
      if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }

      if(method.toUpperCase() === 'GET') {
        xhr.open(method, `${url}?${str}`, true);
      } else {
        xhr.open(method, url, true);
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Content-Type', 'application/json');
      }
      xhr.send(JSON.stringify(data));

      xhr.onreadystatechange =function()  {
        if(xhr.readyState ===4 ) {
          if(xhr.state >= 200 || xhr.state < 300 || xhr.state === 304) {
            resolve(xhr.response)
          } else {
            reject(xhr.response)
          }
          timer && clearTimeout(timer)
        }
      }

      
    if(timeout) {
      timer = setTimeout(() => {
        xhr.abort()
        reject('请求超时')
        clearTimeout(timer)
      },timeout)
    }

  })

}





function deepClone(obj, map = new WeakMap()) {
  if(obj === null || typeof obj !== "object") return obj;
  if(obj instanceof Date ) return new Date(obj);
  if(obj instanceof RegExp) return new RegExp(obj);
  if(typeof obj === 'function') return obj;
  if(map.has(obj)) return map.get(obj);
  let cloneObj = new obj.constructor();
  map.set(obj, cloneObj);
  for(let key in obj) {
    if(Object.prototype.hasOwnProperty.call(key)) {
      cloneObj[key] = deepClone(obj[key], map)
    }
  }
  return cloneObj;
}


function myInstanceof(left, right) {
  let __proto = left.__proto__;
  while(true) {
    if(__proto === null) return false;
    if(__proto === right.prototype) return true;
    __proto = __proto.__proto__;
  }
}


const PEDDING = 'pedding';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    this.initValue();
    this.bindThis();
    try {
      executor(this.resolve,this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  initValue() {
    this.status = PEDDING;
    this.value = undefined;
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
  }
  bindThis() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  resolve(value) {
    if(this.status === PEDDING) {
      this.status = FULFILLED;
      this.value = value;
      while(this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(this.value)
      }
    }
  }
  reject(reason) {
    if(this.status === PEDDING) {
      this.status = REJECTED;
      this.value = reason;
      while(this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.value)
      }
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    const exxcutorWidthTryCatch = (fn, params,resolve,reject) => {
      
      try {
        const result = fn(params);
        if(result instanceof MyPromise) {
          result.then(resolve, reject)
        } else {
          resolve(result)
        }
      } catch (error) {
        reject(error)
      }
    }


    return new MyPromise((resolve, reject) => {

      if(this.status == FULFILLED) {
        exxcutorWidthTryCatch(onFulfilled, this.value, resolve, reject)
      }
      if(this.status == REJECTED) {
        exxcutorWidthTryCatch(onRejected, this.value, resolve, reject)
      }
      if(this.status == PEDDING) {
        this.onFulfilledCallbacks.push((params) => exxcutorWidthTryCatch(onFulfilled, params, resolve, reject))
        this.onRejectedCallbacks.push((params) => exxcutorWidthTryCatch(onRejected, params, resolve, reject))
      }

    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
  
  finally(onFinally) {
    return this.then(() => {
      onFinally()
    },
    () => {
      onFinally()
    })
  }

  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value)
    })
  }
}