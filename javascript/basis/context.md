# 执行上下文

<script setup>
import Image from "../../components/Image/index.vue"
</script>



## 基础

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

## 可执行代码

- 全局代码(global context)
- 函数代码
- eval 代码:eval 函数被调用的时候产生的上下文

## 数据声明

如果变量与执行上下文相关，那么它自己应该知道它的数据存储在哪里和如何访问。这种机制被称作 变量对象(variable object).
变量对象 (缩写为 VO)就是与执行上下文相关的对象

- 变量 (var, VariableDeclaration);
- 函数声明 (FunctionDeclaration, 缩写为 FD);
- 以及函数的形参

## [不同执行上下文中的变量对象](https://www.cnblogs.com/justinw/archive/2010/04/23/1718733.html#variable-object-in-different-execution-contexts)

- 全局上下文的变量对象就是全局对象

  全局对象(Global object) 是在进入任何执行上下文之前就已经创建的对象；这个对象只存在一份，它的属性在程序中任何地方都可以访问，全局对象的生命周期终止于程序退出那一刻

- 函数上下文的变量对象

  在函数执行上下文中，VO 是不能直接访问的，此时由激活对象(activation object,缩写为 AO)扮演 VO 的角色。激活对象 是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。grguments 属性的值是 Arguments object：

  Arguments objects 是函数上下文里的激活对象中的内部对象，它包括下列属性：

  - callee — 指向当前函数的引用
  - length — 真正传递的参数的个数；
  - properties-indexes (字符串类型的整数) 属性的值就是函数的参数值(按参数列表从左到右排列)。 properties-indexes 内部元素的个数等于 arguments.length. properties-indexes 的值和实际传递进来的参数之间是共享的

## [分阶段处理上下文代码](https://www.cnblogs.com/justinw/archive/2010/04/23/1718733.html#phases-of-processing-the-context-code)

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

## 变量

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
