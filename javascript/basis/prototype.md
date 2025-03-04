# 原型和原型链

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## 原型

> 【ECMAScript5】为其他对象提供共享属性的对象

参考书籍《你不知道的 javascript 上》

<Image  src="./images/原型.jpg" />

### 基础

- [[Prototype]]
  - javaScript 中的对象有一个特殊的[[Prototype]]内置属性， 其实就是对其他对象的引用
    > 【ECMAScript5】 每个由构造器创建的对象，都有一个隐式引用 ( 叫做对象的原型 ) 链接到构造器的“prototype”属性值
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
console.log(foo.a); // 2
```

在查找 foo.a 时， 首先在 foo 自身属性中查找，没有找到， 就会继续在 foo 的[[Prototype]]中查找，也就是 Foo.prototype， 在 Foo.prototype 中找到了也没有找到 a 属性，就继续查找, 这里查找的是 Foo.prototype 的原型对象 ， 直到找到 Object.prototype， 在 Object.prototype 中找到了 a 属性， 就返回 2

```js
console.log(foo.__proto__ === Foo.prototype); // true
console.log(Foo.prototype.__proto__ === Object.prototype); // true
```

::: warning
这个打印什么呢?

```js
console.log(foo.constructor); // Foo
```

:::

## 创建对象的方式&优缺点

### 工厂模式

```js
function createPerson(name) {
  var o = new Object();
  o.name = name;
  o.getName = function () {
    console.log(this.name);
  };

  return o;
}

var person1 = createPerson("kevin");
```

优点：简单；<br/>
缺点：对象无法识别，因为所有的实例都指向一个原型；

### 构造函数模式

```js
function Person(name) {
  this.name = name;
  this.getName = function () {
    console.log(this.name);
  };
}

var person1 = new Person("kevin");
```

优点：实例可以识别为一个特定的类型；<br/>
缺点：每次创建实例时，每个方法都要被创建一次；

<br/>
优化函数创建

```js
function Person(name) {
  this.name = name;
  this.getName = getName;
}

function getName() {
  console.log(this.name);
}

var person1 = new Person("kevin");
```

### 原型模式

```js
function Person(name) {}

Person.prototype.name = "xianzao";
Person.prototype.getName = function () {
  console.log(this.name);
};

var person1 = new Person();
```

优点：方法不会重新创建；<br/>
缺点：

1. 所有的属性和方法都共享；
2. 不能初始化参数；

<br/>
优化1

```js
function Person(name) {}

Person.prototype = {
  name: "xianzao",
  getName: function () {
    console.log(this.name);
  },
};

var person1 = new Person();
```

优点：封装清晰点；<br/>
缺点：重写了原型，丢失了 constructor 属性；

<br/>
优化2

```js
function Person(name) {}

Person.prototype = {
  constructor: Person,
  name: "kevin",
  getName: function () {
    console.log(this.name);
  },
};

var person1 = new Person();
```

优点：实例可以通过 constructor 属性找到所属构造函数；
缺点：

1. 所有的属性和方法都共享；
2. 不能初始化参数；

### 组合模式

```js
function Person(name) {
  this.name = name;
}

Person.prototype = {
  constructor: Person,
  getName: function () {
    console.log(this.name);
  },
};

var person1 = new Person();
```

#### 动态原型模式

```js
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
    Person.prototype.getName = function () {
      console.log(this.name);
    };
  }
}

var person1 = new Person();
```

注意：使用动态原型模式时，不能用对象字面量重写原型
```js
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype = {
            constructor: Person,
            getName: function () {
                console.log(this.name);
            }
        }
    }
}

var person1 = new Person('xianzao');
var person2 = new Person('zaoxian');

// 报错 并没有该方法
person1.getName();

// 注释掉上面的代码，这句是可以执行的。
person2.getName();
```
开始执行var person1 = new Person('xianzao')
我们回顾下 new 的实现步骤：

1. 首先新建一个对象；
2. 然后将对象的原型指向 Person.prototype；
3. 然后 Person.apply(obj)；
4. 返回这个对象；

注意这个时候，回顾下 apply 的实现步骤，会执行 obj.Person 方法，这个时候就会执行 if 语句里的内容，注意构造函数的 prototype 属性指向了实例的原型，使用字面量方式直接覆盖 Person.prototype，并不会更改实例的原型的值，person1 依然是指向了以前的原型，而不是 Person.prototype。而之前的原型是没有 getName 方法的，所以就报错了。

<br />
如果你就是想用字面量方式写代码，可以尝试下这种：

```js
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype = {
            constructor: Person,
            getName: function () {
                console.log(this.name);
            }
        }

        return new Person(name);
    }
}

var person1 = new Person('xianzao');
var person2 = new Person('zaoxian');

person1.getName(); // xianzao
person2.getName();  // zaoxian
```



## 继承的多种方式和优缺点


参考设计模式中的继承


## 资料引用：

<a href="https://nwy3y7fy8w5.feishu.cn/docx/SH4wd5cRSopC1XxDVPScxz3Fnoc" target="_blank"  style="display: block">澄怀-面向对象编程/原型及原型链</a>

