function throttle(
  fn,
  time = 100,
  options = {
    context: null,
    immediately: true, // 是否第一次立即执行
  }
) {
  let last = 0;
  let timer = null;
  const _throttle = function () {
    const that = this;
    let now = new Date().getTime();
    if (last && now < last + time) {
      if (timer) return;
      timer = setTimeout(() => {
        clearTimeout(timer);
        last = now;
        fn.apply(options.context || that, arguments);
      }, time);
    } else {
      last = now;
      if (options.immediately) {
        fn.apply(options.context || that, arguments);
      }
    }
  };
  return _throttle;
}

function throttle(fn, time = 100, options = {}) {
  let last, timer;
  const _throttle = function () {
    const that = this;
    const now = new Date().getTime();
    // 如果上一次执行时间不存在，或者大于等于间隔时间，则执行函数
    if (last && now < last + time) {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        last = now;
        fn.apply(options.context || that, arguments);
      }, time);
    } else {
      last = now;
      if (options.immediately) {
        fn.apply(options.context || that, arguments);
      }
    }
  };
  return _throttle;
}

