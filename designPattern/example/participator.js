// participator 参与者模式

const A = { event: {} };
// 这种无法移除已经添加的函数
A.event.on = function (dom, type, fn, data) {
  //w3c标准事件绑定
  if (dom.addEventListener) {
    dom.addEventListener(
      type,
      function (e) {
        //在dom环境中调用fn,并传入事件对象与data数据参数
        fn.call(dom, e, data);
      },
      false
    );
  }
};


function fn() {
  console.log(...arguments)
}
// const bindFn = fn.bind(null, 1, 2, 3, 4, 5)
// bindFn(6,7,8) // 1 2 3 4 5 6 7 8



function bindFn(fn, ...args) {
  return function() {
    return fn.apply(this, [...arguments, ...args])
  }
}


const fn1 = bindFn(fn, 6,7,8)
fn1(1,2,3,4,5) // 1 2 3 4 5 6 7 8