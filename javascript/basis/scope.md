# 作用域和函数的参数传递

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## 作用域

参考书籍《你不知道的 javascript 上》

### 作用域

> 负责收集并维护由所有声明的标识符（标量）组成的查询。确定当前执行的代码对这些标识符的访问权限，作用域定义了如何查找变量的位置，即确定当前执行上下文中变量和其他资源的作用范围
> <Image  src="/javascript/basis/images/作用域是什么.jpg" />

- 全局作用域
  - 最外层函数和在最外层函数外面定义的变量
  - 所有末定义直接赋值的变量自动声明为拥有全局作用域
- 函数作用域
  - 在函数内部定义的变量，拥有函数作用域
- 块级作用域
  - 使用 let 或 const 声明的变量，如果被一个大括号{}括住，那么这个大括号括住的变量就形成了一个块级作用域。所声明的变量在指定块的作用域外无法被访问

### 词法作用域

<Image  src="/javascript/basis/images/词法作用域.jpg" />

### 函数作用域和块级作用域

<Image  src="/javascript/basis/images/函数作用域和块作用域.jpg" />

#### 块作用域

ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明

```js
// 情况一
if (true) {
  function f() {}
}

// 情况二
try {
  function f() {}
} catch (e) {
  // ...
}
```

上面两种函数声明，根据 ES5 的规定都是非法的。

但是，浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数，因此上面两种情况实际都能运行，不会报错。

ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于 let，在块级作用域之外不可引用。

```js
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
```

上面代码在 ES5 中运行，会得到“I am inside!”，因为在 if 内声明的函数 f 会被提升到函数头部，实际运行的代码如下。

```js
// ES5 环境
function f() {
  console.log("I am outside!");
}

(function () {
  function f() {
    console.log("I am inside!");
  }
  if (false) {
  }
  f();
})();
```

ES6 就完全不一样了，理论上会得到“I am outside!”。因为块级作用域内声明的函数类似于 let，对作用域之外没有影响。但是，如果你真的在 ES6 浏览器中运行一下上面的代码，是会报错的，这是为什么呢？

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

原来，如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。为了减轻因此产生的不兼容问题，ES6 在附录 B 里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。

- 允许在块级作用域内声明函数。
- 函数声明类似于 var，即会提升到全局作用域或函数作用域的头部。
- 同时，函数声明还会提升到所在的块级作用域的头部。
  注意，上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作 let 处理。

根据这三条规则，浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于 var 声明的变量。上面的例子实际运行的代码如下。

```js
// 浏览器的 ES6 环境
function f() {
  console.log("I am outside!");
}
(function () {
  var f = undefined;
  if (false) {
    function f() {
      console.log("I am inside!");
    }
  }

  f();
})();
// Uncaught TypeError: f is not a function
```

### 变量提升

<Image  src="/javascript/basis/images/变量提升.jpg" />

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
每当一个函数被执行时，都会创建一个新的执行上下文，并形成一条作用域链。这条链由多个对象组成，每个对象都对应着一个变量对象，它包含了当前执行上下文中所有可用的标识符（如变量名）。作用域链从当前执行上下文开始，一直向上延伸至全局执行上下文。这意味着如果在一个函数内部尝试访问某个变量，首先会在自己的作用域中寻找，若找不到，则会沿着作用域链逐级向上搜索直到全局作用域。这种机制允许子函数能够访问父函数甚至更外层函数中的变量

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

<Image  src="/javascript/basis/images/闭包.jpg" />
在一个作用域中可以访问另一个函数内部的局部变量的函数
闭包 = 函数 + 函数能够访问函数外的变量
> MDN:闭包是由函数以及函数声明所在的词法环境组合而成的。该环境包含了这个闭包创建时作用域内的任何局部变量

#### 闭包的作用

- 可以读取函数内部的变量
- 可以使变量的值长期保存在内存中，生命周期比较长。
- 可用来实现 JS 模块（ JQuery 库等）

#### 闭包的特性

- 每个函数都是闭包，函数能够记住自己定义时所处的作用域，函数走到了哪，定义时的作用域就到了哪。
- 内存泄漏

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

## 练习

```js
(function () {
  var x = (y = 1); // x 取 的 y=1 的返回值
})();
var z;
console.log(y); // 这里的y 是window.y 放到全局去了， 没有声明
console.log(z); // undefined
console.log(x); // x is not defined
```

```js
var a, b;
(function () {
  console.log(a); // undefined
  console.log(b); // undefined
  var a = (b = 3);
  console.log(a); // 3
  console.log(b); // 3
})();
console.log(a); // undefined
console.log(b); // 3
```

```js
var friendName = "World";
(function () {
  if (typeof friendName === "undefined") {
    var friendName = "Jack";
    console.log("Goodbye " + friendName); // Goodbye Jack
  } else {
    console.log("Hello " + friendName);
  }
})();
```

```js
function fn1() {
  console.log("fn1");
}
var fn2;
fn1(); // fn1
fn2(); // fn2 is not a function
fn2 = function () {
  console.log("fn2");
};
fn2();
```

```js
function a() {
  var temp = 10;
  function b() {
    console.log(temp); // 10
  }
  b();
}
a();
```

```js
f = function () {
  return true;
};
g = function () {
  return false;
};
(function () {
  if (g() && [] == ![]) {
    f = function f() {
      return false;
    };
    function g() {
      return true;
    }
  }
})();
console.log(f());
```

上面这个代码在 ES5 中会执行， 但是在 ES6 中会报错，`g()`执行时 g 为 undefined，所以会报错

```js
function fun(n, o) {
  console.log(o);
  return {
    fun: function (m) {
      return fun(m, n);
    },
  };
}
// 闭包
var a = fun(0); // undefined  // n  = 0  O = undefined
a.fun(1); //
a.fun(2); //
a.fun(3); //
var b = fun(0).fun(1).fun(2).fun(3);
var c = fun(0).fun(1); // fun(0)  undefined  // fun(1, 0)  0
c.fun(2); // 1
c.fun(3); // 1
```
