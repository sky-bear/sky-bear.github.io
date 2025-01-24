# let 和 const

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## 块级作用域

<Image  src="./images/块级作用域.jpg" />
函数声明

```js
// 浏览器的 ES6 环境
function f() {
  console.log("I am outside!");
}

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() {
      console.log("I am inside!");
    }
  }

  f();
})();
// Uncaught TypeError: f is not a function
```

上面的代码在 ES6 浏览器中，都会报错。

原来，如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。为了减轻因此产生的不兼容问题，ES6 在附录 B 里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。

允许在块级作用域内声明函数。
函数声明类似于 var，即会提升到全局作用域或函数作用域的头部。
同时，函数声明还会提升到所在的块级作用域的头部。
注意，上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作 let 处理。

根据这三条规则，浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于 var 声明的变量

## var 声明的缺点

- 变量提升
- 无法形成词法作用域
- 可以重复声明， 随意改变

## let 声明变量

### 基本使用

- 声明的变量只在 let 命令所在的代码块内有效
- for 循环设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

```js
for (let i = O; i < 3; i++) {
  let i＝ "abc"
  console.log(i);
  // abc
}
```

::: warning
for 循环中每一轮的变量都是重新声明的,所以当前的 i 只在本轮循环有效
:::

```js
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
```

### 不存在变量提升

var 命令会发生“变量提升”现象， 即变量可以在声明之前使用，值为 undefined。
let 命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错。

```js
console.log(foo); // undefined
var foo = 2;
console.log(bar); // ReferenceError
let bar = 2;
```

### 暂时性死区

ES6 明确规定，如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）

```js
typeof x; // 'undefined'

typeof a; // ReferenceError
let a;
```

:::warning
暂时性死区的本质就是，只要进入当前作用域，所要使用的变量就己经存在，但是
不可获取，只有等到声明变量的那一行代码出现， 才可以获取和使用该变量。
:::

### 不允许重复声明

let 不允许在相同作用域内重复声明同一个变量

## const

### 基本使用

const 声明一个只读的常量。 一旦声明，常量的值就不能改变

### 不存在变量提升

只在声明所在的块级作用域内有效

### 暂时性死区

const 命令声明的常量也不会提升，同样存在暂时性死区，只能在声明后使用

### 不允许重复声明

const 不允许在相同作用域内重复声明同一个变量

::: danger
<span class="k-p">**const 实际上保证的并不是变量的值不得改动，而是变量指向的那个内存地址不得改动**</span>
:::

## 深入理解原理

JavaScript 引擎在处理 let 和 const 时，实际上是在编译阶段就确定了每个变量的作用域和生命周期。具体来说

1. 词法环境 (Lexical Environment)：
   每个作用域都有一个关联的词法环境结构，它存储了该作用域内的所有变量和函数声明。对于 let 和 const，它们会添到当前的词法环境中，但只有当执行流到达它们的声明位置时才会被初始化。
2. 环境记录 (Environment Record)：
   词法环境包含一个环境记录，用来保存变量和函数声明的具体信息。let 和 const 的声明会在这个环境中注册，但在进入 TDZ 后尝试访问这些变量会导致错误。
3. 执行上下文 (Execution Context)：
   当代码被执行时，JavaScript 引擎会创建一个新的执行上下文，这个上下文包含了当前正在执行的代码段的相关信息，如变量、函数等。let 和 const 的声明会影响这个上下文中的变量环境。
4. 垃圾回收 (Garbage Collection)：
   由于 let 和 const 有明确的作用域边界，一旦超出其作用域，变量就可以被标记为不再需要，并且可以由垃圾回收机制清理掉。这有助于更有效地管理内存。


<Image  src="./images/let&const-1.png" />
<Image  src="./images/let&const-2.png" />

### let 的底层实现过程


1. 编译阶段
在代码编译阶段，编译器会扫描整个函数体（或全局作用域），查找所有使用 let 定义的变量，为这些变量生成一个初始值 不为undefined 的词法环境（LexicalEnvironment）并将其保存在作用域链中。

::: warning
编译，DSL（领域语言）。在代码编译阶段，编译器会扫描整个函数体（或全局作用域），查找所有使用 let 定义的变量，将变量放入词法环境（LexicalEnvironment）（注意，这里并未对齐进行赋值 undefined 的操作）并将其保存在作用域链中。
:::



2. 进入执行上下文
当进入执行块级作用域（包括 for、if、while 和 switch 等语句块）后，会创建一个新的词法环境。如果执行块级作用域中包含 let 变量声明语句，这些变量将被添加到这个词法环境的环境记录中。

3. 绑定变量值
运行到 let 定义的变量时，JavaScript 引擎会在当前词法环境中搜索该变量。首先在当前环境记录中找到这个变量，如果不存在变量，则向包含当前环境的外部环境记录搜索变量，直到全局作用域为止。如果变量值没有被绑定，JavaScript 引擎会将其绑定为 undefined，否则继续执行其他操作。

4. 实现块级作用域
使用 let 定义变量时，在运行时不会在当前作用域之外创建单独的执行上下文，而是会创建子遮蔽（shadowing）新环境。在子遮蔽的词法环境中，变量的值只在最接近的块级作用域内有效。


### const 的底层实现过程

const 具有与 let 相同的底层实现原理，区别在于 const 定义的变量被视为常量（在赋值之后无法更改），因此变量声明时 必须初始化。此外，应该注意的是，使用 const 声明的对象是可以修改属性的。在定义 const 对象时，对象本身是常量，而不是对象的属性。只有对象本身不能被修改，而对象包含的属性可以任意修改。


## VariableEnvironment 与 LexicalEnvironment 的关系
- LexicalEnvironment：主要用于解析标识符（如变量、函数名等），并维护当前作用域链。它处理所有类型的声明，包括 let、const 和 function。
- VariableEnvironment：专门用于管理由 var 关键字声明的变量和函数声明。对于这些声明来说，VariableEnvironment 是它们的作用域容器。通常情况下，VariableEnvironment 和 LexicalEnvironment 指向同一个环境记录，但在某些特殊情况下它们可能不同


特殊情况下的差异
在大多数情况下，VariableEnvironment 和 LexicalEnvironment 是相同的，但有几种特殊情况会导致它们不同：

1. catch 子句：
在 try...catch 语句中，catch 块会创建一个新的 LexicalEnvironment 来保存异常参数，而 VariableEnvironment 则保持不变。这意味着在 catch 块中声明的 var 变量仍然属于外部作用域，而不是 catch 块本身的作用域。
2. with 语句：
当使用 with 语句时，它会创建一个新的 LexicalEnvironment，其环境记录基于传入的对象属性。但是，VariableEnvironment 不会改变，因此 var 声明仍然会在外部作用域中生效。
3. 函数声明提升：
函数声明会在 VariableEnvironment 中被提升到作用域顶部，并且可以在声明之前被调用。这是因为函数声明不仅被添加到了 LexicalEnvironment，同时也被注册到了 VariableEnvironment


```js
  try {
    nonExistentFunction();
  } catch (err) {
    var b = 20; // 这个 'var' 声明实际上是在 try-catch 外部的 VariableEnvironment 中
    let c = 10
    console.log(b); // 输出 20
  }
  console.log(b); // 输出 20，因为 'b' 实际上是在外部作用域中声明的
  console.log(c);
```

## 资料引用

<a href="https://y03l2iufsbl.feishu.cn/drive/folder/LWpVfwcxTlVDXJdJRHWcihbznch" target="_blank"  style="display: block">ES6</a>
