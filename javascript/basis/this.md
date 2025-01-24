# this

<script setup>
import Image from "../../components/Image/index.vue"
</script>



参考书籍《你不知道的 javascript 上》

<Image  src="./images/你不知道的javascript上.jpg" />

## 基础

- 普通函数
  - this 在任何情况下都不指向函数的词法作用域
  - this 实际上是在函数被调用时发生的绑定， 它指向什么完全取决于函数在哪里被调用
    > this 执行为当前执行环境（执行上下文）的 ThisBinding。ThisBinding 就是 this 的值。
- 箭头函数
  - 静态绑定
    -  箭头函数不会创建自己的 this 上下文；它们会使用定义时所在的外部作用域中的 this。 
    - 这意味着一旦箭头函数被定义，它的 this 就已经确定了，即使之后该函数在不同的上下文中被调用，this 的值也不会改变
  - 继承自最近的非箭头函数
    - 如果箭头函数位于另一个普通函数内部，那么它将继承该普通函数的 this
    - 如果不在任何普通函数内部，则 this 通常是全局对象（在浏览器环境中为 window 或严格模式下的 undefined）
  
  ```js
  const obj1 = {
    a: 1,
    fn() {
      console.log("this-obj1", this);
    },
  };
  const obj2 = {
    a: 1,
    fn: () => {
      console.log("this", this);
    },
    fn2: function () {
      (() => {
        console.log("this-obj2", this);
      })();
    },
  };
  const obj3 = {
    a: 2,
    fn(fn) {
      console.log("this---obj3", this);
      fn();
    },
  };
  // 这里先只考虑浏览器的
  obj1.fn(); // obj1

  obj2.fn(); // window 

  obj2.fn2(); // obj2

  const fn2 = obj2.fn2;

  fn2(); // window

  obj3.fn(fn2); // obj3 window

  ```

## 解析

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

## Reference 规范类型

### 基础

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

### 与 this 的关系

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

## new 实现

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



## 箭头函数和普通函数的区别

1. this 指向，箭头函数不能定义构造器
2. 不能 new
3. 内部无 arguments 对象
4. this 绑定方法失效，比如：call apply bind

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

