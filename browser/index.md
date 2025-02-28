# 浏览器

<script setup>
import Image from "../components/Image/index.vue"
</script>

## 浏览器的多进程架构(基于 Chrome 浏览器)

<Image  src="./images/浏览器进程.jpg" />

1. chrome 打开一个页面具体启动了几个进程?
   从上图中可以看出，启动一个页面至少启动了四个进程，分别是：

- 浏览器进程
  它主要负责界面展示、用户交互、子进程管理，同时提供存储等功能
- 网络进程
  主要负责页面的网络资源加载。以前它是作为一个模块运行在主进程里的，现在把它独立出来，成为一个单独的进程
- GPU 进程
  开始 Chrome 是没有 GPU 进程的。而 GPU 的使用初衷是为了实现 3D CSS 的效果。后来网页、Chrome 的 UI 界面都选择采用 GPU 绘制，这样使 GPU 成为浏览器的一个普遍需求。最后，Chrome 在架构上引入了 GPU 进程
- 多个渲染进程
  每个标签页都有自己的渲染器进程，用于处理网页的内容显示和 JavaScript 执行 <br />
  渲染进程的核心任务是将 HTML、CSS 和 JS 转换为用户可以与之交互的网页。渲染引擎 Blink 和 V8 都是运行在该进程中。在默认情况下，chrome 会为每个 Tab 页创建一个渲染进程，出于安全考虑，渲染进程都是运行在沙箱模式下的
- 多个插件进程
  主要是负责插件的运行，因为插件容易崩溃，所以用进程来隔离插件出现的问题是一个很好的方案。


## 浏览器从输入url到渲染的过程？


## DOM 文档加载步骤

1. 请求资源

2. 解析 HTML 结构。

- 浏览器接收到 HTML 内容后，开始解析 HTML 标记，构建 DOM 树。这是一个逐步的过程，浏览器会尽可能快地解析并显示内容给用户。
- 在解析过程中，如果遇到外部资源（如 CSS 文件、JavaScript 文件），浏览器会发起额外的网络请求来获取这些资源
- 解析并执行脚本代码

3. 构建渲染树 (Render Tree)
   构建 DOM 树的同时，浏览器也在解析 CSS 样式表，创建 CSSOM（CSS Object Model）。然后，将 DOM 树与 CSSOM 结合起来，构建渲染树。渲染树只包含可见元素，因为它不包括诸如`<head>`标签中的内容或被设置为 display: none 的元素
   ::: warning
   DOM 树构建完成。//DOMContentLoaded <br />
   DOMContentLoaded 事件在形成完整 DOM 树之后就会触发，不理会图像、JavaScript 文件、CSS 文件或其他资源是否已经下载完毕。——《JavaScript 高级程序设计》
   :::

4. 布局 (Layout)
   渲染树建立之后，浏览器会计算每个节点的位置和尺寸，这个阶段被称为布局或重排（reflow）。这是为了确定每个元素在屏幕上的确切位置
5. 绘制 (Painting)
   布局完成后，浏览器开始绘制，即填充颜色、图像、边框等。这一步骤生成了用户最终看到的网页画面

6. 合成
   对于现代浏览器，某些部分可能是在不同的图层上绘制的。在最后一步，浏览器会将这些图层合成为一个完整的页面视图。例如，视频、插件内容或者带有透明度的元素可能会被放在单独的图层上

7. 页面加载完毕。//window.onload

::: warning
DOMContentLoaded 和 load 区别 <br />
**DOMContentLoaded**

- 触发时机
  DOMContentLoaded 事件在形成完整 DOM 树之后就会触发，不理会图像、JavaScript 文件、CSS 文件或其他资源是否已经下载完毕
- 使用场景
  如果你需要尽早与 DOM 进行交互（例如添加事件监听器、修改元素样式或初始化某些库），但又不依赖于所有外部资源都已加载完毕，那么 DOMContentLoaded 是一个很好的选择
  **load**
- 触发时机
  当整个页面及其所有依赖资源（包括样式表、图片、JavaScript 文件、iframe 等）都完全加载完成后触发。
- 使用场景
  如果你的脚本需要确保所有的资源都已经就绪（例如，你可能需要根据图片的实际尺寸来调整布局，或者你有依赖特定资源的插件），那么你应该等待 load 事件
  :::

## 浏览器渲染流程

- 浏览器通过请求得到一个HTML文本；
-  渲染进程解析HTML文本，构建DOM树；
- 解析HTML的同时，如果遇到内联样式或者样式脚本，则下载并构建样式规则（stytle rules），若遇到JavaScript脚本，则会下载执行脚本；
- DOM树和样式规则构建完成之后，渲染进程将两者合并成渲染树（render tree）；
- 渲染进程开始对渲染树进行布局，生成布局树（layout tree）；
- 渲染进程对布局树进行绘制，生成绘制记录；
- 渲染进程的对布局树进行分层，分别栅格化每一层，并得到合成帧；
-  渲染进程将合成帧信息发送给GPU进程显示到页面中；

<Image  src="./images/rendering.png" />

## JS 阻碍页面加载

由于 JavaScript 是可操纵 DOM 的,如果在修改这些元素属性同时渲染界面（即 JavaScript 线程和 UI 线程同时运行）,那么渲染线程前后获得的元素数据就可能不一致了。
因此为了防止渲染出现不可预期的结果,浏览器设置 GUI 渲染线程与 JavaScript 引擎为互斥的关系。
当 JavaScript 引擎执行时 GUI 线程会被挂起,GUI 更新会被保存在一个队列中等到引擎线程空闲时立即被执行。
从上面我们可以推理出,由于 GUI 渲染线程与 JavaScript 执行线程是互斥的关系,
当浏览器在执行 JavaScript 程序的时候,GUI 渲染线程会被保存在一个队列中,直到 JS 程序执行完成,才会接着执行。
因此如果 JS 执行的时间过长,这样就会造成页面的渲染不连贯,导致页面渲染加载阻塞的感觉。

## css 加载阻塞

DOM 解析和 CSS 解析是两个并行的进程,所以 CSS 加载不会阻塞 DOM 的解析。
然而,由于 Render Tree 是依赖于 DOM Tree 和 CSSOM Tree 的,
所以他必须等待到 CSSOM Tree 构建完成,也就是 CSS 资源加载完成(或者 CSS 资源加载失败)后,才能开始渲染。
因此,CSS 加载会阻塞 Dom 的渲染。
由于 JavaScript 是可操纵 DOM 和 css 样式 的,如果在修改这些元素属性同时渲染界面（即 JavaScript 线程和 UI 线程同时运行）,那么渲染线程前后获得的元素数据就可能不一致了。
因此为了防止渲染出现不可预期的结果,浏览器设置 GUI 渲染线程与 JavaScript 引擎为互斥的关系。

因此,样式表会在后面的 js 执行前先加载执行完毕,所以 css 会阻塞后面 js 的执行

## 关键渲染路径（CRP），如何优化

#### 优化

- 减少关键资源的数量：尽量减少必须加载的关键资源（如 CSS、JavaScript 文件），以缩短解析和执行的时间。
- 内联关键 CSS：将对首屏渲染至关重要的 CSS 直接嵌入到 HTML 文档中，避免额外的网络请求。
- 延迟非关键资源的加载：使用异步加载或懒加载技术推迟加载不影响首屏展示的资源，如图片、非关键 CSS 和 JavaScript。
- 优化资源加载顺序：确保关键资源优先加载，而非关键资源可以稍后加载。
- 压缩和最小化资源：移除不必要的空格、注释和缩短属性名称，以减小文件大小，加快下载速度。
- 使用高效的缓存策略：设置适当的 HTTP 缓存头，让浏览器能够在后续访问中重用已下载的资源，而不是每次都重新请求。
- 考虑使用 CDN：利用内容分发网络（CDN）提供静态资源，缩短用户的下载时间。
- 优化 JavaScript 执行：尽量减少 JavaScript 的阻塞行为，使用异步或 defer 属性来延迟脚本的执行，直到 DOM 完全加载。

### Dom 优化

1. 删除不必要的代码和注释包括空格,尽量做到最小化文件。
2. 可以利用 GZIP 压缩文件。
3. 结合 HTTP 缓存文件
4. 代码内部优化

### CSS 优化

CSS 会阻止页面呈现 因此考虑优化 css

1. 减少关键 css 元素数量
2. 减少 css 选择器的嵌套
3. 精简样式， 减小文件的大小
4. 样式文件整合， 减少样式文件的个数
5. 压缩
6. 样式文件引入放到 head 中， 放到 js 前面
7. 尽量不要使用@import 引入文件
   CSS 中的 @import 表示在一个样式文件中导入另外一个样式文件。 一个样式文件 import 另外一个样式文件时， 只有在这个样式文件被收到且被解析完成才会 import 。 这样会增加 CRP 长度。

## async defer preload prefetch

1. async (异步)
   - 解析时机：当浏览器遇到带有 async 属性的 `<script> `标签时，它会立即开始并行下载该脚本文件，而不阻塞 HTML 文档的解析。<br />
     然而，一旦异步脚本下载完成，它会立即执行，此时可能会暂停 HTML 解析。这是因为当一个 async 脚本被执行时，它需要占用 JavaScript 引擎来执行其代码，这期间其他任务（包括 HTML 解析）会被暂时搁置。但这通常不会造成显著的影响，除非脚本执行时间非常长
   - 执行时机：一旦脚本下载完成，它就会立即执行，这可能是在 HTML 解析之前、期间或之后发生，具体取决于下载完成的时间点。
   - 适用场景：async 适合用于那些不依赖于其他脚本且其自身也不影响页面内容生成（例如广告或分析代码）的脚本。由于脚本可能会在文档解析前被执行，因此不适合需要操作 DOM 的脚本。
2. defer (延迟)

   - 解析时机：与 async 类似，defer 也允许脚本文件并行下载，同时不会阻塞 HTML 文档的解析。
     执行时机：但是，带有 defer 属性的脚本会在整个 HTML 文档完全解析之后，但在 DOMContentLoaded 事件触发之前执行。这意味着所有的 defer 脚本将按照它们出现在文档中的顺序依次执行。
   - 适用场景：defer 适用于那些需要在 DOM 完全加载后运行的脚本，比如那些要操作 DOM 或者需要确保在所有 HTML 元素都已解析完毕后的脚本。
     ::: warning

     - 执行顺序：如果页面中有多个带有 async 属性的脚本，它们的执行顺序是不确定的，因为每个脚本都会在其下载完成后立即执行。而带有 defer 属性的脚本会按照它们在文档中出现的顺序执行。
     - DOM 操作：async 脚本可以在 DOM 尚未完全构建时就执行，这可能导致错误，特别是当脚本试图访问尚未加载的元素时。defer 脚本则保证了在 DOM 构建完成后执行，从而避免了这类问题。

     :::

3. preload：提前下载，需要的时候立即执行，无需再下载
4. prefetch：提前下载，在未来的某个页面可能会执行，节省下载时间

## 回流与重绘

### 回流

当 Render Tree 中部分或全部元素的尺寸、结构、或某些属性发生改变时,浏览器重新渲染部分或全部文档的过程称为回流。 </br >

会导致回流的操作：

```markdown
- 页面首次渲染
- 浏览器窗口大小发生改变
- 元素尺寸或位置发生改变元素内容变化（文字数量或图片大小等等）
- 元素字体大小变化
- 添加或者删除可见的 DOM 元素
- 激活 CSS 伪类（例如：:hover）
- 查询某些属性或调用某些方法
```

</br >

一些常用且会导致回流的属性和方法:

```markdown
- 修改样式
  （例如 element.style.width = '100px'）
- DOM 操作
- 获取布局信息
- 动画和变换
```

### 重绘

当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility 等）,浏览器会将新样式赋予给元素并重新绘制它,这个过程称为重绘

有时即使仅仅回流一个单一的元素,它的父元素以及任何跟随它的元素也会产生回流。现代浏览器会对频繁的回流或重绘操作进行优化：浏览器会维护一个队列,把所有引起回流和重绘的操作放入队列中,如果队列中的任务数量或者时间间隔达到一个阈值的,浏览器就会将队列清空,进行一次批处理,这样可以把多次回流和重绘变成一次。

如何避免

- css

```markdown
1. 避免使用 table 布局。
2. 尽可能在 DOM 树的最末端改变 class。
3. 避免设置多层内联样式。
4. 将动画效果应用到 position 属性为 absolute 或 fixed 的元素上。
5. 避免使用 CSS 表达式（例如：calc()）。
```

- js

```markdown
1. 避免频繁操作样式,最好一次性重写 style 属性,或者将样式列表定义为 class 并一次性更改 class 属性。
2. 避免频繁操作 DOM,创建一个 documentFragment,在它上面应用所有 DOM 操作,最后再把它添加到文档中。
3. 也可以先为元素设置 display: none,操作结束后再把它显示出来。因为在 display 属性为 none 的元素上进行的 DOM 操作不会引发回流和重绘。
4. 避免频繁读取会引发回流/重绘的属性,如果确实需要多次使用,就用一个变量缓存起来。
5. 对具有复杂动画的元素使用绝对定位,使它脱离文档流,否则会引起父元素及后续元素频繁回流。
```



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
  let xmlHttp, timer;
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
      if (
        (xmlHttp.status >= 200 && xmlHttp.status < 300) ||
        xmlHttp.status == 304
      ) {
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

[Fusion-UI](https://fusion.design/pc/component/upload#%E8%87%AA%E5%AE%9A%E4%B9%89%20Request) upload request 封装

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

```js
/**
 * clone from https://github.com/react-component/upload/blob/master/src/request.js
 */

function getError(option, xhr, msg) {
  msg = msg || `cannot post ${option.action} ${xhr.status}'`;
  const err = new Error(msg);
  err.status = xhr.status;
  err.method = option.method;
  err.url = option.action;
  return err;
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

// option {
//  onProgress: (event: { percent: number }): void,
//  onError: (event: Error, body?: Object): void,
//  onSuccess: (body: Object): void,
//  data: Object,
//  filename: String,
//  file: File,
//  withCredentials: Boolean,
//  action: String,
//  headers: Object,
//  method: String
//  timeout: Number
// }
export default function upload(option) {
  const xhr = new XMLHttpRequest();

  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }
      option.onProgress(e);
    };
  }

  const formData = new FormData();

  if (option.data) {
    Object.keys(option.data).forEach((key) => {
      formData.append(key, option.data[key]);
    });
  }
  if (option.file instanceof Blob) {
    formData.append(option.filename, option.file, option.file.name);
  } else {
    formData.append(option.filename, option.file);
  }

  xhr.onerror = function error(e) {
    option.onError(e);
  };

  xhr.onload = function onload() {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(option, xhr), getBody(xhr));
    }

    option.onSuccess(getBody(xhr), xhr);
  };

  option.method = option.method || "POST";
  xhr.open(option.method, option.action, true);

  // In Internet Explorer, the timeout property may be set only after calling the open() method and before calling the send() method.
  // see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
  const { timeout } = option;

  if (typeof timeout === "number" && timeout > 0) {
    xhr.timeout = timeout;
    xhr.ontimeout = () => {
      const msg = `Upload abort for exceeding time (timeout: ${timeout}ms)`;
      option.onError(getError(option, xhr, msg), getBody(xhr));
    };
  }

  // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
  if (option.withCredentials && "withCredentials" in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  // when set headers['X-Requested-With'] = null , can close default XHR header
  // see https://github.com/react-component/upload/issues/33
  if (headers["X-Requested-With"] !== null) {
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  }

  for (const h in headers) {
    if (headers.hasOwnProperty(h) && headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h]);
    }
  }
  xhr.send(formData);

  return {
    abort() {
      xhr.abort();
    },
  };
}
```



## 资料引用：

<a href="https://zh.javascript.info/ui" target="_blank"  style="display: block">浏览器：文档，事件，接口</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/TgsmduAgDoabUCxHneXcEbVInzO" target="_blank"  style="display: block">浏览器事件详解</a>
