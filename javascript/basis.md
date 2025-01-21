# 基础专栏

针对一些难点的基础进行整理

<script setup>
import Image from "../components/Image/index.vue"
</script>

## 原型

> 【ECMAScript5】为其他对象提供共享属性的对象

参考书籍《你不知道的 javascript 上》

<Image  src="./images/原型.jpg" />

### 基础

- [[Prototype]]
  - javaScript 中的对象有一个特殊的[[Prototype]]内置属性， 其实就是对其他对象的引用
    > 【ECMAScript5】 每个由构造器创建的对象，都有一个隐式引用 ( 叫做对象的原型 ) 链接到构造器的“prototype”属性值
  - 所有普通的[[Prototype]]链最终都会指向内置的 Object.prototype, Object.prototype 对象包含[[Prototype]]属性，但其[[Prototype]]指向 null
  - for ... in  遍历对象原理和[[Prototype]]链类似， 任何可以通过原型链可以访问到并且是 enumerable 的属性都会被枚举
  - 使用 in 操作符检查属性在对象中是否存在， 同样会查找对象的整条原型链（无论属性是否可枚举）
- 类
  - 参考上图
  - 继承： 实际就是查找委托对象， 从原型上查找属性

### api

- Object.create()
  - 创建一个新对象， 使用现有的对象来提供新创建的对象的[[Prototype]]
  - Object.create(null) 创建一个没有[[Prototype]]的对象， 这个对象无法进行委托
- Object.getPrototypeOf()
  - 返回对象的原型
- Object.setPrototypeOf()
  - 设置对象的原型
- Object.isPrototypeOf()
  - 检查一个对象是否存在于另一个对象的原型链上
  - Foo.prototype.isPrototypeOf(a) : 在 a 的整条[[prototype]]链中是否出现过 Foo.prototype
- instanceof
  -a instanceof  Foo : instanceof 操作符的左操作数是一个普通对象 ， 右操作符是一个函数。 instanceof 回答的问题是： 在 a 的整条[[prototype]]链中 是否有指向 Foo.prototype 的对象
- <span class="k-p">**proto**</span>
  - **proto**: 相当于 getter/setter, 它并不是一个标准获取原型对象的方法
  - **proto** 属性在 ES6 中被标准化， 但并不建议使用它来访问或者修改[[Prototype]]， 因为它并不是一个正式的标准属性， 而且大多数浏览器的实现中， **proto** 后面都带有一个双下划线， 以表示它本质上是一个内部属性， 而不是正式对外公开的 API
  - Object.getPrototypeOf() 是获取对象原型的方法， 它是标准的， 而且不存在兼容性问题
  ```js
  console.log(Object.getPrototypeOf(foo) === Foo.prototype);
  console.log(Object.getPrototypeOf(foo) === foo.__proto__);
  ```
- hasOwnProperty： 只会检查属性是否在当前对象中， 不检查[[Prototype]]

```js
function Foo() {}
const foo = new Foo();

console.log(foo.__proto__ === Foo.prototype); // true
console.log(foo.__proto__.constructor === Foo); // true
console.log(Foo.prototype.constructor === Foo); // true
console.log(Foo.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true
// Foo都是继承函数的Function
console.log(Foo.__proto__ === Function.prototype); // true
console.log(Function.__proto__ === Function.prototype); // true
// Object 函数 是由 Function 构造出来的
// function Object() { [native code] }
console.log(Object.__proto__ === Function.prototype); // true
// Function.prototype.__proto__ 它是个对象， 所以它的__proto__指向Object.prototype
console.log(Function.prototype.__proto__ === Object.prototype); // true
```

这里 函数的**proto** 指向 函数的 prototype， 对象的**proto** 指向对象的构造函数的 prototype

## 原型链

如果原型对象上没有找到需要的属性或者方法引用， 引擎就会继续在[[Prototyp]]关联的对象上进行查找， 如果没有继续查找它的[[Prototype]]。 这一些列的对象的链接称为原型链

```js
function Foo() {}
const foo = new Foo();
Object.prototype.a = 2;
console.log(foo.a); // 1
```

在查找 foo.a 时， 首先在 foo 自身属性中查找，没有找到， 就会继续在 foo 的[[Prototype]]中查找，也就是 Foo.prototype， 在 Foo.prototype 中找到了也没有找到 a 属性，就继续查找, 这里查找的是 Foo.prototype 的原型对象 ， 直到找到 Object.prototype， 在 Object.prototype 中找到了 a 属性， 就返回 2

```js
console.log(foo.__proto__ === Foo.prototype); // true
console.log(Foo.prototype.__proto__ === Object.prototype); // true
```

::: warning
这个打印什么呢?

```js
console.log(foo.constructor);
```

:::

## 执行上下文

> 每次当控制器转到 ECMAScript 可执行代码的时候，即会进入到一个执行上下文。
> 执行上下文(简称-EC)是一个抽象概念，ECMA-262 标准用这个概念同可执行代码(executable code)概念进行区分。
> 标准规范没有从技术实现的角度准确定义 EC 的类型和结构;这应该是具体实现 ECMAScript 引擎时要考虑的问题。
> 活动的执行上下文在逻辑上组成一个堆栈。堆栈底部永远都是全局上下文(global context)，堆栈顶部是当前(活动的)执行上下文。堆栈在 EC 类型的变量(various kingds of EC)被推入或弹出的同时被修改
>
> ::: warning
> 每个执行上下文中都有三个重要属性
>
> - 变量对象(Variable object, 缩写为 VO)
> - 作用域链(Scope chain)
> - this
>   :::

### 可执行代码

- 全局代码(global context)
- 函数代码
- eval 代码:eval 函数被调用的时候产生的上下文

### 数据声明

如果变量与执行上下文相关，那么它自己应该知道它的数据存储在哪里和如何访问。这种机制被称作 变量对象(variable object).
变量对象 (缩写为 VO)就是与执行上下文相关的对象

- 变量 (var, VariableDeclaration);
- 函数声明 (FunctionDeclaration, 缩写为 FD);
- 以及函数的形参

### [不同执行上下文中的变量对象](https://www.cnblogs.com/justinw/archive/2010/04/23/1718733.html#variable-object-in-different-execution-contexts)

- 全局上下文的变量对象就是全局对象

  全局对象(Global object) 是在进入任何执行上下文之前就已经创建的对象；这个对象只存在一份，它的属性在程序中任何地方都可以访问，全局对象的生命周期终止于程序退出那一刻

- 函数上下文的变量对象

  在函数执行上下文中，VO 是不能直接访问的，此时由激活对象(activation object,缩写为 AO)扮演 VO 的角色。激活对象 是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。grguments 属性的值是 Arguments object：

  Arguments objects 是函数上下文里的激活对象中的内部对象，它包括下列属性：

  - callee — 指向当前函数的引用
  - length — 真正传递的参数的个数；
  - properties-indexes (字符串类型的整数) 属性的值就是函数的参数值(按参数列表从左到右排列)。 properties-indexes 内部元素的个数等于 arguments.length. properties-indexes 的值和实际传递进来的参数之间是共享的

### [分阶段处理上下文代码](https://www.cnblogs.com/justinw/archive/2010/04/23/1718733.html#phases-of-processing-the-context-code)

执行上下文的代码被分成两个基本的阶段来处理：

- 进入执行上下文
  当进入执行上下文(代码执行之前)时，VO 已被下列属性填充满(这些都已经在前文描述过)：

  - 函数的所有形式参数(如果我们是在函数执行上下文中)
    变量对象的一个属性，这个属性由一个形式参数的名称和值组成；如果没有对应传递实际参数，那么这个属性就由形式参数的名称和 undefined 值组成；

  - 所有函数声明(FunctionDeclaration, FD)
    —变量对象的一个属性，这个属性由一个函数对象(function-object)的名称和值组成；如果变量对象已经存在相同名称的属性，则完全替换这个属性。

  - **所有变量声明(var, VariableDeclaration)**
    —变量对象的一个属性，这个属性由变量名称和 undefined 值组成；如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

  ```js
  function test(a, b) {
    var c = 10;
    function d() {}
    var e = function _e() {};
  }

  test(10);
  ```

  ```
  // 执行前
  AO(test) = {
    arguments：{
        callee：test,
        length：2,
    },
    a: 10,
    b: undefined,
    c: undefined,
    d: <reference to FunctionDeclaration "d">
    e: undefined
  };
  // 执行
  AO(test) = {
    arguments：{
        callee：test,
        length：2,
    },
    a: 10,
    b: undefined,
    c: 10,
    d: <reference to FunctionDeclaration "d">
    e:  <reference to FunctionDeclaration "_e">
  };

  ```

- 执行代码
  执行代码之前 AO/VO 已经被属性

  ```js
  console.log(x); // function
  var x = 10;
  console.log(x); // 10
  x = 20;
  function x() {}
  console.log(x);
  ```

### 变量

> 任何时候，变量只能通过使用关键字才能声明。

```js
console.log(a); // undefined
console.log(b); // "b" is not defined

b = 10;
var a = 20;
```

a 是使用 var 声明的， 所以进入执行上下文时，a 已经被声明， VO 中的 a 是 undefined, 但是没有 b, 所以报`"b" is not defined`

```js
function fn1() {
  console.log(a); //  a is not defined
  a = 1;
}

fn1();
```

解释, 执行 console.log(a)时

```
AO(fn1) = {
    arguments：{
        callee：fn1,
        length：0,
    },
}
```

```js
function fn2() {
  a = 2;
  console.log(a); // 2
}

fn2();

function fn3() {
  console.log(a); // 2
  a = 3;
}

fn3();
```

解释

```
AO(fn1) = {
    arguments：{
        callee：fn1,
        length：0,
    },
}
globalVO = {
    a: 2
    fn2 : <reference to FunctionDeclaration "fn2">
    fn3 : <reference to FunctionDeclaration "fn3">
}
```

## this

参考书籍《你不知道的 javascript 上》

<Image  src="./images/你不知道的javascript上.jpg" />

### 基础

- 普通函数
  - this 在任何情况下都不指向函数的词法作用域
  - this 实际上是在函数被调用时发生的绑定， 它指向什么完全取决于函数在哪里被调用
    > this 执行为当前执行环境（执行上下文）的 ThisBinding。ThisBinding 就是 this 的值。
- 箭头函数
  - 箭头函数体内的 this 对象就是定义时所在的对象，而不是使用时所在的对象
  - 是箭头函数根本没有自己的 this，导致内部的 this 就是外层代码块的 this

### 解析

- 调用位置
  - 调用位置：函数在代码中被调用的位置（而不是声明的位置）.
  - 调用栈：为了到达当前执行位置所调用的所有函数
- <span class="k-p">绑定规则</span>
  - 默认绑定
    - 独立函数调用
      - 非严格模式 window
      - 严格模式 undefined
  - 隐式绑定：当函数引用有山下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象
  - 显式绑定
    - API 调用的"上下文"
    - call apply bind
    - new 绑定
      - new 操作符会进行如下操作
        - 创建一个全新的对象
        - 新对象会被执行[[Prototype]]连接
        - 新对象会绑定到函数调用的 this
        - 如果函数没有返回其他对象，表达式会返回这个新对象
    - 优先级
      - new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定
    - 绑定例外:忽略的 this
      - call apply bind  会忽略   null 或者 undefined 作为 this 的 绑定对象
      - 使用 Object.create()，创建{}， 并委托 this,更安全

### Reference 规范类型

#### 基础

Reference Type 是 ECMA 中的一个“规范类型”。我们不能直接使用它，但它被用在 JavaScript 语言内部，用来描述语言底层行为逻辑，定义为“被解析的命名绑定

Reference Type

- base 是对象。<br />
  在 JavaScript 中，所有对象或者函数都有所属对象。在全局上下文中，base 等同于全局对象（global）；在函数的执行上下文中，base 等同于变量对象（vo）或活动对象（AO）；而在处理对象属性时，base 等同于所属的对象（owerObject）
- propertyname 是属性名。
- strict 在 use strict 模式下为 true

引用：https://blog.csdn.net/fishmemory7sec/article/details/140799426

```js
var foo = 1;
fooReference = {
  base: "EnvironmentRecord",
  propertyName: "foo",
  strict: false,
};
```

```js
var foo = {
  bar: function () {
    return this;
  },
};
foo.bar();

barReference = {
  base: foo,
  propertyName: "bar",
  strict: false,
};
```

#### 与 this 的关系

- 计算 MemberExpression 的结果赋值给 ref；
- 判断 ref 是不是一个 Reference 类型；

  - 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true( base value 是一个对象，就返回 true)，那么 this 的值为 GetBase(ref)；
  - 如果 ref 是 Reference，并且 base value 值是 Environment Record，那么 this 的值为 ImplicitThisValue(ref)；
  - 如果 ref 不是 Reference，那么 this 的值为 undefined；

  ::: info
  MemberExpression: 简单理解就是括号左侧的内容**取的是表达式， 不是表达式的执行结果**

  ```js
  function foo() {
    return function () {
      return this;
    };
  }

  foo()(); // MemberExpression是 foo()

  var foo = {
    bar: function () {
      return this;
    },
  };
  foo.bar(); // MemberExpression是 foo.bar
  ```

  ```js
  var value = 1;
  var foo = {
    value: 2,
    bar: function () {
      return this.value;
    },
  };
  console.log(foo.bar()); // 2 MemberExpression是  foo.bar

  reference = {
    base: foo,
    propertyName: "bar",
    strict: false,
  };

  // this => GetBase(reference) => foo

  console.log(foo.bar()); // 2

  console.log((foo.bar = foo.bar)()); // 1 undefined => window

  console.log((false || foo.bar)()); // 1

  console.log((foo.bar, foo.bar)()); // 1
  ```

  :::

## 作用域

参考书籍《你不知道的 javascript 上》

### 作用域

> 负责收集并维护由所有声明的标识符（标量）组成的查询。确定当前执行的代码对这些标识符的访问权限
> <Image  src="./images/作用域是什么.jpg" />

### 词法作用域

<Image  src="./images/词法作用域.jpg" />

### 函数作用域和块级作用域

<Image  src="./images/函数作用域和块作用域.jpg" />

### 变量提升

<Image  src="./images/变量提升.jpg" />

::: info
静态作用域：作用域是在定义时确定的 <br />
动态作用域：作用域是在运行时确定的
:::

```js
const value = 1;
function fn() {
  console.log(value);
}

function bar() {
  const value = 2;
  fn();
}
bar();
```

### 作用域链

引擎从当前执行的作用域开始查找变量，如果找不到，就向上一级词法作用域继续查找，直达抵达最外层的全局作用域，无论找到还是没找到，查找过程就会停止

```js
[[scope]]
function fn1() {
  function fn2() {

  }
}
fn1.[[scope]] = [
  globalContext.VO,

]
fn2.[[scope]] = [
  fn1Context.AO,
  globalContext.VO
]

```

```JS
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    return scope;
}
checkscope();

// 执行前
checkscope.[[scope]] = [
   globalContext.VO
]
// 执行堆栈
ESC stack = [
  checkscopeContext,
  globalContext
]
// 执行上下文[准备 + 执行]
// 调用 checkscope时， 不会立即执行
// 准备工作  VO scope chain this
checkscopeContext= {
   AO: {
      arguments：{
          callee：checkscope,
          length：0,
      },
      scope: undefined
   },
   Scope chain: [AO, ...checkscope.[[scope]]]
}
// 执行
checkscopeContext= {
   AO: {
      arguments：{
          callee：checkscope,
          length：0,
      },
      scope: "local scope"
   },
   Scope chain: [AO, ...checkscope.[[scope]]]
}
 // 这里没有写 globalContext.VO 中 scope的未写
```

### 闭包

<Image  src="./images/闭包.jpg" />
闭包 = 函数 + 函数能够访问函数外的变量
> MDN:闭包是由函数以及函数声明所在的词法环境组合而成的。该环境包含了这个闭包创建时作用域内的任何局部变量

## 函数的参数传递

ECMAScript 中所有的函数的参数都是按值传递的， 也就是说，把函数外部的值复制给函数内部的参数，基本类型如同变量的复制一样，<font color='red'>引用类型同基本类型的复制一样（指针）</font>

```js
var value = 1;
function fn(v) {
  v = 2;
  console.log(v);
}
fn(value);
console.log(value);
```

```js
var obj = {
  value: 1,
};
function fn(obj) {
  obj.value = 2;
  console.log(obj); // { value: 2 }
}
fn(obj);
console.log(obj); // { value: 2 }
```

```js
var obj = {
  value: 1,
};
function fn(obj) {
  obj = 2;
  console.log(obj); // 2
}
fn(obj);
console.log(obj); // { value: 2 }
```

## call, apply bind

介绍 this 的时候已经介绍过， 直接上代码

### call 实现

#### 人家的

```js
function fn() {
  console.log(this);
}
fn.call({ name: "test" }); // {name: 'test'}
fn.call(1); // [Number: 1]
fn.call(null); // undefined / window /global 就是不生效的意思
fn.call(undefined); // undefined / window /global 就不生效的意思
fn.call(false); // [Boolean: false]

var foo = {
  value: 1,
  bar() {
    console.log(this);
    return this.value;
  },
};
foo.bar(); // 1
foo.bar.call(null); // undefined / window /global 就不生效的意思
```

#### 自己的

```js
Function.prototype.call = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("this is not a function");
  }
  // null 和 undefined 不处理
  if (context === null || context === undefined) return this(...args);
  // 基本类型
  if (typeof context !== "object") {
    context = Object(context);
  }
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
```

### apply 实现

```js
Function.prototype.apply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("this is not a function");
  }
  // null 和 undefined 不处理
  const arrayArgs = Array.isArray(args) ? args : [args];
  if (context === null || context === undefined) return this(...arrayArgs);
  // 基本类型
  if (typeof context !== "object") {
    context = Object(context);
  }
  context.fn = this;
  const result = context.fn(...arrayArgs);
  delete context.fn;
  return result;
};
```

### bind 实现

#### 人家的

```js
var foo = {
  value: 1,
  bar(...args) {
    console.log(this, ...args); // [undefined / window /global ]  1,2,3,4
    return this.value;
  },
};
let bar = foo.bar.bind(null, 1, 2);
bar(3, 4);
```

#### 自己的

```js
Function.prototype.bind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("this is not a function");
  }
  const self = this;
  return function (...args2) {
    return self.apply(context, args.concat(args2));
  };
};
```

new 绑定 this 的优先级高于 bind 绑定 this 的优先级， 所以 new 的时候， bind 的 this 会被忽略

```js
var value = 2;
var foo = {
  value: 1,
};
function bar(name, age) {
  this.a = 1;
  console.log(this.value);
  console.log(name);
  console.log(age);
}
bar.prototype.b = "b";
var bindFoo = bar.bind(foo, "c");
var obj = new bindFoo("d");

console.log(obj.a);
console.log(obj.b);

// undefined  [this.value] // 这里的this并没有指向foo
// c
// d
// 1
// b
```

调整后的

```js
Function.prototype.bind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("this is not a function");
  }
  const self = this;
  function Fn() {}
  const _bind = function (...args2) {
    // 判断当前是否当作构造函数使用
    // 这里的this 指向的是创建的实例
    return self.apply(this instanceof Fn ? this : context, args.concat(args2));
  };
  // 这里考虑bind返回的函数当作构造函数使用
  Fn.prototype = this.prototype;
  _bind.prototype = new Fn();
  return _bind;
};
```

### new 实现

new 可以获取构造函数中 this 指向的属性 与原型的方法

```js
function objectFactory() {
  const obj = new Object();
  const Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, arguments); // 将构造函数的this指向obj
  // 对象且不为null则返回对应构造函数的值
  return typeof obj === "object" && obj !== null ? result : obj;
}
```

## 类数组对象和 arguments

### 基础

类数组（Array-like object）是 JavaScript 中的一种特殊对象，它具有某些类似于数组的特性，但并不是真正的数组。以下是类数组的一些特点：

- 索引访问：类数组对象的元素可以通过数字索引进行访问，就像在数组中一样。
- length 属性：通常类数组对象会有一个 length 属性，表示可枚举属性的最大整数索引加一。
- 非负整数键：类数组对象的键通常是连续的非负整数，从 0 开始。
- 不是实例：类数组对象不是 Array 的实例，因此不能直接使用数组的方法，如 push, pop, map 等等。

```js
const arrLikes = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
};
```

```js
function foo() {
  console.log(arguments);
}

foo(1, 2, 3); // Arguments(3) [1, 2, 3, callee: (...), Symbol(Symbol.iterator): ƒ]
```

### 转换方法

- Array.from()
- 使用扩展运算符（spread operator）（ES6+）
- Array.prototype.slice.call()

```JS
  var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }
  // 1. slice
  Array.prototype.slice.call(arrayLike); // ["name", "age", "sex"]
  // 2. splice
  Array.prototype.splice.call(arrayLike, 0); // ["name", "age", "sex"]
  // 3. ES6 Array.from
  Array.from(arrayLike); // ["name", "age", "sex"]
  // 4. apply
  Array.prototype.concat.apply([], arrayLike)
```

### 常见的类数组

- 函数的 arguments 对象
- DOM 元素的集合，如 document.getElementsByTagName() 返回的 NodeList

## [异步编程](https://x1mnl9knbjp.feishu.cn/docx/KOISdGpg1orK7sxQ4CKcnzJYnHg)

### Promise

#### 基础

<a href="https://es6.ruanyifeng.com/#docs/promise" target="_blank"  style="display: block">Promise</a>

#### 特点

- 状态不受外界影响,只有异步操作的结果
  - pedding
  - fulfilled
  - rejected
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果**状态不可逆**
  - pedding =》 fulfilled
  - pedding =》 rejected
- throw 可以触发 rejected
- then 方法返回的是一个新的 Promise 实例，因此可以采用链式写法
  - then 方法接受两个参数，第一个是 resolved 状态的回调函数，第二个是 rejected 状态的回调函数
  - then 方法返回的 Promise 实例，会等待回调函数执行完，才会执行下一个 then 方法指定的回调函数

#### 实现

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误直接执行reject
      this.reject(e);
    }
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
  }

  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }

  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
    // 执行保存的失败回调
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected

    // 参数校验，确保一定是函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    var thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        setTimeout(() => {
          try {
            const x = cb(this.PromiseResult);
            if (x === thenPromise) {
              // 不能返回自身哦
              throw new Error("不能返回自身。。。");
            }
            if (x instanceof MyPromise) {
              // 如果返回值是Promise
              // 如果返回值是promise对象，返回值为成功，新promise就是成功
              // 如果返回值是promise对象，返回值为失败，新promise就是失败
              // 谁知道返回的promise是失败成功？只有then知道
              x.then(resolve, reject);
            } else {
              // 非Promise就直接成功
              resolve(x);
            }
          } catch (err) {
            // 处理报错
            reject(err);
            throw new Error(err);
          }
        });
      };

      if (this.PromiseState === "fulfilled") {
        // 如果当前为成功状态，执行第一个回调
        resolvePromise(onFulfilled);
      } else if (this.PromiseState === "rejected") {
        // 如果当前为失败状态，执行第二个回调
        resolvePromise(onRejected);
      } else if (this.PromiseState === "pending") {
        // 如果状态为待定状态，暂时保存两个回调
        // 如果状态为待定状态，暂时保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
      }
    });

    // 返回这个包装的Promise
    return thenPromise;
  }

  static all(promises) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        result[index] = value;
        count++;
        if (count === promises.length) resolve(result);
      };
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              addData(index, res);
            },
            (err) => reject(err)
          );
        } else {
          addData(index, promise);
        }
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
        } else {
          resolve(promise);
        }
      });
    });
  }
}
```

### generator

#### 基础

<a href="https://es6.ruanyifeng.com/#docs/generator" target="_blank"  style="display: block">generator</a>

### async/await

用同步方式执行异步操作

#### 基础

<a href="https://es6.ruanyifeng.com/#docs/async" target="_blank"  style="display: block">async</a>

#### 注意点

> for 循环 和 reduce 配合使用

错误用法<Badge type="danger" text="错误" />

```js
function dbFuc(db) {
  //这里不需要 async
  let docs = [{}, {}, {}];

  // 可能得到错误结果
  docs.forEach(async function (doc) {
    await db.post(doc);
  });
}
```

正确用法<Badge type="tip" text="重要" class="badge-sucess" />

```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];

  for (let doc of docs) {
    await db.post(doc);
  }
}

// 或者

async function dbFuc(db) {
  let docs = [{}, {}, {}];

  await docs.reduce(async (_, doc) => {
    await _;
    await db.post(doc);
  }, undefined);
}
```

#### 按顺序执行 <Badge type="warning" text="重要" />

- 使用 for of + async await 遍历
  ```js
  async function logInOrder(urls) {
    for (const url of urls) {
      const response = await fetch(url);
      console.log(await response.text());
    }
  }
  ```
- 使用 reduce 遍历

  ```js
  function logInOrder(urls) {
    // 远程读取所有URL
    const textPromises = urls.map((url) => {
      return fetch(url).then((response) => response.text());
    });

    // 按次序输出
    textPromises.reduce((chain, textPromise) => {
      return chain.then(() => textPromise).then((text) => console.log(text));
    }, Promise.resolve());
  }
  ```

#### 实现

async/await 是一种语法糖：用到的是 ES6 里的迭代函数——generator 函数。 Generator 函数和自动执行器，包装在一个函数里。

- Generator 函数 yield 接 promise

```js
function fn(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num);
    }, 1000);
  });
}
function* gen() {
  yield fn(1);
  yield fn(2);
  return 3;
}
const g = gen();
console.log(g.next()); // { value: Promise { <pending> }, done: false }
console.log(g.next()); // { value: Promise { <pending> }, done: false }
console.log(g.next()); // { value: 3, done: true }
```

- 获取 promise 的值

```js
const g = gen();
next1 = g.next();
next1.value.then((res) => {
  console.log(res); // 1
  const next2 = g.next(res);
  next2.value.then((res) => {
    console.log(res); // 2
    const next3 = g.next(res);
    console.log(next3); // { value: 3, done: true }
  });
});
```

- [后续参考 九思-前端异步编程规范](https://x1mnl9knbjp.feishu.cn/docx/KOISdGpg1orK7sxQ4CKcnzJYnHg)

## 模块化

### 基础

#### 什么是模块

- 将一个复杂的程序依据一定的规则(规范)封装成几个块(文件)，并进行组合在一起；
- 块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信

#### 模块化解决的问题

- 外部模块的管理；
- 内部模块的组织；
- 模块源码到目标代码的编译和转换

#### 发展进程

1.  全局 function
    ```js
    function a() {}
    ```
2.  namespace 模式
    ```js
    let myModule = {
      data: "www.baidu.com",
      foo() {
        console.log(`foo() ${this.data}`);
      },
      bar() {
        console.log(`bar() ${this.data}`);
      },
    };
    myModule.data = "other data"; //能直接修改模块内部的数据
    myModule.foo(); // foo() other data
    ```
3.  IFEE 模式
    匿名函数自调用(闭包)

- 作用：数据是私有的, 外部只能通过暴露的方法操作
- 编码：将数据和行为封装到一个函数内部, 通过给 window 添加属性来向外暴露接口
- 问题：如果当前这个模块依赖另一个模块怎么办?

  ```js
    // index.html文件
    <script type="text/javascript" src="module.js"></script>
    <script type="text/javascript">
        myModule.foo()
        myModule.bar()
        console.log(myModule.data) //undefined 不能访问模块内部数据
        myModule.data = 'xxxx' //不是修改的模块内部的data
        myModule.foo() //没有改变
    </script>

    // module.js文件
    (function(window) {
      let data = 'www.xianzao.com'
      //操作数据的函数
      function foo() {
        //用于暴露有函数
        console.log(`foo() ${data}`)
      }
      function bar() {
        //用于暴露有函数
        console.log(`bar() ${data}`)
        otherFun() //内部调用
      }
      function otherFun() {
        //内部私有的函数
        console.log('otherFun()')
      }
      //暴露行为
      window.myModule = { foo, bar } //ES6写法
    })(window)
  ```

4.  IIFE 模式增强

#### 优点

- 避免命名冲突(减少命名空间污染)；
- 更好的分离, 按需加载；
- 更高复用性；
- 高可维护性；

### 模块化规范

#### CommonJS

- **概念** <br />
  Node 应用由模块组成，采用 CommonJS 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。
- **特点** <br />
  - 所有代码都运行在模块作用域，不会污染全局作用域；
  - 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存；
  - 模块加载的顺序，按照其在代码中出现的顺序；
- **基本语法** <br />
  - 暴露模块：`module.exports = value`或`exports.xxx = value`
  - 引入模块：`require(xxx)`,如果是第三方模块，xxx 为模块名；如果是自定义模块，xxx 为模块文件路径
    ::: tip
    CommonJS 暴露的模块到底是什么? CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性
    :::
    ```js
    // example.js
    var x = 5;
    var addX = function (value) {
      return value + x;
    };
    module.exports.x = x;
    module.exports.addX = addX;
    ```
    上面代码通过 module.exports 输出变量 x 和函数 addX
    ```js
    var example = require("./example.js"); //如果参数字符串以“./”开头，则表示加载的是一个位于相对路径
    console.log(example.x); // 5
    console.log(example.addX(1)); // 6
    ```
    require 命令用于加载模块文件。require 命令的基本功能是，读入并执行一个 JavaScript 文件，然后返回该模块的 exports 对象。如果没有发现指定模块，会报错。
  - **机制** <Badge type="danger" text="重要" /> <br />
    CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
- **服务端使用** <br />
  可以直接使用， 不需要经过特殊处理
- **浏览器端使用** <br />
  使用 Browserify：Browserify 会对代码进行解析，整理出代码中的所有模块依赖关系，然后把相关的模块代码都打包在一起，形成一个完整的 JS 文件，这个文件中不会存在 require 这类的模块化语法，变成可以在浏览器中运行的普通 JS 文件<br />

#### AMD（Asynchronous Module Definition）

- **概念** <br />
  CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD 规范则是非同步加载模块，允许指定回调函数。由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用 AMD 规范。此外 AMD 规范比 CommonJS 规范在浏览器端实现要来着早。
- **语法** <br />
  定义暴露模块：

  ```js
  //定义没有依赖的模块
  define(function () {
    return 模块;
  });

  //定义有依赖的模块
  define(["module1", "module2"], function (m1, m2) {
    return 模块;
  });
  ```

  引入使用模块：

  ```js
  require(["module1", "module2"], function (m1, m2) {
    使用m1 / m2;
  });
  ```

- **使用** <br />
  需要使用 require.js。 RequireJS 是一个工具库，主要用于客户端的模块管理。它的模块管理遵守 AMD 规范，RequireJS 的基本思想是，通过 define 方法，将代码定义为模块；通过 require 方法，实现代码的模块加载
  <br />  
   接下来介绍 AMD 规范在浏览器实现的步骤：

  1. 下载 require.js, 并引入

     - 官网: http://www.requirejs.cn/
     - github : https://github.com/requirejs/requirejs
       然后将 require.js 导入项目: js/libs/require.js

  2. 创建项目结构

     ```js
     |-js
       |-libs
         |-require.js
       |-modules
         |-alerter.js
         |-dataService.js
       |-main.js
       |-index.html
     ```

     - 定义 require.js 的模块代码

     ```js
     // dataService.js文件
       // 定义没有依赖的模块
       define(function() {
        let msg = 'www.xianzao.com'
        function getMsg() {
        return msg.toUpperCase()
        }
        return { getMsg } // 暴露模块
       })

     //alerter.js 文件
     // 定义有依赖的模块
     define(['dataService'], function(dataService) {
      let name = 'xianzao'
      function showMsg() {
      alert(dataService.getMsg() + ', ' + name)
      }
      // 暴露模块
      return { showMsg }
     })

     // main.js 文件
     (function() {
      require.config({
      baseUrl: 'js/', //基本路径 出发点在根目录下
      paths: {
      //映射: 模块标识名: 路径
      alerter: './modules/alerter', //此处不能写成 alerter.js,会报错
      dataService: './modules/dataService'
      }
      })
      require(['alerter'], function(alerter) {
      alerter.showMsg()
      })
     })()

     // index.html 文件

     <!DOCTYPE html>
     <html>
       <head>
         <title>Modular Demo</title>
       </head>
       <body>
         <!-- 引入require.js并指定js主文件的入口 -->
         <script data-main="js/main" src="js/libs/require.js"></script>
       </body>
     </html>
     ```
    - 在index.html引入
    ```html
    <script data-main="js/main" src="js/libs/require.js"></script>
    ```


#### CMD(Common Module Definition)
- **概念** <br />
  CMD规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD规范整合了CommonJS和AMD规范的特点。在 Sea.js 中，所有 JavaScript 模块都遵循 CMD模块定义规范。
- **基本语法** <br />
  ```js
    //定义没有依赖的模块
    define(function(require, exports, module){
      exports.xxx = value
      module.exports = value
    })
  ```
  ```js
  //定义有依赖的模块
    define(function(require, exports, module){
      //引入依赖模块(同步)
      var module2 = require('./module2')
      //引入依赖模块(异步)
        require.async('./module3', function (m3) {
        })
      //暴露模块
      exports.xxx = value
    })
  ```
  ```js
  // 引入使用的模块
  define(function (require) {
    var m1 = require('./module1')
    var m4 = require('./module4')
    m1.show()
    m4.show()
  })
  ```
- **使用** <br />
需要使用 sea.js
1. 下载sea.js, 并引入
  - 官网: http://seajs.org/
  - github : https://github.com/seajs/seajs
  然后将sea.js导入项目：js/libs/sea.js
  1. 创建项目结构
  ```js
      |-js
        |-libs
          |-sea.js
        |-modules
          |-module1.js
          |-module2.js
          |-module3.js
          |-module4.js
          |-main.js
      |-index.html
  ```
  1. 定义sea.js的模块代码
  ```js
      // module1.js文件
    define(function (require, exports, module) {
      //内部变量数据
      var data = 'xianzao.com'
      //内部函数
      function show() {
        console.log('module1 show() ' + data)
      }
      //向外暴露
      exports.show = show
    })

    // module2.js文件
    define(function (require, exports, module) {
      module.exports = {
        msg: 'I am xianzao'
      }
    })

    // module3.js文件
    define(function(require, exports, module) {
      const API_KEY = 'abc123'
      exports.API_KEY = API_KEY
    })

    // module4.js文件
    define(function (require, exports, module) {
      //引入依赖模块(同步)
      var module2 = require('./module2')
      function show() {
        console.log('module4 show() ' + module2.msg)
      }
      exports.show = show
      //引入依赖模块(异步)
      require.async('./module3', function (m3) {
        console.log('异步引入依赖模块3  ' + m3.API_KEY)
      })
    })

    // main.js文件
    define(function (require) {
      var m1 = require('./module1')
      var m4 = require('./module4')
      m1.show()
      m4.show()
    })
  ```
  2. 在index.html中引入
  ```html
    <script type="text/javascript" src="js/libs/sea.js"></script>
    <script type="text/javascript">
      seajs.use('./js/modules/main')
    </script>
  ```

#### ES6 模块化

- **概念** <br />
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

- **使用** <br />
export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
```JS
  /** 定义模块 math.js /
  var basicNum = 0;
  var add = function (a, b) {
      return a + b;
  };
  export { basicNum, add };
  / 引用模块 **/
  import { basicNum, add } from './math';
  function test(ele) {
      ele.textContent = add(99 + basicNum);
  }
```
如上例所示，使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出
```JS
  // export-default.js
  export default function () {
    console.log('foo');
  }

  // import-default.js
  import customName from './export-default';
  customName(); // 'foo'
```

#### UMD(Universal Module Definition)
是一种javascript通用模块定义规范，让你的模块能在javascript所有运行环境中发挥作用。
意味着要同时满足CommonJS, AMD, CMD的标准，以下为实现：
```JS
  (function(root, factory) {
      if (typeof module === 'object' && typeof module.exports === 'object') {
          console.log('是commonjs模块规范，nodejs环境')
          module.exports = factory();
      } else if (typeof define === 'function' && define.amd) {
          console.log('是AMD模块规范，如require.js')
          define(factory)
      } else if (typeof define === 'function' && define.cmd) {
          console.log('是CMD模块规范，如sea.js')
          define(function(require, exports, module) {
              module.exports = factory()
          })
      } else {
          console.log('没有模块环境，直接挂载在全局对象上')
          root.umdModule = factory();
      }
  }(this, function() {
      return {
          name: '我是一个umd模块'
      }
  }))
```


#### 区别
- **AMD 与 CMD** <br />
  ```JS
  // CMD
    define(function (requie, exports, module) {
        //依赖就近书写
        var module1 = require('Module1');
        var result1 = module1.exec();
        module.exports = {
          result1: result1,
        }
    });

    // AMD
    define(['Module1'], function (module1) {
        var result1 = module1.exec();
        return {
          result1: result1,
        }
    });
  ```
  1. 对依赖的处理：
    - AMD推崇依赖前置，即通过依赖数组的方式提前声明当前模块的依赖；
    - CMD推崇依赖就近，在编程需要用到的时候通过调用require方法动态引入；
  2. 在本模块的对外输出：
    - AMD推崇通过返回值的方式对外输出；
    - CMD推崇通过给module.exports赋值的方式对外输出；

- **ES6 与 CommonJS** <br />
1.  CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用；
  ```JS
   // lib.js
    export let counter = 3;
    export function incCounter() {
      counter++;
    }
    // main.js
    import { counter, incCounter } from './lib';
    console.log(counter); // 3
    incCounter();
    console.log(counter); // 4
  ```
  ES6 模块的运行机制与 CommonJS 不一样。ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口；
   CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。


#### 总结
1. CommonJS规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了AMD CMD解决方案；
2. AMD规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅；
3. CMD规范与AMD规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js中运行；
4. ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案；
5. UMD为同时满足CommonJS, AMD, CMD标准的实现；

### 资料引用

[JavaScript 模块化详解](https://nwy3y7fy8w5.feishu.cn/docx/HY9gdEHZUodHurxET4MceoPUnuc)<br />

## 资料引用：

<a href="https://www.cnblogs.com/justinw/archive/2010/04/23/1718733.html" target="_blank"  style="display: block">变量对象</a>
<a href="https://zh.javascript.info/" target="_blank"  style="display: block">学习地址</a>
<a href="http://yanhaijing.com/es5/#null" target="_blank"  style="display: block">ECMAScript5.1 中文版</a>
<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript" target="_blank"  style="display: block">MDN</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/SH4wd5cRSopC1XxDVPScxz3Fnoc" target="_blank"  style="display: block">澄怀-面向对象编程/原型及原型链</a>
<a href="https://x1mnl9knbjp.feishu.cn/docx/KOISdGpg1orK7sxQ4CKcnzJYnHg" target="_blank"  style="display: block">九思-前端异步编程规范</a>
<a href="https://x1mnl9knbjp.feishu.cn/drive/folder/PV2Tfhdbsl7ZfIdO24fcCZ38nZd" target="_blank"  style="display: block">内功修炼</a>
