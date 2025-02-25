function inheritobject(o) {
  // 声明—个过渡函数对象  相当于类式继承的子类
  function F() {}
  // 过渡对象的原型继承父对象
  F.prototype = o;
  // 返回过渡对象的—个实例，该实例的原型继承了父对象
  return new F();
}

function inheritPrototype(subclass, superclass) {
  // 复制—份父类的原型副本保存在变量中
  var p = inheritobject(superclass.prototype);
  // 修正因为重写子类原型导致子类的constructor属性被修改
  p.constructor = subclass;
  // 设置子类的原型
  subclass.prototype = p;
}

//容器类构造函数
var Container = function (id, parent) {
  //构造函数继承父类
  News.call(this);
  //模块id
  this.id = id = id;
  //模块的父容器
  this.parent = parent;
  //构建方法
  this.init();
};

//寄生式继承父类原型方法
inheritPrototype(Container, News);
//构建方法
Container.prototype.init = function () {
  this.element = document.createElement("u1");
  this.element.id = this.id;
  this.element.className = "new-container";
};
// 添加子元素方法
Container.prototype.add = function (child) {
  //在子元素容器中插入子元素
  this.children.push(child);
  //插入当前组件元素树中
  this.element.appendChild(child.getElement());
  return this;
};
// 获取当前元素方法
Container.prototype.getElement = function () {
  return this.element;
};

//显示方法
Container.prototype.show = function () {
  this.parent.appendChild(this.element);
};
// "同样下一层级的行成员集合类以及后面的新闻组合体类实现的方式与之类似。
var Item = function (classname) {
  News.call(this);
  this.classname = classname;
  this.init();
};
inheritPrototype(Item, News);
Item.prototype.init = function () {
  this.element = document.createElement("li");
  this.element.className = this.classname;
};
Item.prototype.add = function (child) {
  //在子元素容器中插入子元素
  this.children.push(child);
  //插入当前组件元素树中
  this.element.appendChild(child.getElement());
  return this;
};
Item.prototype.getElement = function () {
  return this.element;
};
var NewsGroup = function (classname) {
  News.call(this);
  this.classname = classname || "";
  this.init();
};

inheritPrototype(NewsGroup, News);
NewsGroup.prototype.init = function () {
  this.element = document.createElement("div");
  this.element.className = this.classname;
};
NewsGroup.prototype.add = function (child) {
  //在子元素容器中插入子元素
  this.children.push(child);
  //插入当前组件元素树中
  this.element.appendChild(child.getElement());
  return this;
};

NewsGroup.prototype.getElement = function () {
  return this.element;
};
