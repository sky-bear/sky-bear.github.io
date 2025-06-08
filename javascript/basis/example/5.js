class ConcurrentLimiter {
  constructor(limit) {
    this.limit = limit;
    this.queue = [];
    this.runningCount = 0;
  }

  enqueue(promiseFn) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        promiseFn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.runningCount--; // 完成任务后减少计数
            this.dequeue(); // 尝试启动下一个任务
          });
      });
      this.dequeue(); // 尝试执行新的任务
    });
  }

  dequeue() {
    while (this.queue.length > 0 && this.runningCount < this.limit) {
      const task = this.queue.shift(); // 获取并移除队列中的第一个任务
      this.runningCount++; // 增加正在运行的计数
      task(); // 执行任务
    }
  }
}

// 使用示例：
const limiter = new ConcurrentLimiter(3); // 最多同时运行3个任务

function doTask(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Task ${id} completed`);
      resolve();
    }, Math.random() * 1000); // 随机延时模拟异步操作
  });
}

// 添加任务到队列中并执行
limiter.enqueue(() => doTask(1));
limiter.enqueue(() => doTask(2));
limiter.enqueue(() => doTask(3));
limiter.enqueue(() => doTask(4)); // 这个会在前三个完成后执行
limiter.enqueue(() => doTask(5)); // 这个会在前三个完成后执行，以此类推...
