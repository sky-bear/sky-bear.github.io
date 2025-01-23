# 函数式编程

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## 基础

函数式编程（Functional Programming，FP）是一种编程范式，它将计算视为数学函数的求值，并避免了改变状态和可变数据。在函数式编程中，程序是由纯函数的组合构成的，其中：

- 纯函数：给定相同的输入，总是返回相同的输出，且没有副作用（side effects）。这意味着纯函数不会修改任何外部状态或依赖于任何可变的状态。
- 不可变性（Immutability）：一旦创建了一个对象，在其生命周期内它的状态不能被更改。如果需要更改对象，则会创建一个新的对象来表示这种变化。
- 高阶函数（Higher-order functions）：函数可以作为参数传递给其他函数，也可以作为结果从函数返回。函数被视为一等公民（first-class citizens）。
- 递归（Recursion）：由于缺乏循环结构（如 for 或 while），迭代操作通常通过递归来实现。
- 函数组合（Function Composition）：简单的函数可以通过组合形成更复杂的逻辑，而不需要引入额外的状态。
- 惰性求值（Lazy Evaluation）：表达式不是在绑定到变量的时候就立即求值，而是保持为一个表达式，直到它的值真正需要为止。
- 模式匹配（Pattern Matching）：用于解构数据结构，例如列表或记录，并根据它们的构造形式执行不同的代码路径。

## 一等公民的函数

函数是“一等公民”实际上说的是它们和其他对象都一样...所以就是普通公民（坐经济舱的人？）。换句话说，函数没什么特殊的，你可以像对待任何其他数据类型一样对待它们——把它们存在数组里，当作参数传递，赋值给变量...等等

```js
// bad
const getServerStuff = (callback) => ajaxCall((json) => callback(json));

// good
const getServerStuff = ajaxCall;
```

等同于

```js
ajaxCall((json) => callback(json));

// 等价于
ajaxCall(callback);

// 那么，重构下 getServerStuff
const getServerStuff = (callback) => ajaxCall(callback);

// ...就等于
const getServerStuff = ajaxCall; // <-- 看，没有括号哦
```

## 纯函数的好处

纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。
<br />

- slice 符合纯函数的定义：因为对相同的输入它保证能返回相同的输出；
- splice 却不同：会产生可观察到的副作用，即这个数组永久地改变了；

```js
var xs = [1, 2, 3, 4, 5];

// 纯的
xs.slice(0, 3);
//=> [1,2,3]

xs.slice(0, 3);
//=> [1,2,3]

xs.slice(0, 3);
//=> [1,2,3]

// 不纯的
xs.splice(0, 3);
//=> [1,2,3]

xs.splice(0, 3);
//=> [4,5]

xs.splice(0, 3);
//=> []
```

### 副作用内容

副作用是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的可观察的交互

副作用可能包含，但不限于：

1. 更改文件系统；
2. 往数据库插入记录；
3. 发送一个 http 请求；
4. 可变数据；
5. 打印/log；
6. 获取用户输入；
7. DOM 查询；
8. 访问系统状态.

概括来讲，只要是跟函数外部环境发生的交互就都是副作用——这一点可能会让你怀疑无副作用编程的可行性。函数式编程的哲学就是假定副作用是造成不正当行为的主要原因。

从定义上来说，纯函数必须要能够根据相同的输入返回相同的输出；如果函数需要跟外部事物打交道，那么就无法保证这一点了。

### 追求纯函数的原因

- 可缓存性（Cacheable）
  实现缓存的一种典型方式是 memoize 技术：

  ```js
  var squareNumber = memoize(function (x) {
    return x * x;
  });

  squareNumber(4);
  //=> 16

  squareNumber(4); // 从缓存中读取输入值为 4 的结果
  //=> 16

  squareNumber(5);
  //=> 25

  squareNumber(5); // 从缓存中读取输入值为 5 的结果
  //=> 25
  ```

  ```js
  var memoize = function (f) {
    var cache = {};

    return function () {
      var arg_str = JSON.stringify(arguments);
      cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
      return cache[arg_str];
    };
  };
  ```

- 可移植性／自文档化（Portable / Self-documenting）
  纯函数是完全自给自足的，它需要的所有东西都能轻易获得

  ```js
  // 不纯的
    var signUp = function(attrs) {
      var user = saveUser(attrs);
      welcomeUser(user);
    };

    var saveUser = function(attrs) {
        var user = Db.save(attrs);
        ...
    };

    var welcomeUser = function(user) {
        Email(user, ...);
        ...
    };

    // 纯的
    var signUp = function(Db, Email, attrs) {
      return function() {
        var user = saveUser(Db, attrs);
        welcomeUser(Email, user);
      };
    };

    var saveUser = function(Db, attrs) {
        ...
    };

    var welcomeUser = function(Email, user) {
        ...
    };
  ```

- 可测试性（Testable）
  纯函数让测试更加容易。我们不需要伪造一个“真实的”支付网关，或者每一次测试之前都要配置、之后都要断言状态（assert the state）。只需简单地给函数一个输入，然后断言输出就好了。
- 合理性
- 并行代码
  最后一点，也是决定性的一点：我们可以并行运行任意纯函数。因为纯函数根本不需要访问共享的内存，而且根据其定义，纯函数也不会因副作用而进入竞争态（race condition）。
  并行代码在服务端 js 环境以及使用了 web worker 的浏览器那里是非常容易实现的，因为它们使用了线程（thread）。不过出于对非纯函数复杂度的考虑，当前主流观点还是避免使用这种并行。

## 柯里化

### 什么是柯里化

curry 的概念很简单：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

```js
function fn(a, b, c, d, e) {
  console.log(a, b, c, d, e);
}

function curry(fn) {
  // 实现
}

let _fn = curry(fn);

_fn(1, 2, 3)(4)(5);
_fn(1, 2, 3, 4)(5);
_fn(1)(2)(3)(4)(5);
_fn(1, 2, 3, 4, 5);
```

```js
function curry(fn) {
  const length = fn.length;
  const args = [];
  const _fn = function () {
    args.push(...arguments);
    if (args.length >= length) {
      const result = fn(...args);
      args.length = 0;
      return result;
    }
    return _fn;
  };
  return _fn;
}
```

## 代码组合

代码组合：两个函数组合之后返回了一个新函数，也就是组合某种类型（本例中是函数）的两个元素本就该生成一个该类型的新元素。

```js
var compose = function (f, g) {
  return function (x) {
    return f(g(x));
  };
};
```

```js
var toUpperCase = function (x) {
  return x.toUpperCase();
};
var exclaim = function (x) {
  return x + "!";
};
var shout = compose(exclaim, toUpperCase);

shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"
```

## 资料引用

<a href="https://nwy3y7fy8w5.feishu.cn/docx/GYvDdOmIpokgBnxm9fPcG8J9nS3" target="_blank"  style="display: block"> 函数式编程</a>
