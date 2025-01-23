# ES6

## 1.ECMAScript6 简介

简介没啥好说的， 自己去看就行

## 2.let 和 const

### let 声明变量

#### 基本使用

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

#### 不存在变量提升

var 命令会发生“变量提升”现象， 即变量可以在声明之前使用，值为 undefined。
let 命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错。

```js
console.log(foo); // undefined
var foo = 2;
console.log(bar); // ReferenceError
let bar = 2;
```

#### 暂时性死区

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

#### 不允许重复声明
let 不允许在相同作用域内重复声明同一个变量




## 资料引用


<a href="https://y03l2iufsbl.feishu.cn/drive/folder/LWpVfwcxTlVDXJdJRHWcihbznch" target="_blank"  style="display: block">ES6</a>


