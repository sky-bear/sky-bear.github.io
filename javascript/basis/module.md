# 模块化

<script setup>
import Image from "../../components/Image/index.vue"
</script>




## 基础

### 什么是模块

- 将一个复杂的程序依据一定的规则(规范)封装成几个块(文件)，并进行组合在一起；
- 块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信

### 模块化解决的问题

- 外部模块的管理；
- 内部模块的组织；
- 模块源码到目标代码的编译和转换

### 发展进程

1.  全局 function
    ```js
    function a() {}
    ```
2.  namespace 模式
    ```js
    let myModule = {
      data: "www.baidu.com",
      foo() {
        console.log(`foo() ${this.data}`);
      },
      bar() {
        console.log(`bar() ${this.data}`);
      },
    };
    myModule.data = "other data"; //能直接修改模块内部的数据
    myModule.foo(); // foo() other data
    ```
3.  IFEE 模式
    匿名函数自调用(闭包)

- 作用：数据是私有的, 外部只能通过暴露的方法操作
- 编码：将数据和行为封装到一个函数内部, 通过给 window 添加属性来向外暴露接口
- 问题：如果当前这个模块依赖另一个模块怎么办?

  ```js
    // index.html文件
    <script type="text/javascript" src="module.js"></script>
    <script type="text/javascript">
        myModule.foo()
        myModule.bar()
        console.log(myModule.data) //undefined 不能访问模块内部数据
        myModule.data = 'xxxx' //不是修改的模块内部的data
        myModule.foo() //没有改变
    </script>

    // module.js文件
    (function(window) {
      let data = 'www.xianzao.com'
      //操作数据的函数
      function foo() {
        //用于暴露有函数
        console.log(`foo() ${data}`)
      }
      function bar() {
        //用于暴露有函数
        console.log(`bar() ${data}`)
        otherFun() //内部调用
      }
      function otherFun() {
        //内部私有的函数
        console.log('otherFun()')
      }
      //暴露行为
      window.myModule = { foo, bar } //ES6写法
    })(window)
  ```

4.  IIFE 模式增强

### 优点

- 避免命名冲突(减少命名空间污染)；
- 更好的分离, 按需加载；
- 更高复用性；
- 高可维护性；

## 模块化规范

### CommonJS

- **概念** <br />
  Node 应用由模块组成，采用 CommonJS 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。
- **特点** <br />
  - 所有代码都运行在模块作用域，不会污染全局作用域；
  - 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存；
  - 模块加载的顺序，按照其在代码中出现的顺序；
- **基本语法** <br />
  - 暴露模块：`module.exports = value`或`exports.xxx = value`
  - 引入模块：`require(xxx)`,如果是第三方模块，xxx 为模块名；如果是自定义模块，xxx 为模块文件路径
    ::: tip
    CommonJS 暴露的模块到底是什么? CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性
    :::
    ```js
    // example.js
    var x = 5;
    var addX = function (value) {
      return value + x;
    };
    module.exports.x = x;
    module.exports.addX = addX;
    ```
    上面代码通过 module.exports 输出变量 x 和函数 addX
    ```js
    var example = require("./example.js"); //如果参数字符串以“./”开头，则表示加载的是一个位于相对路径
    console.log(example.x); // 5
    console.log(example.addX(1)); // 6
    ```
    require 命令用于加载模块文件。require 命令的基本功能是，读入并执行一个 JavaScript 文件，然后返回该模块的 exports 对象。如果没有发现指定模块，会报错。
  - **机制** <Badge type="danger" text="重要" /> <br />
    CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
- **服务端使用** <br />
  可以直接使用， 不需要经过特殊处理
- **浏览器端使用** <br />
  使用 Browserify：Browserify 会对代码进行解析，整理出代码中的所有模块依赖关系，然后把相关的模块代码都打包在一起，形成一个完整的 JS 文件，这个文件中不会存在 require 这类的模块化语法，变成可以在浏览器中运行的普通 JS 文件<br />

### AMD（Asynchronous Module Definition）

- **概念** <br />
  CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD 规范则是非同步加载模块，允许指定回调函数。由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用 AMD 规范。此外 AMD 规范比 CommonJS 规范在浏览器端实现要来着早。
- **语法** <br />
  定义暴露模块：

  ```js
  //定义没有依赖的模块
  define(function () {
    return 模块;
  });

  //定义有依赖的模块
  define(["module1", "module2"], function (m1, m2) {
    return 模块;
  });
  ```

  引入使用模块：

  ```js
  require(["module1", "module2"], function (m1, m2) {
    使用m1 / m2;
  });
  ```

- **使用** <br />
  需要使用 require.js。 RequireJS 是一个工具库，主要用于客户端的模块管理。它的模块管理遵守 AMD 规范，RequireJS 的基本思想是，通过 define 方法，将代码定义为模块；通过 require 方法，实现代码的模块加载
  <br />  
   接下来介绍 AMD 规范在浏览器实现的步骤：

  1. 下载 require.js, 并引入

     - 官网: http://www.requirejs.cn/
     - github : https://github.com/requirejs/requirejs
       然后将 require.js 导入项目: js/libs/require.js

  2. 创建项目结构

     ```js
     |-js
       |-libs
         |-require.js
       |-modules
         |-alerter.js
         |-dataService.js
       |-main.js
       |-index.html
     ```

     - 定义 require.js 的模块代码

     ```js
     // dataService.js文件
       // 定义没有依赖的模块
       define(function() {
        let msg = 'www.xianzao.com'
        function getMsg() {
        return msg.toUpperCase()
        }
        return { getMsg } // 暴露模块
       })

     //alerter.js 文件
     // 定义有依赖的模块
     define(['dataService'], function(dataService) {
      let name = 'xianzao'
      function showMsg() {
      alert(dataService.getMsg() + ', ' + name)
      }
      // 暴露模块
      return { showMsg }
     })

     // main.js 文件
     (function() {
      require.config({
      baseUrl: 'js/', //基本路径 出发点在根目录下
      paths: {
      //映射: 模块标识名: 路径
      alerter: './modules/alerter', //此处不能写成 alerter.js,会报错
      dataService: './modules/dataService'
      }
      })
      require(['alerter'], function(alerter) {
      alerter.showMsg()
      })
     })()

     // index.html 文件

     <!DOCTYPE html>
     <html>
       <head>
         <title>Modular Demo</title>
       </head>
       <body>
         <!-- 引入require.js并指定js主文件的入口 -->
         <script data-main="js/main" src="js/libs/require.js"></script>
       </body>
     </html>
     ```
    - 在index.html引入
    ```html
    <script data-main="js/main" src="js/libs/require.js"></script>
    ```


### CMD(Common Module Definition)
- **概念** <br />
  CMD规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD规范整合了CommonJS和AMD规范的特点。在 Sea.js 中，所有 JavaScript 模块都遵循 CMD模块定义规范。
- **基本语法** <br />
  ```js
    //定义没有依赖的模块
    define(function(require, exports, module){
      exports.xxx = value
      module.exports = value
    })
  ```
  ```js
  //定义有依赖的模块
    define(function(require, exports, module){
      //引入依赖模块(同步)
      var module2 = require('./module2')
      //引入依赖模块(异步)
        require.async('./module3', function (m3) {
        })
      //暴露模块
      exports.xxx = value
    })
  ```
  ```js
  // 引入使用的模块
  define(function (require) {
    var m1 = require('./module1')
    var m4 = require('./module4')
    m1.show()
    m4.show()
  })
  ```
- **使用** <br />
需要使用 sea.js
1. 下载sea.js, 并引入
  - 官网: http://seajs.org/
  - github : https://github.com/seajs/seajs
  然后将sea.js导入项目：js/libs/sea.js
  1. 创建项目结构
  ```js
      |-js
        |-libs
          |-sea.js
        |-modules
          |-module1.js
          |-module2.js
          |-module3.js
          |-module4.js
          |-main.js
      |-index.html
  ```
  1. 定义sea.js的模块代码
  ```js
      // module1.js文件
    define(function (require, exports, module) {
      //内部变量数据
      var data = 'xianzao.com'
      //内部函数
      function show() {
        console.log('module1 show() ' + data)
      }
      //向外暴露
      exports.show = show
    })

    // module2.js文件
    define(function (require, exports, module) {
      module.exports = {
        msg: 'I am xianzao'
      }
    })

    // module3.js文件
    define(function(require, exports, module) {
      const API_KEY = 'abc123'
      exports.API_KEY = API_KEY
    })

    // module4.js文件
    define(function (require, exports, module) {
      //引入依赖模块(同步)
      var module2 = require('./module2')
      function show() {
        console.log('module4 show() ' + module2.msg)
      }
      exports.show = show
      //引入依赖模块(异步)
      require.async('./module3', function (m3) {
        console.log('异步引入依赖模块3  ' + m3.API_KEY)
      })
    })

    // main.js文件
    define(function (require) {
      var m1 = require('./module1')
      var m4 = require('./module4')
      m1.show()
      m4.show()
    })
  ```
  2. 在index.html中引入
  ```html
    <script type="text/javascript" src="js/libs/sea.js"></script>
    <script type="text/javascript">
      seajs.use('./js/modules/main')
    </script>
  ```
  ```js
  module1 show(), xianzao
  module4 show() I am xianzao
  异步引入依赖模块3 abc123
  ```

### [ES6 模块化](https://es6.ruanyifeng.com/#docs/module)

- **概念** <br />
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

- **使用** <br />
export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
```JS
  /** 定义模块 math.js /
  var basicNum = 0;
  var add = function (a, b) {
      return a + b;
  };
  export { basicNum, add };
  / 引用模块 **/
  import { basicNum, add } from './math';
  function test(ele) {
      ele.textContent = add(99 + basicNum);
  }
```
如上例所示，使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出
```JS
  // export-default.js
  export default function () {
    console.log('foo');
  }

  // import-default.js
  import customName from './export-default';
  customName(); // 'foo'
```

### UMD(Universal Module Definition)
是一种javascript通用模块定义规范，让你的模块能在javascript所有运行环境中发挥作用。
意味着要同时满足CommonJS, AMD, CMD的标准，以下为实现：
```JS
  (function(root, factory) {
      if (typeof module === 'object' && typeof module.exports === 'object') {
          console.log('是commonjs模块规范，nodejs环境')
          module.exports = factory();
      } else if (typeof define === 'function' && define.amd) {
          console.log('是AMD模块规范，如require.js')
          define(factory)
      } else if (typeof define === 'function' && define.cmd) {
          console.log('是CMD模块规范，如sea.js')
          define(function(require, exports, module) {
              module.exports = factory()
          })
      } else {
          console.log('没有模块环境，直接挂载在全局对象上')
          root.umdModule = factory();
      }
  }(this, function() {
      return {
          name: '我是一个umd模块'
      }
  }))
```


### 区别
- **AMD 与 CMD** <br />
  ```JS
  // CMD
    define(function (requie, exports, module) {
        //依赖就近书写
        var module1 = require('Module1');
        var result1 = module1.exec();
        module.exports = {
          result1: result1,
        }
    });

    // AMD
    define(['Module1'], function (module1) {
        var result1 = module1.exec();
        return {
          result1: result1,
        }
    });
  ```
  1. 对依赖的处理：
    - AMD推崇依赖前置，即通过依赖数组的方式提前声明当前模块的依赖；
    - CMD推崇依赖就近，在编程需要用到的时候通过调用require方法动态引入；
  2. 在本模块的对外输出：
    - AMD推崇通过返回值的方式对外输出；
    - CMD推崇通过给module.exports赋值的方式对外输出；

- **ES6 与 CommonJS** <br />
1.  CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用；
  ```JS
   // lib.js
    export let counter = 3;
    export function incCounter() {
      counter++;
    }
    // main.js
    import { counter, incCounter } from './lib';
    console.log(counter); // 3
    incCounter();
    console.log(counter); // 4
  ```
  ES6 模块的运行机制与 CommonJS 不一样。ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口；
   CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。


### 总结
1. CommonJS规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了AMD CMD解决方案；
2. AMD规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅；
3. CMD规范与AMD规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js中运行；
4. ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案；
5. UMD为同时满足CommonJS, AMD, CMD标准的实现；

### 资料引用

<a href="https://nwy3y7fy8w5.feishu.cn/docx/HY9gdEHZUodHurxET4MceoPUnuc" target="_blank"  style="display: block">JavaScript 模块化详解</a>
