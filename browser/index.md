# 浏览器

<script setup>
import Image from "../components/Image/index.vue"
</script>

## 浏览器的多进程架构

东西比较多这里， 简单说明下

### 打开一个网页， 浏览器会开启多个进程

## 文档对象模型（DOM）

## 浏览器对象模型（BOM）

## 事件

```js
const EventUtils = {
  addEventListener: function (el, type, fn) {
    if (el.addEventListener) {
      el.addEventListener(type, fn, false); // 默认冒泡阶段处理
    } else if (el.attachEvent) {
      el.attachEvent("on" + type, fn);
    } else {
      el["on" + type] = fn;
    }
  },
  removeEventListener: function (el, type, fn) {
    if (el.removeEventListener) {
      el.removeEventListener(type, fn, false);
    } else if (el.detachEvent) {
      el.detachEvent("on" + type, fn);
    } else {
      el["on" + type] = null;
    }
  },

  getEvent(event) {
    return event || window.event;
  },

  getTatget(event) {
    return event.target || event.srcElement;
  },

  stopPropagation() {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },

  preventDefault() {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
};
```

### 事件委托

如果我们有许多以类似方式处理的元素，那么就不必为每个元素分配一个处理程序 —— 而是将单个处理程序放在它们的共同祖先上，获取 event.target 以查看事件实际发生的位置并进行处理

- 好处
  ::: info
  简化初始化并节省内存：无需添加许多处理程序。<br />
  更少的代码：添加或移除元素时，无需添加/移除处理程序。<br />
  DOM 修改 ：我们可以使用 innerHTML 等，来批量添加/移除元素。
  :::
- 坏处
  ::: warning
  首先，事件必须冒泡。而有些事件不会冒泡。此外，低级别的处理程序不应该使用 `event.stopPropagation()`。
  其次，委托可能会增加 CPU 负载，因为容器级别的处理程序会对容器中任意位置的事件做出反应，而不管我们是否对该事件感兴趣。但是，通常负载可以忽略不计，所以我们不考虑它
  :::

### 事件冒泡和捕获

<Image  src="./images/冒泡和捕获.jpg" ></Image>

当一个事件发生时 —— 发生该事件的嵌套最深的元素被标记为“目标元素”（event.target）。

然后，事件从文档根节点向下移动到 event.target，并在途中调用分配了 addEventListener(..., true) 的处理程序（true 是 {capture: true} 的一个简写形式）。
然后，在目标元素自身上调用处理程序。
然后，事件从 event.target 冒泡到根，调用使用 on`<event>`、HTML 特性（attribute）和没有第三个参数的，或者第三个参数为 false/{capture:false} 的 addEventListener 分配的处理程序。
每个处理程序都可以访问 event 对象的属性：

event.target —— 引发事件的层级最深的元素。
event.currentTarget（=this）—— 处理事件的当前元素（具有处理程序的元素）
event.eventPhase —— 当前阶段（capturing=1，target=2，bubbling=3）。

#### 冒泡

当一个事件发生在一个元素上，它会首先运行在该元素上的处理程序，然后运行其父元素上的处理程序，然后一直向上到其他祖先上的处理程序

event.target 是触发事件的元素，而 event.currentTarget 是处理事件的元素(this 指向的元素)

::: tip
例如，如果我们有一个处理程序 form.onclick，那么它可以“捕获”表单内的所有点击。无论点击发生在哪里，它都会冒泡到 `<form>` 并运行处理程序。

在 form.onclick 处理程序中：

this（=event.currentTarget）是 `<form>` 元素，因为处理程序在它上面运行。
event.target 是表单中实际被点击的元素。
:::

::: info
focus 事件不会冒泡
:::

阻止冒泡

```js
function stopPropagation(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // W3C 标准
  } else {
    e.cancelBubble = true; // IE8 及更早版本
  }
}
```

::: warning
**event.stopImmediatePropagation()**
<br />
如果一个元素在一个事件上有多个处理程序，即使其中一个停止冒泡，其他处理程序仍会执行。

换句话说，event.stopPropagation() 停止向上移动，但是当前元素上的其他处理程序都会继续运行。

有一个 event.stopImmediatePropagation() 方法，可以用于停止冒泡，并阻止当前元素上的处理程序运行。使用该方法之后，其他处理程序就不会被执行。
:::

#### 捕获

事件（从 Window）向下走近元素。当它到达目标元素时，所有分配了 addEventListener(..., true) 的处理程序都会被调用。

## 浏览器请求

### 手写 [ajax](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)

#### 创建对象

```js
let xmlHttp;
if (window.XMLHttpRequest) {
  xmlHttp = new XMLHttpRequest();
} else {
  xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
}
```

通过 XMLHttpRequest 构造函数创建一个异步对象 xmlhttp, IE6, IE5 使用 ActiveXObject 创建，创建的这个异步对象上有很多属性和方法，常用的有：

1. onreadystatechange：监听异步对象请求状态码 readyState 的改变，每当 readyState 改变时，就会触发 onreadystatechange 事件；
2. readyState：请求状态码
   readyState 表示异步对象目前的状态，状态码从 0 到 4：
   0: 表示请求未初始化，还没有调用 open()；
   1: 服务器连接已建立，但是还没有调用 send()；
   2: 请求已接收，正在处理中（通常现在可以从响应中获取内容头）；
   3: 请求处理中，通常响应中已有部分数据可用了，没有全部完成；
   4: 当 readyState 状态码为 4 时，表示请求已完成；此阶段确认全部数据都已经解析完毕，可以通过异步对象的属性获取对应数据；
3. status：http 状态码
   http 状态码表示成功的 http 状态码有
   xmlHttp.status >= 200 && xmlHttp.status < 300 || xmlHttp.status == 304
4. responseText：后台返回的字符串形式的响应数据；
5. responseXML：后台返回的 XML 形式的响应数据；

#### 设置地址请求

```js
xmlHttp.open("GET", "ajax-get.txt?t=" + new Date().getTime(), true);
//或
// xmlHttp.open("GET","ajax-get.txt?t=" + Math.random(),true);
```

#### 发送请求

```js
xmlHttp.send();
```

::: warning
特别注意的是： 如果发送 POST 请求，使用 setRequestHeader()来添加 HTTP 请求头，并在 send()方法中传递要发送的数据：

```js
xmlHttp.open("POST", "ajax_test.html", true);
xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlHttp.send("fname=Henry&lname=Ford");
```

:::

#### 通过 onreadystatechange 监听状态变化

```js
xmlHttp.onreadystatechange = () => {
  // 判断当前状态改变是请求完毕的状态吗
  if (xmlHttp.readyState === 4) {
    if (
      (xmlHttp.status >= 200 && xmlHttp.status < 300) ||
      xmlHttp.status == 304
    ) {
      console.log("成功的接收到服务器返回的数据");
    } else {
      console.log("不成功！");
    }
  }
};
```

#### 封装 ajax

```js
function ajax(options) {
  const { type, url, timeout, success, error, data } = options;

  //处理obj
  const objToString = (data) => {
    data.t = new Date().getTime();
    let res = [];
    for (let key in data) {
      //需要将key和value转成非中文的形式，因为url不能有中文。使用encodeURIComponent();
      res.push(encodeURIComponent(key) + " = " + encodeURIComponent(data[key]));
    }
    return res.join("&");
  };

  let str = objToString(data || {});
  let xmlHttp,timer;
  // 1.创建对象
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  // 2.设置请求方式
  if (type.toUpperCase() === "GET") {
    xmlHttp.open(type, url + "?" + str, true);
  } else {
    xmlHttp.open(type, url, true);
    // 注意：在post请求中，必须在open和send之间添加HTTP请求头：setRequestHeader(header,value);
    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
  }
  //  3.发送请求；
  xmlHttp.send();
  // 4.处理响应
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4) {
       if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 304)  {
        success(xmlHttp.responseText);
      } else {
        error(xmlHttp.status);
      }
    }
  };
  if (timeout) {
    timer = setTimeout(function () {
      xmlHttp.abort(); //中断请求
      clearTimeout(timer);
    }, option.timeout);
  }
}
```

promise 版本

```js
function ajax(options) {
  const { type, url, timeout, data } = options;
  return new Promise((resolve, reject) => {
    //处理obj
    const objToString = (data) => {
      data.t = new Date().getTime();
      let res = [];
      for (let key in data) {
        //需要将key和value转成非中文的形式，因为url不能有中文。使用encodeURIComponent();
        res.push(
          encodeURIComponent(key) + " = " + encodeURIComponent(data[key])
        );
      }
      return res.join("&");
    };

    let str = objToString(data || {});
     let xmlHttp,timer;
    // 1.创建对象
    if (window.XMLHttpRequest) {
      xmlHttp = new XMLHttpRequest();
    } else {
      xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 2.设置请求方式
    if (type.toUpperCase() === "GET") {
      xmlHttp.open(type, url + "?" + str, true);
    } else {
      xmlHttp.open(type, url, true);
      // 注意：在post请求中，必须在open和send之间添加HTTP请求头：setRequestHeader(header,value);
      xmlHttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
    }
    //  3.发送请求；
    xmlHttp.send();
    // 4.处理响应
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4) {
        i if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 304)  {
          resolve(xmlHttp.responseText);
        } else {
          reject(xmlHttp.status);
        }
      }
    };
    if (timeout) {
      timer = setTimeout(function () {
        xmlHttp.abort(); //中断请求
        reject("超时");
        clearTimeout(timer);
      }, option.timeout);
    }
  });
}
```

#### 上传封装 
[Fusion-UI](https://fusion.design/pc/component/upload#%E8%87%AA%E5%AE%9A%E4%B9%89%20Request) upload  request 封装

```js
function customRequest(option) {
    /* coding here */
    return {
        abort() {
            /* coding here */
        },
    };
}

<Upload request={customRequest} />;
```

### fetch

### axios

## 资料引用：

<a href="https://zh.javascript.info/ui" target="_blank"  style="display: block">浏览器：文档，事件，接口</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/TgsmduAgDoabUCxHneXcEbVInzO" target="_blank"  style="display: block">浏览器事件详解</a>
