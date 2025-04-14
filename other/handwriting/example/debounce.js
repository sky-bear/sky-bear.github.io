function debounce() {
  let timer = null;
  return function (fn, delay) {
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
    },delay)
  }
}


function debounce(fn,delay = 100, options = {
  context:null,
  immediately: true // 是否第一次立即执行
}) {
  let timer = null;
  const _debounce = function (...args) {
    if(options.immediately && !timer) {
     return fn.apply(options.context,args); 
    }
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(options.context,args);
      timer = null
    }, delay)

  }
  // 返回句柄
  const clear = () => {
    if( timer) clearTimeout(timer);
    timer = null;
  }
  return {debounce: _debounce , clear}
}