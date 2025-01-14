# 基础专栏

针对一些难点的基础进行整理

<script setup>
import Image from "../components/Image/index.vue"
</script>

## 原型

参考书籍《你不知道的 javascript 上》

<Image  src="./images/原型.jpg" />

### 基础

- [[Prototype]]
  - javaScript 中的对象有一个特殊的[[Prototype]]内置属性， 其实就是对其他对象的引用
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

- 变量对象(Variable object, 缩写为 VO)
- 作用域链(Scope chain)
- this
  :::

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


<!-- https://zhuanlan.zhihu.com/p/589534188 -->

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

## 资料引用：

<a href="https://www.cnblogs.com/justinw/archive/2010/04/23/1718733.html" target="_blank"  style="display: block">变量对象</a>
<a href="https://zh.javascript.info/" target="_blank"  style="display: block">学习地址</a>
