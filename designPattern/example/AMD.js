//向闭包中传入模块管理器对象F(~屏蔽压缩文件时,前面漏写;报错)
~(function (F) {
  //模块缓存器。存储已创建模块
  var moduleCache = {};
})(
  (function () {
    //创建模块管理器对象F,并保存在全局作用域中
    return (window.F = {});
  })()
);
