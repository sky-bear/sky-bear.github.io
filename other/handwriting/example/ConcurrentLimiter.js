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
  constructor(limit) {
    this.limit = limit;
    this.queue = [];
    this.activeCount = 0;
  }
  enqueue(fn) {
    return new Promise((resolve,reject) => {
      this.queue.push(() => {
        fn().then(resolve).catch(reject).finally(() => {
          this.activeCount--;
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