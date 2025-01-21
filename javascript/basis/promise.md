# 异步编程

<script setup>
import Image from "../../components/Image/index.vue"
</script>



## Promise

### 基础

<a href="https://es6.ruanyifeng.com/#docs/promise" target="_blank"  style="display: block">Promise</a>

#### 特点

- 状态不受外界影响,只有异步操作的结果
  - pedding
  - fulfilled
  - rejected
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果**状态不可逆**
  - pedding =》 fulfilled
  - pedding =》 rejected
- throw 可以触发 rejected
- then 方法返回的是一个新的 Promise 实例，因此可以采用链式写法
  - then 方法接受两个参数，第一个是 resolved 状态的回调函数，第二个是 rejected 状态的回调函数
  - then 方法返回的 Promise 实例，会等待回调函数执行完，才会执行下一个 then 方法指定的回调函数

### 实现

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误直接执行reject
      this.reject(e);
    }
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
  }

  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }

  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
    // 执行保存的失败回调
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected

    // 参数校验，确保一定是函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    var thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        setTimeout(() => {
          try {
            const x = cb(this.PromiseResult);
            if (x === thenPromise) {
              // 不能返回自身哦
              throw new Error("不能返回自身。。。");
            }
            if (x instanceof MyPromise) {
              // 如果返回值是Promise
              // 如果返回值是promise对象，返回值为成功，新promise就是成功
              // 如果返回值是promise对象，返回值为失败，新promise就是失败
              // 谁知道返回的promise是失败成功？只有then知道
              x.then(resolve, reject);
            } else {
              // 非Promise就直接成功
              resolve(x);
            }
          } catch (err) {
            // 处理报错
            reject(err);
            throw new Error(err);
          }
        });
      };

      if (this.PromiseState === "fulfilled") {
        // 如果当前为成功状态，执行第一个回调
        resolvePromise(onFulfilled);
      } else if (this.PromiseState === "rejected") {
        // 如果当前为失败状态，执行第二个回调
        resolvePromise(onRejected);
      } else if (this.PromiseState === "pending") {
        // 如果状态为待定状态，暂时保存两个回调
        // 如果状态为待定状态，暂时保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
      }
    });

    // 返回这个包装的Promise
    return thenPromise;
  }

  static all(promises) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        result[index] = value;
        count++;
        if (count === promises.length) resolve(result);
      };
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              addData(index, res);
            },
            (err) => reject(err)
          );
        } else {
          addData(index, promise);
        }
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
        } else {
          resolve(promise);
        }
      });
    });
  }
}
```

## generator

### 基础

<a href="https://es6.ruanyifeng.com/#docs/generator" target="_blank"  style="display: block">generator</a>

## async/await

用同步方式执行异步操作

### 基础

<a href="https://es6.ruanyifeng.com/#docs/async" target="_blank"  style="display: block">async</a>

### 注意点

> for 循环 和 reduce 配合使用

错误用法<Badge type="danger" text="错误" />

```js
function dbFuc(db) {
  //这里不需要 async
  let docs = [{}, {}, {}];

  // 可能得到错误结果
  docs.forEach(async function (doc) {
    await db.post(doc);
  });
}
```

正确用法<Badge type="tip" text="重要" class="badge-sucess" />

```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];

  for (let doc of docs) {
    await db.post(doc);
  }
}

// 或者

async function dbFuc(db) {
  let docs = [{}, {}, {}];

  await docs.reduce(async (_, doc) => {
    await _;
    await db.post(doc);
  }, undefined);
}
```

#### 按顺序执行 <Badge type="warning" text="重要" />

- 使用 for of + async await 遍历
  ```js
  async function logInOrder(urls) {
    for (const url of urls) {
      const response = await fetch(url);
      console.log(await response.text());
    }
  }
  ```
- 使用 reduce 遍历

  ```js
  function logInOrder(urls) {
    // 远程读取所有URL
    const textPromises = urls.map((url) => {
      return fetch(url).then((response) => response.text());
    });

    // 按次序输出
    textPromises.reduce((chain, textPromise) => {
      return chain.then(() => textPromise).then((text) => console.log(text));
    }, Promise.resolve());
  }
  ```

#### 实现

async/await 是一种语法糖：用到的是 ES6 里的迭代函数——generator 函数。 Generator 函数和自动执行器，包装在一个函数里。

- Generator 函数 yield 接 promise

```js
function fn(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num);
    }, 1000);
  });
}
function* gen() {
  yield fn(1);
  yield fn(2);
  return 3;
}
const g = gen();
console.log(g.next()); // { value: Promise { <pending> }, done: false }
console.log(g.next()); // { value: Promise { <pending> }, done: false }
console.log(g.next()); // { value: 3, done: true }
```

- 获取 promise 的值

```js
const g = gen();
next1 = g.next();
next1.value.then((res) => {
  console.log(res); // 1
  const next2 = g.next(res);
  next2.value.then((res) => {
    console.log(res); // 2
    const next3 = g.next(res);
    console.log(next3); // { value: 3, done: true }
  });
});
```

- [后续参考 九思-前端异步编程规范](https://x1mnl9knbjp.feishu.cn/docx/KOISdGpg1orK7sxQ4CKcnzJYnHg)

## 资料引用：

<a href="https://x1mnl9knbjp.feishu.cn/docx/KOISdGpg1orK7sxQ4CKcnzJYnHg" target="_blank"  style="display: block">九思-前端异步编程规范</a>
<a href="https://es6.ruanyifeng.com/#docs/promise" target="_blank"  style="display: block">promise</a>
<a href="https://es6.ruanyifeng.com/#docs/generator" target="_blank"  style="display: block">generator</a>
<a href="https://es6.ruanyifeng.com/#docs/async" target="_blank"  style="display: block">async</a>
