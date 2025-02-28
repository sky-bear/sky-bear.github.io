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
> 桥接模式最主要的特点即是将实现层(如元素绑定的事件)与抽象层(如修饰页面 U 逻辑)解耦分离，使两部分可以独立变化。由此可以看出桥接模式主要是对结构之间的结构。

### 组合模式

组合模式(Composite):又称部分-整体模式,将对象组合成树形细吉构以表示"部分整体"的层次结构。组合模式使得用户对单个对象和组合对象的使用具有一致性。

### 享元模式

享元模式(Flyweight):运用共享技术有效地支持大量的细粒度的对象，避免对象间拥有相同内容造成多余的开销。

## 行为型设计模式

### 模板方法模式

模板方法模式(TemplateMethod):父类中定义一组操作算法骨架,而将一些实现步骤延
迟到子类中,使得子类可以不改变父类的算法结构的同时可重新定义算法中某些实现步骤。

封装弹窗之类的公共方法

### 观察者模式

观察者模式(Observer):又被称作发布-订阅者模式或消息机制,定义了一种依赖关系,解决了主体对象与观察者之间功能的耦合。
<br />
同一个对象既可以是观察者又可以是订阅者

```js
class Observer {
  constructor() {
    this.subscribers = [];
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter((sub) => sub !== fn);
  }

  notify(data) {
    this.subscribers.forEach((sub) => sub(data));
  }
}

const observer = new Observer();
observer.subscribe((data) => console.log(`sub1: ${data}`));

observer.notify("5");
```

观察者模式最主要的作用是解决类或对象之间的耦合,解耦两个相互依赖的对象，使其依赖于观察者的消息机制。这样对于任意一个订阅者对象来说,其他订阅者对象的改变不会影响到自身。对于每一个订阅者来说，其自身既可以是消息的发出者也可以是消息的执行者，这都依赖于调用观察者对象的三种方法(订阅消息，注销消息，发布消息)中的哪一种。

### 状态模式

状态模式(State):当一个对象的内部状态发生改变时,会导致其行为的改变,这看起来像是改变了对象。

> 状态模式主要解决的是当控制一个对象状态转换的条件表达式过于复杂时的情况。把状态的判断逻辑转移到表示不同状态的一系列类中，可以把复杂的判断逻辑简化。

```js
const fn = (type, data) => {
  const data = {};
  const map = {
    a() {
      // chage data
    },
    b() {
      // chage data
    },
    c() {
      // chage data
    },
  };
  return {
    map,
  };
};
```

### 策略模式

策略模式(Strategy):将定义的一组算法封装起来,使其相互之间可以替换。封装的算法具有一定独立性,不会随客户端变化而变化。

```js
const fn = (type, data) => {
  const map = {
    a() {},
    b() {},
    c() {},
  };
  map[type] && map[type](data);
};
```

常见使用场景

- 优化 if
- 表单验证

### 职责链模式

职责链模式(Chain of Responsibility):解决请求的发送者与请求的接受者之间的耦合,通过职责链上的多个对象对分解请求流程,实现请求在多个对象之间的的传递,直到最后一个对象完成请求的处理。
<br />
职责链模式定义了请求的传递方向,通过多个对象对请求的传递,实现一个复杂的逻辑操作。因此职责链模式将负责的需求颗粒化逐一实现每个对象分内的需求,并将请求顺序地传递。对于职责链上的每一个对象来说,它都可能是请求的发起者也可能是请求的接收者。通过这样的方式不仅仅简化原对象的复杂度,而且解决原请求的发起者与原请求的接收者之间的耦合。当然也方便对每个阶段对象进行单元测试。同时对于中途插入的请求,此模式依然使用,并可顺利对请求执行并产出结果。对于职责链上的每一个对象不一定都能参与请求的传递,有时会造成一丝资源的浪费,并且多个对象参与请求的传递,这在代码调试时增加了调试成本。

### 命令模式

命令模式(Command):将请求与实现解耦并封装成独立对象,从而使不同的请求对客户端的实现参数化。
<br />
命令模式是将执行的命令封装,解决命令的发起者与命令的执行者之间的耦合。每一条命令实质上是一个操作。命令的使用者不必要了解命令的执行者(命令对象)的命令接口是如何实现的、命令是如何接受的、命令是如何执行的。所有的命令都被存储在命令对象中。命令模式的优点自然是解决命令使用者之间的耦合。新的命令很容易加入到命令系统中,供使用者使用。命令的使用具有一致性,多数的命令在一定程度上是简化操作方法的使用的。命令模式是对一些操作的封装,这就造成每执行一次操作都要调用一次命令对象,增加了系统的复杂度。

### 访问者模式

访问者模式(Visitor):针对于对象结构中的元素,定义在不改变该对象的前提下访问结构中元素的新方法。
<br />

```js
function bindIEEvent(dom, type, fn, data) {
  var data = data || {};
  dom.attachEvent("on" + type, function (e) {
    fn.call(dom, e, data);
  });
}
```

操作类数组

```js
const Visitor = (function () {
  return {
    //截取方法
    splice: function () {
      //splice方法参数,从原参数的第二个参数开始算起
      var args = Array.prototype.splice.call(arguments, 1);
      //对第一个参数对象执行splice方法
      return Array.prototype.splice.apply(arguments[0], args);
    },
    // 追加数据方法
    push: function () {
      //强化类数组对象,使他拥有1ength属性
      var len = arguments[0].length || 0;
      //添加的数据从原参数的第二个参数算起
      var args = this.splice(arguments, 1);
      //校正length属性
      arguments[0].length = len + arguments.length - 1;
      //对第一个参数对象执行push方法
      return Array.prototype.push.apply(arguments[0], args);
    },
    //弹出最后一次添加的元素
    pop: function () {
      //对第一个参数对象执行pop方法
      return Array.prototype.pop.apply(arguments[0]);
    },
  };
})();
```

::: warning
在非数组对象中使用 push()
push() 方法会读取 this 的 length 属性。然后，它将 this 的每个索引从 length 开始设置，并将参数传递给 push()。最后，它将 length 设置成之前的长度加上已添加元素的数量。
:::

### 中介者模式

中介者模式(Mediator):通过中介者对象封装一系列对象之间的交互,使对象之间不再相互引用,降低他们之间的耦合。有时中介者对象也可改变对象之间的交互。
<br />
同观察者模式一样,中介者模式的主要业务也是通过模块间或者对象间的复杂通信,来解决模块间或对象间的耦合。对于中介者对象的本质是分装多个对象的交互,并且这些对象的交互一般都是在中介者内部实现的。
<br />
与外观模式的封装特性相比,中介者模式对多个对象交互地封时装,且这些对象一般处于同一层面上,并且封装的交互在中介者内部,而外观模式封装的目的是为了提供更简单的易用接口,而不会添加其他功能。
<br />
与观察者模式相比,虽然两种模式都是通过消息传递实现对象间或模块间的解耦。观察者模式中的订阅者是双向的,既可以是消息的发布者,也可以是消息的订阅者。而在中介者模式中,订阅者是单向的,只能是消息的订阅者。而消息统一由中介者对象发布,所有的订阅者对象间接地被中介者管理。

### 备忘录模式

备忘录模式(Memento):在不破坏对象的封装性的前提下,在对象之外捕获并保存该对象内部的状态以便日后对象使用或者对象恢复到以前的的某个状态。
<br />
备忘录模式最主要的任务是对现有的数据或状态做缓存,为将来某个时刻使用或恢复做准备。在 JavaScript 编程中,备忘录模式常常运用于对数据的缓存备分,浏览器端获取的数据往往是从服务器端请求获取到的,而请求流程往往是以时间与流量为代价的。因此对重复性数据反复请求不仅增加了服务器端的压力,而且造成浏览器端对请求数据的等待进而影响用户体
验。

### 迭代器模式

迭代器模式(Iterator):在不暴露对象内部结构的同时，可以顺序地访问聚合对象内部的元素。

- 变量迭代器

```js
const getter = function (obj, key) {
  function isObject(obj) {
    return typeof obj === "object" && obj !== null;
  }
  if (!isObject(obj)) {
    return undefined;
  }
  const keys = key.split(".");
  let result = obj;
  for (let i = 0; i < keys.length; i++) {
    if (result[keys[i]] !== undefined) {
      result = result[keys[i]];
    } else {
      return undefined;
    }
  }
  return result;
};

const obj = {
  a: {
    b: {
      c: 1,
    },
  },
};

console.log(getter(obj, "a.b.c"));
```

### 解释器模式

解释器模式(Interpreter):对于一种语言，给出其文法表示形式，并定义一种解释器，通过使用这种解释器来解释语言中定义的句子。

> 文法是用来定义一组语言规则的

## 技巧型设计模式

### 链模式

链模式(OperateofResponsibility):通过在对象方法中将当前对象返回，实现对同一个对象多个方法的链式调用。从而简化对该对象的多个方法的多次调用时，对该对象的多次引用。

```js
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
new A().a().a();
```

jquery 的链式调用

```js
const B = function (selector) {
  return new B.fn.init(selector);
};
B.fn = B.prototype = {
  constructor: B,
  // 当使用new 调用init时， 此时this 指向的是init， 这里为了实现链式调用，B.fn.init.prototype = B.fn;
  init: function (selector) {
    console.log(selector);
    return this;
  },
  b() {
    console.log("b");
    return this;
  },
};
B.fn.init.prototype = B.fn;
B("b").b();
```

### 委托模式

委托模式(Entrust):多个对象接收并处理同一请求,他们将请求委托给另一个对象统一处理请求。

- 事件委托
- 防止内存泄漏

### 数据访问对象模式

数据访问对象模式(Data access object-DAO):抽象和封装对数据源的访问与存储,DAO 通过对数据源链接的管理方便对数据的访问与存储。

- 本地存储

### 节流模式

节流模式(Throttler):对重复的业务逻辑进行节流控制,执行最后一次操作并取消其他操作,以提高性能。

- 优化交互体验：延迟出现鼠标移除事件
- 优化图片加载

### 简单模板模式

简单模板模式(Simpletemplate):通过格式化字符串拼凑出视图送避免创建视图时大量节点操作。优化内存开销。

```js
// Simpletemplate 简单模板方式
//模板渲染方法
A.formateString = function (str, data) {
  return str.replace(/\{#(\w+)#\}/g, function (matchh, key) {
    return typeof data[key] === undefined ? "" : data[key];
  });
};

const listPart = function (data) {
  var s = document.createElement("div"),
    //模块容器
    ul = "",
    //列表字符串
    //列表数据
    ldata = data.data.li,
    //模块模板
    tpl = ["<h2>{#h2#}</h2>", "<p>{#p#}</p>", "<ul>{#ul#}</ul>"].join(""),
    //列表项模板
    liTpl = [
      "<li>",
      "<strong>{#strong#}</strong>",
      "<span>{#span#}</span>",
      "</li>",
    ].join("");
  //有id设置模块id
  data.id && (s.id = data.id);
  //遍历列表数据
  for (var i = 0, len = ldata.length; i < len; i++) {
    //如果有列表项数据
    if (ldata[i].em || ldata[i].span) {
      //列表字符串追加一项列表项
      ul += A.formateString(liTpl, ldata[i]);
    }
  }
  // 装饰列表数据
  data.data.ul = ul;
  //渲染模块并插入模块中
  s.innerHTML = A.formateString(tpl, data.data);
  //渲染模块
  A.root.appendChild(s);
};
```

简单模板模式意在解决运用 DOM 操作创建视图时造成资源源消耗大、性能低下、操作复杂等问题。用正则匹配方式去格式化字符串的执行的性能要远高于 DOM 操作拼接视图的执行性能,因此这种方式常备用于大型框架(如 MVC 等)创建视图操作中。
<br/>
简单模板模式主要包含三部分,字符串模板库,格式化方法,字符串拼接操作。

### 惰性模式

惰性模式(layier):减少每次代码执行时的重复性的分支判断,通过对对象重定义来屏蔽原对象中的分支判断。

- 加载即执行

```js
//添加绑定事件方法on
const A = {};
A.on = (function (dom, type, fn) {
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
```

- 惰性执行

```js
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
```

### 参与者模式

参与者(participator):在特定的作用域中执行给定的函数,并将参数原封不动地传递。

```js
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
```

新的方式, 既使用了外部变量,又避免了事件处理函数的重复创建,同时也可以移除事件处理函数。

```js
function fn() {
  console.log(...arguments);
}
function bindFn(fn, ...args) {
  return function () {
    return fn.apply(this, [...arguments, ...args]);
  };
}
const fn1 = bindFn(fn, 6, 7, 8);
fn1(1, 2, 3, 4, 5); // 1 2 3 4 5 6 7 8
```

### 等待者模式

等待者模式(waiter):通过对多个异步进程监听,来触发未来发生的动作。

## 架构型设计模式

### 同步模块模式

模块化:将复杂的系统分解成高内聚、低耦合的模块,使系统开发变得可控、可维护、可拓展,提高模块的复用率。
<br />
同步模块模式-SMD(Synchronous Module Definition):请求发出后,无论模块是否存在,立即执行后续的逻辑,实现模块开发中对模块的立即引前。

```js
// 同步模块模式-SMD(Synchronous Module Definition)

// 同步模块模式-SMD(Synchronous Module Definition)

const F = {};
F.define = function (str, fn) {
  const parts = str.split(".");
  let old = (parent = this);
  let i = 0; // 记录当前模块的层级
  // 如果第一个模式是模块管理器单体对象， 则移除
  if (parts[0] === "F") {
    parts = parts.slice(1);
  }
  // 屏蔽对于define和module的重写
  if (parts[0] === "define" || parts[0] === "module") {
    return;
  }
  // 模块层级长度
  let len = parts.length;
  for (i < len; i++; ) {
    if (typeof parent[parts[i]] === "undefined") {
      parent[parts[i]] = {};
    }
    old = parent;
    parent = parent[parts[i]];
  }
  // 如果已经给出了模块定义函数，则调用
  if (fn) {
    // --i 循环完成后 i=len，所以需要减1
    old[parts[--i]] = fn();
  }
  return this;
};

F.define("string", function () {
  return {
    a() {
      console.log("a");
    },
  };
});
F.define("dom", function () {
  return function (id) {
    console.log(id);
  };
});

F.module = function () {
  const args = Array.prototype.slice.call(arguments);
  // 获取回调函数
  const fn = args.pop();
  // 获取依赖模块
  const parts = args[0] && args[0] instanceof Array ? args[0] : args;
  // 依赖模块列表
  const modules = [];
  // 模块路由
  let modIds = "";
  // 依赖模块长度
  const len = parts.length;
  // 依赖模块层级
  let i = 0;
  let parent, j, k;
  while (i < len) {
    if (typeof parts[i] === "string") {
      parent = this;
      modIds = parts[i].replace(/^F\./, "").split(".");
      for (j = 0, k = modIds.length; j < k; j++) {
        parent = parent[modIds[j]] || false;
      }
      modules.push(parent);
    } else {
      modules.push(parts[i]);
    }
    i++;
  }
  fn.apply(null, modules);
};

F.string.a();
F.dom(123);

F.module(["string.a", "dom"], function (a, dom) {
  a();
  dom(456);
});
```

### 异步模块模式

异步模块模式--AMD(Asynchronous Module Definition):请求发出后,继续其他业务逻辑,知道模块加载完成执行后续的逻辑,实现模块开发中对模块加载完成后的引用。

### Widget

Widget:(WebWidget 指的是一块可以在任意页面中执行的代码块)Widget 模式是指借用 WebWidget 思想将页面分解成部件,针对部件开发,最终组合成完整的页面

### MVC

MVC 即模型(model)一视图(view)一控制器(controller),用一种将业务逻辑、数据、数据、视图分离的方式组织架构代码。

> 数据层部分、视图层部分、控制器层

```js
const MVC = {};
// 数据
MVC.Model = function () {};
// 视图
MVC.View = function () {};
// 控制器
MVC.Controller = function () {};
```
MVC架构模式很好地解决了页面中数据层、视图层、业务逻辑辑层(控制器)之间的耦合关系,使它们得到显性的区分,这也使得层次之间的耦合度降低。我们在开发中可以不用顾忌所有需求而专注于某一层次开发,降低了开发与维护成本,提升了开发效率。如果页面系统足够复杂,某些视图要共享同一组数据,或者某些需求的实现引用用类似视图,此时MVC模式便可提高某些视图与数据的复用率。
<br/>
因此对于大型页面系统的开发,三个层次各司其职。每一层次专专注于自己的事情,有利于工程化、模式化开发并管理代码;便于大型页面系统的可持续开发与维护;也是降低层次耦合提升代码复用的良好实践。
<br/>
在复杂组件的开发中,运用MVC思想管理组件内部的层次也是一种不错的选择。


::: tip
Model 层只存储数据
View 直接拿数据进行渲染
Controller 负责处理事件
:::




### MVP模式
MVP即模型(Model)一视图(View)一管理器(Presenter):View层不直接引用Model层内的数据,而是通过Presenter层实现对Model层内的数据访问。即所有层次的交互都发生
在Presenter层中。
<br/>
Presenter层负责管理数据、UI视图创建、交互逻辑、动画特效等等一切事务。这样数据层只负责存储数据,视图层只负责创建视图模板。
<br/>
MVP与MVC相比最重要的特征就是MVP中将视图层与数据层完全解耦,使得对视图层的修改不会影响到数据层,数据层内的数据改动又不会影响到视图层。因此,我们在管理器中对数据或者视图灵活地调用就可使数据层内的数据与视图层为的视图得到更高效的复用。因此,MVP模式也可以实现一个管理器,可以调用多个数据,已或者创建多种视图,而且是不受限制的。因而管理器有更高的操作权限,因此对于业务逻辑与需求的实现只需专注于管理器的开发即可,当然管理器内过多的逻辑也使得其开发与维护成本提高。


::: tip
Model 层只存储数据
View 模板【不直接引用Model层内的数据】
Controller 负责管理数据、UI视图创建、交互逻辑、动画特效等等一切事务
:::



### MVVM模式
MVVM模式,模型(Model)-视图(View)-视图模型(ViewModel):为视图层(View)量身定做一套视图模型(ViewModel),并在视图模型(VieewModel)中创建属性和方法,为视图层(View)绑定数据(Model)并实现交互。

小知识
```js
demo1 = {
  a: 1
}
const data1 = "type: 'JavaScript', data: demo1"
const data = new Function("return ({"+ data1 +"})")
console.log(data())
```