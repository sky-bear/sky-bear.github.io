// OperateofResponsibility 链模式

function A() {
  return A.fn;
}
A.fn = A.prototype = {
  a() {
    console.log(1);
    return this;
  },
};

// A().a().a();
// new A().a().a();







const B = function (selector) {
  return new B.fn.init(selector)
}
B.fn = B.prototype = {
  init: function (selector) {
    console.log(selector);
    return this;
  }
  ,
  b() {
    console.log("b");
    return this;
  }
}
B.fn.init.prototype = B.fn;
B("b").b()



