// 最简单的 这个严重依赖setTimeout，
// function debounce(fn, wait) {
//   let timer = null;
//   return function (...args) {
//     if (timer) clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn.apply(this, args);
//     }, wait);
//   };
// }

// function debounce(
//   fn,
//   delay = 100,
//   options = {
//     context: null,
//     immediately: true, // 是否第一次立即执行
//   }
// ) {
//   let timer = null;
//   const _debounce = function (...args) {
//     if (timer) clearTimeout(timer);
//     if (options.immediately && !timer) {
//       fn.apply(options.context || this, args);
//     }

//     timer = setTimeout(() => {
//       fn.apply(options.context || this, args);
//     }, delay);
//   };
//   // 返回句柄
//   const clear = () => {
//     if (timer) clearTimeout(timer);
//     timer = null;
//   };
//   return { debounce: _debounce, clear };
// }

// loadsh 实现
// 定义一个防抖函数，用于在一定时间内只执行一次函数
function debounce(func, wait, options) {
  // 定义一个常量，用于抛出错误信息
  const FUNC_ERROR_TEXT = "Expected a function";
  let lastArgs,
    lastThis,
    lastCallTime, // debounced 上次触发的时间
    lastInvokeTime = 0, // invokeFunc 上次触发的时间
    leading = false,
    maxing = false,
    maxWait,
    trailing = true,
    result,
    timerId;

  // 格式化参数
  forMatArgs();
  // 判断参数是否为函数
  if (Object.prototype.toString.call(options) === "[object Object]") {
    maxing = "maxWait" in options;
    maxWait = maxing ? Math.max(maxWait || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  // 返回防抖函数
  return debounced;

  // 格式化参数
  function forMatArgs() {
    // 判断func是否为函数，如果不是，则抛出错误
    if (typeof func !== "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    // 将wait转换为数字
    wait = +wait || 0;
  }

  function trailingEdge(time) {
    timerId = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  // 
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = startTimer(wait);
    return leading ? invokeFunc(time) : result;
  }

  // 定时器结束后执行的操作
  function timeExpired() {
    const time = Date.now();
    // 是否需要执行
    const canInvoke = shouldInvoke(time);
    if (canInvoke) {
      return trailingEdge(time);
    }
    // 重新设置定时器
    const realWait = remainingWait(time);
    timerId = startTimer(realWait);
  }

  // 定义一个函数，用于调用函数
  function invokeFunc(time) {
    // 获取上一次调用的参数
    let args = lastArgs;
    // 获取上一次调用的this值
    let thisArg = lastThis;
    lastInvokeTime = time;
    // 将上一次调用的参数和this值重置为undefined
    lastArgs = lastThis = undefined;
    result = func.apply(thisArg, args);
    return result;
  }

  // 判断是否需要调用func
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    // 第一次为空  或者时间间隔大于等待时间   或者时间间隔小于0， 即当前时间小于上次的时间， 调整了系统时间
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  function startTimer(time) {
    return setTimeout(timeExpired, time);
  }

  // 真正计算触发延迟的时间
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime; // invokeFunc 上次触发的时间到现在的时间
    const timeWaiting = wait - timeSinceLastCall; // 真正还需要等待的时间

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function debounced() {
    let time = Date.now();
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    // 判断是否需要执行invokeFunc
   

    const isInvoking = shouldInvoke(time);
    if (isInvoking) {
      // 第一次执行
      console.log("timerId",timerId)
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      } else {
        if (maxing) {
          clearTimeout(timerId);
          timerId = startTimer(wait);
          return invokeFunc(lastCallTime);
        }
      }
    }

    if (timerId === undefined) {
      timerId = startTimer(wait);
    }
    // 不需要执行时，返回结果
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }
 

}




const fn = () => console.log("hello");
const debounceFn = debounce(fn, 3000, { leading: true });
debounceFn()
// setTimeout(() => {
//   debounceFn()
// },500)
// setTimeout(() => {
//   debounceFn()
// },1000)

// setTimeout(() => {
//   debounceFn()
// },1500)