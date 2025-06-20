# 面试

## css

### 常见的水平居中

### BFC

### flex

### 元素隐藏

## js

### typeof instanceof

### 数组 forEach 和 map 的区别, 常用方法

### 闭包和作用域

### 类似 new 功能的函数

```js
function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype);
  const res = fn.apply(obj, args);
  return res instanceof Object ? res : obj;
}
```

### 如何实现继承

- es6 extends
- es5 原型链继承

### 箭头函数和普通函数的区别

### 迭代器接口和生成器函数的接口关系

- 迭代器是一种设计模式，它提供了一种访问一个容器（如数组）中各个元素的方法，而无需暴露该对象的内部细节。JavaScript 中的迭代器是一个实现了特定接口的对象，这个接口必须包含一个名为 next 的方法
- 生成器函数是通过` function\*` 语法定义的特殊函数，它们可以暂停执行并在之后从暂停处恢复.

生成器函数返回的生成器对象自动实现了迭代器接口。这意味着你可以像使用任何其他迭代器一样使用生成器对象, 可以直接使用 for...of 循环

### 事件循环

## typescript

### type 和 interface 的区别

### any unkonwn never 的区别

### 常用工具函数

## vue

## 浏览器相关

### 跨域

### 浏览器缓存

### 浏览器渲染页面流程

## 工具链

### webpack 的理解

### webpack 的 loader 和 plugin 的区别

### 常见的优化方案

### babel 的理解

## react

### 组件生命周期

### Filber 架构

## 项目相关

### taro 小程序

trao2 taro3

### 前端低代码的认识

### 组件封装思路

## 性能优化

### 重绘和回流 优化

## 手写代码

## 从浏览器输入 url 到页面展示发生了什么

## git 命令

## 引用

<a href="https://nwy3y7fy8w5.feishu.cn/docx/HoQVdSYr8o7ZpTxRqXMcWawondd" target="_blank"  style="display: block">面试专题</a>

<a href="/other/interview/2025最新前端八股文——webpack、html篇.pdf" target="_blank"  style="display: block">2025 最新前端八股文——webpack、html 篇</a>
<a href="/other/interview/大厂面试高频100题.pdf" target="_blank"  style="display: block">大厂面试高频 100 题</a>

<a href="/other/interview/前端面试宝典大全.pdf" target="_blank"  style="display: block">前端面试宝典大全</a>
<a href="/other/interview/前端面试场景题合集.pdf" target="_blank"  style="display: block">前端面试场景题合集</a>
<a href="/other/interview/前端面试上岸手册（八股文）.pdf" target="_blank"  style="display: block">前端面试上岸手册（八股文）</a>
<a href="/other/interview/最爱被问到的10个JavaScript闭包问题.pdf" target="_blank"  style="display: block">最爱被问到的 10 个 JavaScript 闭包问题</a>
<a href="/other/interview/React面试题解析.pdf" target="_blank"  style="display: block">React 面试题解析</a>
<a href="/other/interview/vue面试题.pdf" target="_blank"  style="display: block">vue 面试题</a>
<a href="/other/interview/Vue面试题解析.pdf" target="_blank"  style="display: block">Vue 面试题解析</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/OMX1dQ7gzoCeW5xYWtzclehcnvg" target="_blank"  style="display: block">Vue面试</a>



