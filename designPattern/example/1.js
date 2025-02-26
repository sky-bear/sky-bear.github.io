//安全模式创建的工厂类
var Factory = function (type, content) {
  if (this instanceof Factory) {
    var s = new this[type](content);
    return s;
  } else {
    returnnewFactory(type, content);
  }
};
// 工厂原型中设置创建所有类型数据对象的基类
Factory.prototype = {
  Java: function (content) {},
  JavaScript: function (content) {},
  UI: function (content) {},
  php: function (content) {},
};



console.log(Function.__proto__ === Function.prototype); // true




const a = new Object();
a.length = 2;

Array.prototype.push.apply(a, [1,2])
console.log("a", a)
