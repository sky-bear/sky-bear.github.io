# 设计模式

<script setup>
import Image from "../components/Image/index.vue"
</script>


## 面向对象编程

**面向对象编程**： 就是将你的需求抽象成一个对象，然后针对这个对象分析其特征（属性）与动作（方法），这个对象我们称之为类

**特点**：

- 封装
- 继承 ： 是对原有对象的封装，从中创建私有属性、私有方法、特权方法、共有属性、共有方法等。主要是类继承， 构造函数继承， 组合继承， 其余的都是在这三种基础延申的
- 多态： 同一个方法多种调用方式


## 继承
- 类式继承（原型链继承）

  ```js
  function superclass() {
    this.superValue = true;
  }
  // 为父类添加共有方法
  superclass.prototype.getsuperValue = function() {
    return this.superValue;
  };

  // 声明子类
  function subclass() {
    this.subValue = false;
  }
  // 继承父类
  subclass.prototype = new superclass();

  // 为子类添加共有方法
  subclass.prototype.getsubValue = function() {
    return this.subValue;
  };

  var instance = new subclass()；
  ```

  ```mathematica
  	类的原型对象的作用就是为类的原型添加共有方法，但类不能直接访问这些属性和方法，必须通过原型 prototype 来访问。而我们实例化一个父类的时候，新创建的对象复制了父类的构造函数内的属性与方法并且将原型__proto__指向了父类的原型对象，这样就拥有了父类的原型对象上的属性与方法，并且这个新创建的对象可直接访问到父类原型对象上的属性与方法

  	新创建的对象不仅仅可以访问父类原型上的属性和方法，同样也可访问从父类构造函数中复制的属性和方法. 如果将这个对象赋值给子类的原型，那么这个子类的原型同样可以访问父类原型上的属性和方法与从父类构造函数中复制的属性和方法。这正是类式继承原.
  ```

  通过 `instanceof` 来检测某个对象是否是某个类的实例，或者说某个对象是否继承了某个类

  ```js
  console.log(instance instanceof superclass); //true
  console.log(instance instanceof subclass); //true
  console.log(subclass instanceof superclass); //false
  console.log(subclass.prototype instanceof superclass); //true
  ```

  **缺点**

  - 父构造函数中的值类型的属性被复制，引用类型的属性被共用

    ```markdown
    由于子类通过其原型 prototype 对父类实例化，继承了父类。所以说父类中的共有属性要是引用类型，就会在子类中被所有实例共用，因此一个子类的实例更改子类原型从父类构造函数中继承来的共有属性就会直接影响到其他子类
    ```

  - 无法向父类传递参数

    ```markdown
        由于子类实现的继承是靠其原型 prototype 对父类的实例化实现的，因此在创建父类的时候，是无法向父类传递参数的，因而在实例化父类的时候也无法对父类构造函数内的属性进行初始化
    ```

- 构造函数继承

  ```js
  // 声明父类

  function superclass(id) {
    // 引用类型共有属性
    this.books = ["Javascript", "html", "css"];
    // 值类型共有属性
    this.id = id;
  }

  // 父类声明原型方法
  superclass.prototype.showBooks = function () {
    console.log(this.books);
  };

  // 声明子类
  function subclass(id) {
    // 继承父类
    superclass.call(this, id);
  }
  ```

  ```
  由于这种类型的继承没有涉及原型 prototype，所以父类的原型方法自然不会被子类继承
  ```

  **缺点**

  - 子类实例不能继承父类的构造属性和方法（原型上的方法和属性）



- 组合继承

  ```js
  // 声明父类
  function superclass(name){
    // 值类型共有属性
    this.name = name
    // 引用类型共有属性
    this.books = ["html", "css", "Javascript"]

  }
  // 父类原型共有方法
  superclass.prototype.getName = function(){
    console.log(this.name)

  }
  // 声明子类
  function subclass(name, time){
  // 构造函数式继承父类name属性
  superclass.call(this, name)
  // 子类中新增共有属性
  this.time = time
  }
  // 类式继承 子类原型继承父类
  subclass.prototype = new superclass()
  // 子类原型方法
  subclass.prototype.getTIme = function(){
      console.log(this.time)
  }

  子类不是父类的实例，而子类的原型是父类的实例
  ```

  **在子类构造函数中执行父类构造函数，在子类原型上实例化父类就是组合模式**

  **缺点**: 执行了两次父类构造函数

- 原型继承

  ```js
  // 原型是继承
  function inheritobject(o) {
    // 声明—个过渡函数对象  相当于类式继承的子类
    function F() {}
    // 过渡对象的原型继承父对象
    F.prototype = o;
    // 返回过渡对象的—个实例，该实例的原型继承了父对象
    return new F();
  }

  值类型的属性被复制，引用类型的属性被共用
  ```

  实际就是对类式继承的一个封装

- 寄生式继承

  ```js
  function createBook(obj) {
    // 通过原型继承方式创建新对象
    var o = new inheritobject(obj);
    // 拓展新对象
    o.getName = function () {
      console.log(name);
    };
    // 返回拓展后的新对象

    return o;
  }
  ```

  寄生式继承就是对原型继承的第二次封装，并且在这第二次封装过程中对继承的对象进行了拓展，这样新创建的对象不仅仅有父类中的属性和方法而且还添加新的属性和方法

- 寄生组合式继承

::: danger
Class 语法继承,最接近我们自己实现寄生组合式继承,是 JavaScript 引擎将 class 与转化为了原型链实现的方式
:::

```js
//  寄生式继承 继承原型
//  传递参数 subclass   子类
//  传递参数 superclass 父类

function inheritPrototype(subclass, superclass) {
  // 复制—份父类的原型副本保存在变量中
  var p = inheritobject(superclass.prototype);
  // 修正因为重写子类原型导致子类的constructor属性被修改
  p.constructor = subclass;
  // 设置子类的原型
  subclass.prototype = p;
}
```


组合式继承中，通过构造函数继承的属性和方法是没有问题的，所以这里我们主要探究通过寄生式继承重新继承父类的原型。我们需要继承的仅仅是父类的原型，不再需要调用父类的构造函数，换句话说，在构造函数继承中我们己经调用了父类的构造函数。因此我们需要的就是父类的原型对象的一个副本，而这个副本我们通过原型继承便可得到，但是这么直接赋值给子类会有问题的，因为对父类原型对象复制得到的复制对象 p 中的 constructor 指向的不是 subClass 子类对象，因此在寄生式继承中要对复制对象 p 做一次增强，修复其 constructor 属性指向不正确的问题，最后将得到的复制对象 p 赋值给子类的原型，这样子类的原型就继承了父类的原型并且没有执行父类的构造函数


### 类似继承
