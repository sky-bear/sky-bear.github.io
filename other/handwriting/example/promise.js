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
        promiseList[i].then((res) => {
          result[i] = res
          if(result.filter(v => v).length === promiseList.length){
            resolve(result)
          }
        }).catch((err) => {
          reject(err)
        })
      }
    });
  }

  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseList.length; i++) {
        promiseList[i].then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    });
  }

  static allSettled(promiseList) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      for(let i = 0; i< promiseList.length; i++){
        promiseList.then(res => {
          result[i] = res
          if(result.length === promiseList.length){
            resolve(result)
          }
        }).catch(err => {
          result[i] = err
          if(result.length === promiseList.length){
            resolve(result)
          }
        })
      }
    })
  }

  static any(promiseList) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      for (let i = 0; i < promiseList.length; i++) {
        promiseList[i].then((res) => {
          resolve(res)
        }).catch((err) => {
          result[i] = err;
            if (result.length === list.length) {
              reject(result);
            }
        })
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





