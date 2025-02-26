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

A().a().a();
