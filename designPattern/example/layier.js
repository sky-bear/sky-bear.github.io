// 惰性模式
//添加绑定事件方法on
const B = {};
B.on = (function (dom, type, fn) {
  //如果支持 addEventListener方法
  if (document.addEventListener) {
    //返回新定义方法
    return function (dom, type, fn) {
      dom.addEventListener(type, fn, false);
    };
    //如果支持attachEvent方法(IE)
  } else if (document.attachEvent) {
    //返回新定义方法
    return function (dom, type, fn) {
      dom.attachEvent("on" + type, fn);
    };
    //定义on方法
  } else {
    //返回新定义方法
    return function (dom, type, fn) {
      dom["on" + type] = fn;
    };
  }
})();

// 惰性执行
const A = {};
A.on = function (dom, type, fn) {
  //如果支持addEventListener方法
  if (document.addEventListener) {
    //重定义on方法
    A.on = function (dom, type, fn) {
      dom.addEventListener(type, fn, false);
    };
    //如果支持attachEvent方法(IE)
  } else if (document.attachEvent) {
    //重定义on方法
    A.on = function (dom, type, fn) {
      dom.attachEvent("on" + type, fn);
    };
  } else {
    A.on = function (dom, type, fn) {
      dom["on" + type] = fn;
    };
  }
  A.on(dom, type, fn);
};
