/**
 * pedding
 * fulfilled
 * rejected
 */

class MyPromise {
  constructor(executor) {
    this.initValue();
    this.initBindings();
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error)
    }
    
  }
  initValue() {
    this.PromiseState = "pending";
    this.PromiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
  }
  initBindings() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  resolve(value) {
    if(this.PromiseState !== "pending") return;
    this.PromiseResult = value;
    this.PromiseState = "fulfilled";
    while(this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }
  reject(reason) {
    if(this.PromiseState !== "pending") return;
    this.PromiseResult = reason;
    this.PromiseState = "rejected";
    while(this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled  :   value => value;
    onRejected =  typeof onRejected === "function" ? onRejected  :   reason => reason;
    if(this.PromiseState === "fulfilled") {
      onFulfilled(this.PromiseResult);
    }
    if(this.PromiseState === "rejected") {
      onRejected(this.PromiseResult);
    }
    if(this.PromiseState === "pending") {
      this.onFulfilledCallbacks.push(onFulfilled.bind(this));
      this.onRejectedCallbacks.push(onRejected.bind(this));
    }
    return this
  }
}


let p = new MyPromise((resolve, reject) => {
 setTimeout(() => {
  resolve(1)
 }, 2000)
}).then((value) => {
  console.log("3333", value)
})
console.log(p)