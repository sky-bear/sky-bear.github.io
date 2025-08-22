// class ConcurrentLimiter {
//   constructor(limit) {
//     this.limit = limit;
//     this.queue = [];
//     this.activeCount = 0;
//   }
//   enqueue(fn) {
//     return new Promise((resolve, reject) => {
//       this.queue.push(() => {
//         fn()
//           .then(resolve)
//           .catch(reject)
//           .finally(() => {
//             this.activeCount--;
//             this.dequeue();
//           });
//       });
//       this.dequeue();
//     });
//   }
//   dequeue() {
//     if (this.activeCount < this.limit && this.queue.length > 0) {
//       this.activeCount++;
//       this.queue.shift()();
//     }
//   }
// }



class ConcurrentLimiter {
  constructor(limit, resolve) {
    this.limit = limit;
    this.queue = [];
    this.activeCount = 0;
    this.result = [];
    this.resolve = resolve;
  }
  enqueue(fn) {
    return new Promise((resolve,reject) => {
      this.queue.push(() => {
        fn().then((res) => {
          this.result.push(res);
          resolve(res);
        }).catch(reject).finally(() => {
          this.activeCount--;
          if(this.queue.length === 0 && this.activeCount === 0) {
            this.resolve(this.result)
          }
          this.dequeue();
        })
      })
      this.dequeue();
    })
  }

  dequeue() {
    if(this.queue.length && this.activeCount < this.limit) {
      this.activeCount++;
      this.queue.shift()();
    }
  }
}

function asyncTask(id, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Task ${id} completed`);
      resolve(id);
    }, delay);
  });
}



function fn() {
  return new Promise((resolve) => {
  const limiter = new ConcurrentLimiter(2,resolve); // 限制并发数为2
    // 添加5个任务
    for (let i = 1; i <= 5; i++) {
      limiter.enqueue(() => asyncTask(i, Math.random() * 2000));
    }
  });
}

fn().then((res)  => console.log('All tasks completed', res))
