# 设计模式

<script setup>
import Image from "../components/Image/index.vue"
</script>

## 面向对象编程

**面向对象编程**： 就是将你的需求抽象成一个对象，然后针对这个对象分析其特征（属性）与动作（方法），这个对象我们称之为类

**特点**：

- 封装
- 继承 ： 是对原有对象的封装，从中创建私有属性、私有方法、特权方法、共有属性、共有方法等。主要是类继承， 构造函数继承， 组合继承， 其余的都是在这三种基础延申的
- 多态： 同一个方法多种调用方式

## 继承

- 类式继承（原型链继承）

  ```js
  function superclass() {
    this.superValue = true;
  }
  // 为父类添加共有方法
  superclass.prototype.getsuperValue = function() {
    return this.superValue;
  };

  // 声明子类
  function subclass() {
    this.subValue = false;
  }
  // 继承父类
  subclass.prototype = new superclass();

  // 为子类添加共有方法
  subclass.prototype.getsubValue = function() {
    return this.subValue;
  };

  var instance = new subclass()；
  ```

  ```mathematica
  	类的原型对象的作用就是为类的原型添加共有方法，但类不能直接访问这些属性和方法，必须通过原型 prototype 来访问。而我们实例化一个父类的时候，新创建的对象复制了父类的构造函数内的属性与方法并且将原型__proto__指向了父类的原型对象，这样就拥有了父类的原型对象上的属性与方法，并且这个新创建的对象可直接访问到父类原型对象上的属性与方法

  	新创建的对象不仅仅可以访问父类原型上的属性和方法，同样也可访问从父类构造函数中复制的属性和方法. 如果将这个对象赋值给子类的原型，那么这个子类的原型同样可以访问父类原型上的属性和方法与从父类构造函数中复制的属性和方法。这正是类式继承原.
  ```

  通过 `instanceof` 来检测某个对象是否是某个类的实例，或者说某个对象是否继承了某个类

  ```js
  console.log(instance instanceof superclass); //true
  console.log(instance instanceof subclass); //true
  console.log(subclass instanceof superclass); //false
  console.log(subclass.prototype instanceof superclass); //true
  ```

  **缺点**

  - 父构造函数中的值类型的属性被复制，引用类型的属性被共用

    ```markdown
    由于子类通过其原型 prototype 对父类实例化，继承了父类。所以说父类中的共有属性要是引用类型，就会在子类中被所有实例共用，因此一个子类的实例更改子类原型从父类构造函数中继承来的共有属性就会直接影响到其他子类
    ```

  - 无法向父类传递参数

    ```markdown
        由于子类实现的继承是靠其原型 prototype 对父类的实例化实现的，因此在创建父类的时候，是无法向父类传递参数的，因而在实例化父类的时候也无法对父类构造函数内的属性进行初始化
    ```

- 构造函数继承

  ```js
  // 声明父类

  function superclass(id) {
    // 引用类型共有属性
    this.books = ["Javascript", "html", "css"];
    // 值类型共有属性
    this.id = id;
  }

  // 父类声明原型方法
  superclass.prototype.showBooks = function () {
    console.log(this.books);
  };

  // 声明子类
  function subclass(id) {
    // 继承父类
    superclass.call(this, id);
  }
  ```

  ```
  由于这种类型的继承没有涉及原型 prototype，所以父类的原型方法自然不会被子类继承
  ```

  **缺点**

  - 子类实例不能继承父类的构造属性和方法（原型上的方法和属性）

- 组合继承

  ```js
  // 声明父类
  function superclass(name){
    // 值类型共有属性
    this.name = name
    // 引用类型共有属性
    this.books = ["html", "css", "Javascript"]

  }
  // 父类原型共有方法
  superclass.prototype.getName = function(){
    console.log(this.name)

  }
  // 声明子类
  function subclass(name, time){
  // 构造函数式继承父类name属性
  superclass.call(this, name)
  // 子类中新增共有属性
  this.time = time
  }
  // 类式继承 子类原型继承父类
  subclass.prototype = new superclass()
  // 子类原型方法
  subclass.prototype.getTIme = function(){
      console.log(this.time)
  }

  子类不是父类的实例，而子类的原型是父类的实例
  ```

  **在子类构造函数中执行父类构造函数，在子类原型上实例化父类就是组合模式**

  **缺点**: 执行了两次父类构造函数

- 原型继承

  ```js
  // 原型是继承
  function inheritobject(o) {
    // 声明—个过渡函数对象  相当于类式继承的子类
    function F() {}
    // 过渡对象的原型继承父对象
    F.prototype = o;
    // 返回过渡对象的—个实例，该实例的原型继承了父对象
    return new F();
  }

  值类型的属性被复制，引用类型的属性被共用
  ```

  实际就是对类式继承的一个封装

- 寄生式继承

  ```js
  function createBook(obj) {
    // 通过原型继承方式创建新对象
    var o = new inheritobject(obj);
    // 拓展新对象
    o.getName = function () {
      console.log(name);
    };
    // 返回拓展后的新对象

    return o;
  }
  ```

  寄生式继承就是对原型继承的第二次封装，并且在这第二次封装过程中对继承的对象进行了拓展，这样新创建的对象不仅仅有父类中的属性和方法而且还添加新的属性和方法

- 寄生组合式继承

::: danger
Class 语法继承,最接近我们自己实现寄生组合式继承,是 JavaScript 引擎将 class 与转化为了原型链实现的方式
:::

```js
//  寄生式继承 继承原型
//  传递参数 subclass   子类
//  传递参数 superclass 父类

function inheritPrototype(subclass, superclass) {
  // 复制—份父类的原型副本保存在变量中
  var p = inheritobject(superclass.prototype);
  // 修正因为重写子类原型导致子类的constructor属性被修改
  p.constructor = subclass;
  // 设置子类的原型
  subclass.prototype = p;
}
```

组合式继承中，通过构造函数继承的属性和方法是没有问题的，所以这里我们主要探究通过寄生式继承重新继承父类的原型。我们需要继承的仅仅是父类的原型，不再需要调用父类的构造函数，换句话说，在构造函数继承中我们己经调用了父类的构造函数。因此我们需要的就是父类的原型对象的一个副本，而这个副本我们通过原型继承便可得到，但是这么直接赋值给子类会有问题的，因为对父类原型对象复制得到的复制对象 p 中的 constructor 指向的不是 subClass 子类对象，因此在寄生式继承中要对复制对象 p 做一次增强，修复其 constructor 属性指向不正确的问题，最后将得到的复制对象 p 赋值给子类的原型，这样子类的原型就继承了父类的原型并且没有执行父类的构造函数

```js
// 定义父类
function SuperClass(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];

}
// 定义父类原型方法
SuperClass.prototype.getName = function(){console.log(this.name)}:
// 定义子类
function SubClass(name, time) {
  //构造函数式继承
  SuperClass.call(this, name);
  //子类新增属性
  this.time = time;
}
//寄生式继承父类原型
inheritPrototype(SubClass, SuperClass);
//子类新增原型方法
SubClass.prototype.getTime = function () {
  console.log(this.time);
};
```

## 创建型设计模式

### 简单工厂模式

创建对象时不用再关注创建这些对象到底依赖于哪个基类，只要知道这个函数就可以了

```js
var PopFactory = function (name) {
  switch (name) {
    case "alert":
      return new LoginAlert();
    case "confirm":
      return new oginConfirm();
    case "prompt":
      return new LoginPrompt();
  }
};
```

你不需要知道内部具体的操作， 只要传入参数就能获得想要的函数

### 工厂方法模式

工厂方法模式:通过对产品类的抽象使其创建业务主要负责用于创建多类产品的实例。

```js
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
```

### 抽象工厂模式

抽象工厂模式(AbstractFactory):通过对类的工厂抽象使其业务用于对产品类簇的创建而不负责创建某一类产品的实例。
<br/>
抽象类是一种声明但是不能使用的类， 当你使用就会报错
<br/>
抽象工厂模式是设计模式中最抽象的一种，也是创建模式中唯一一种抽象化创建模式。该模式创建出的结果不是一个真实的对象实例，而是一个类簇，它制定了类的结构，这也就区别于简单工厂模式创建单一对象，工厂方法模式创建多类对象。当然由于 JavaScript 中不支持抽象化创建与虚拟方法，所以导致这种模式不能像其他面向对象语言中应用得那么广泛。

<br>
简单来说就是子类原型链继承父级，在父类的原型链上抽象某个方法， 子类必须实现， 不实现，就会调用父级的方法，给出报错提示

### 建造者模式

建造者模式(Builder):将一个复杂对象的构建层与其表示层相互分离，同样的构建过程可采用不同的表示。
<br >
vuex 中 处理 module 的过程

```js
class Store {
  constructor(options = {}) {
    this._modules = new ModuleCollection(options);
  }
}
```

类似

```js
class Person {
  constructor(options = {}) {
    this.name = new Name(options);
    this.work = new Work(options);
  }
}
```

### 原型模式

原型模式(Prototype):用原型实例指向创建对象的类，使用于创建新的对象的类共享原型对象的属性以及方法。
<br />
原型模式实质就是继承

### 单例模式

单例模式(Singleton):又被称为单体模式，是只允许实例化一次的对象类。有时我们也用一个对象来规划一个命名空间，并井有条地管理对象上的属性与方法。

- 命名空间实现

```js
const A = {
  util: {
    util1: function () {},
    util2: function () {},
  },
  tool: {
    tool1: function () {},
    tool2: function () {},
  },
};
```

```js
const Singleton = (function () {
  let instance = null;
  function createInstance() {
    let object = new Object("I am the instance");
    return object;
  }
  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const instance1 = Singleton.getInstance();
```

## 结构型设计模式

### 外观模式

外观模式(Facade):为一组复杂的子系统接口提供一个更高级的统一接口,通过这个接口使得对子系统接口的访问更容易。在 JavaScript 中有时也会用于对底层结构兼容性做统一封装来简化用户使用。

<br />
应用场景

- 兼容方式

  ```js
  function addEvent(dom, type, fn) {
    //对于支持DOM2级事件处理程序addEventListener方法的浏览览器
    if (dom.addEventListener) {
      dom.addEventListener(type, fn, false);
      //对于不支持 addEventListener方法但支持attachEvent方法的浏览器
    } else if (dom.attachEvent) {
      dom.attachEvent("on" + type, fn);
      //对于不支持addEventListener方法也不支持attachEvernt方法,但支持On+'事件名'的 浏览器
    } else {
      dom["on" + type] = fn;
    }
  }

  //获取事件对象
  const getEvent = function (event) {
    //标准浏览器返回event,IE下window.event
    return event || window.event;
  };
  // 获取元素
  const getTarget = function (event) {
    var event = getEvent(event);
    //标准浏览器下event.target,IE下event.srcElemenht
    return event.target || event.srcElement;
  };
  //阻止默认行为
  const preventDefault = function (event) {
    var event = getEvent(event);
    //标准浏览器
    if (event.preventDefault) {
      event.preventDefault();
      // IE浏览器
    } else {
      event.returnValue = false;
    }
  };
  ```

- 小型代码库实现： 通过外观模式来封装多个功能,简化底层操作方法

  ```js
  //简约版属性样式方法库
  var A = {
    //通过id获取元素
    g: function (id) {
      return document.getElementById(id);
    },
    //设置元素css属性
    css: function (id, key, value) {
      document.getElementById(id).style[key] = valuue;
    },
    //设置元素的属性
    attr: function (id, key, value) {
      document.getElementById(id)[key] = value;
    },
    html: function (id, html) {
      document.getElementById(id).innerHTML = html;
    },
    // 为元素绑定事件
    on: function (id, type, fn) {
      document.getElementById(id)["on" + type] = fn;
    },
  };
  // "通过这个代码库,我们再操作元素的属性样式时变得更简单。"
  A.css("box", "background", "red"); //设置css样式
  A.attr("box", "className", "box"); //设置class
  A.html("box", "这是新添加的内容"); //设置内容
  A.on("box", "click", function () {
    //绑定事件
    A.css("box", "width", "500px");
  });
  ```

  ### 适配器模式
适配器模式(Adapter):将一个类(对象)的接口(方法或者属性)转化成另外一个接口以满足用户需求，使类(对象)之间接口的不兼容问题通过适配器得以解决。

- 参数适配器
- 数据适配
- 数据适配

### 代理模式
代理模式(Proxy):由于一个对象不能直接引用另一个对象，所以需要通过代理对象在这两个对象之间起到中介的作用。

### 装饰者模式
装饰者模式(Decorator):在不改变原对象的基础上，通过对其进行包装拓展(添加属性或者方法)使原有对象可以满足用户的更复杂需求。

```js
const decorator = function (input, fn) {
  //获取事件源
  var input = document.getElementById(input); //若事件源已经绑定事件
  if (typeof input.onclick === "function") {
    //缓存事件源原有回调函数
    var oldClickFn = input.onclick; //为事件源定义新的事件
    input.onclick = function () {
      // 事件源原有回调函数
      oldClickFn(); //执行事件源新增回调函数
      fn();
    };
  } else {
    //事件源未绑定事件，直接为事件源添加新增回调函数input.onclick =fni
    // 做其他事情11
  }
};

```

### 桥接模式
桥接模式(Bridge):在系统沿着多个维度变化的同时，又不增加其复杂度并已达到解耦

> 先抽象提取公用部分,再通过桥接方式将抽象和实现链接,使它们可以独立变化。<br />
>桥接模式最主要的特点即是将实现层(如元素绑定的事件)与抽象层(如修饰页面U逻辑)解耦分离，使两部分可以独立变化。由此可以看出桥接模式主要是对结构之间的结构。