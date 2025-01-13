# 基础专栏

针对一些难点的基础进行整理

## this

参考书籍《你不知道的 javascript 上》

<script setup>
import Image from "../components/Image/index.vue"
</script>
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
- <span class="k-p">__proto__</span>
  - __proto__: 相当于 getter/setter, 它并不是一个标准获取原型对象的方法
  - __proto__ 属性在 ES6 中被标准化， 但并不建议使用它来访问或者修改[[Prototype]]， 因为它并不是一个正式的标准属性， 而且大多数浏览器的实现中， __proto__ 后面都带有一个双下划线， 以表示它本质上是一个内部属性， 而不是正式对外公开的 API
  - Object.getPrototypeOf() 是获取对象原型的方法， 它是标准的， 而且不存在兼容性问题
  ```js
  console.log(Object.getPrototypeOf(foo) === Foo.prototype)
  console.log(Object.getPrototypeOf(foo) === foo.__proto__)
  ```

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
