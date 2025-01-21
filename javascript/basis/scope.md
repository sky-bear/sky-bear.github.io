# 作用域和函数的参数传递

<script setup>
import Image from "../../components/Image/index.vue"
</script>



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
