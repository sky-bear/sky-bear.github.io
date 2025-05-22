# 性能优化

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## 网页渲染过程

> URL(统一资源定位符)
>
> - scheme：协议，例如 http、https、ftp 等
> - host：主机名， 例如`www`就是一个主机名
> - domain：域名，例如`www.baidu.com`就是一个域名
> - port：端口号，http 默认 80
> - path：路径
> - query：查询字符串，以键值对形式出现
> - fragment：文档/资源的名称，用于定位到某个具体的资源

### DNS 解析

DNS（域名系统）解析是将域名转换为 IP 地址的过程， DNS 通过域名查找 IP 地址， 或逆向从 IP 地址反查域名， DNS 就是一个网络服务商，我们的域名解析就是 DNS 上的一条数据

浏览器如何通过域名查询 IP

- 浏览器缓存: 浏览器会缓存 DNS 记录一段时间，这个时间就是 DNS 缓存时间（TTL 值），一般来说，DNS 的缓存时间比较短，大部分情况下，DNS 查询都会在浏览器缓存中找到结果。
- 操作系统缓存: 浏览器会查询操作系统中的 DNS 缓存，如果操作系统中有缓存，那么浏览器就会直接使用操作系统的 DNS 缓存。
- 路由器缓存: 浏览器会查询路由器的 DNS 缓存，如果路由器中有缓存，那么浏览器就会直接使用路由器的 DNS 缓存。
- ISP(互联网服务提供商) DNS 缓存: 浏览器会查询 ISP 的 DNS 缓存，如果 ISP 有缓存，那么浏览器就会直接使用 ISP 的 DNS 缓存。
- 根服务器

### 发起 TCP 请求

TCP 提供可靠的链接， 链接是需要通过 3 次握手来建立， 关闭需要 4 次挥手关闭连接

#### TCP 三次握手
> `SYN`: synchronize 用于建立连接时同步序列号
> `ACK`: acknowledge 确认收到某个序列号
> `FIN`:  Finish，表示发送端已经没有数据发送
> `seq`: Sequence Number，数据包的序列号
> `ack`: Acknowledgment Number，期望收到的下一个序列号

 所谓的三次握手就是指建立连接时，客户端和服务器总共发送 3 个报文

1.  第一步
  - 客户端发送 SYN=1（同步标志位为1），表示请求建立连接。
  - 随机选择一个初始序列号 seq=x。
  - 状态变为 SYN_SENT
2. 第二步
  - 服务端收到 SYN 后，回应一个 SYN=1 和 ACK=1（确认标志位为1）
  - 服务端也选择一个初始序列号 seq=y，并确认客户端的序号 ack=x+1
  - 状态变为 SYN_RCVD

3. 第三步
  - 客户端发送 ACK=1 给服务端，确认服务端的 seq=y，即 ack=y+1
  - 双方连接建立成功，可以开始通信

```md
Client             Server
  |                   |
  |    SYN=1, seq=x   |
  |------------------>|
  |                   |
  |  SYN=1, ACK=1     |
  |  seq=y, ack=x+1   |
  |<------------------|
  |                   |
  |    ACK=1, ack=y+1 |
  |------------------>|
  |
  [连接已建立]
```

#### TCP 四次挥手

> 四次挥手之指 TCP 连接的断开需要客户端和服务器总共发送 4 个报文

1. 第一次挥手：
  - 客户端发送 FIN=1（结束标志位为1），表示没有更多数据要发送。
  - 状态变为 FIN-WAIT-1。
2. 第二次挥手：
  - 服务端收到 FIN 后，发送 ACK=1 确认，并确认序号为 ack=x+1。
  - 服务端进入 CLOSE-WAIT 状态；客户端进入 FIN-WAIT-2。
3. 第三次挥手：
  - 服务端处理完剩余数据后，发送自己的 FIN=1。
  - 状态变为 LAST-ACK（服务端）。
4. 第四次挥手：
  - 客户端发送 ACK=1 确认服务端的 FIN，并设置 ack=z+1。
  - 客户端进入 TIME-WAIT 状态，等待 2MSL（Maximum Segment Lifetime）时间后正式关闭连接。
```md
Client             Server
  |                   |
  |  FIN=1 seq=p      |
  |------------------>|
  |                   |
  |   ACK=1 ack=p+1  | 
  |<------------------|
  |                   |
  | FIN=1 ACK=1 seq =q ack=p+1 |
  |<------------------|
  |                   |
  |      ACK=1  ack = q+1 |
  |------------------>|
  |
  [连接已关闭]
```

### 发送 HTTP 请求

> HTTP（超文本传输协议）是一个用于传输超媒体文档（如 HTML）的应用层协议。它基于 TCP/IP 协议，用于从服务器传输超文本到本地浏览器的传输协议。

- 请求行
  - 请求方式：GET、POST、PUT、DELETE 等
  - HTTP- version 版本
- get 和 post 的区别
  - get 比 post 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息
  - get 请求参数在 url 中，post 请求参数在请求体中
  - get 请求参数有长度限制，post 请求参数没有长度限制
  - get 请求参数会被浏览器缓存，post 请求参数不会被浏览器缓存
  - get 请求参数会被浏览器自动编码，post 请求参数需要手动编码
  - get 请求参数会被浏览器自动缓存，post 请求参数不会被浏览器缓存
  - get 会产生一个 TCP 数据包，post 会产生两个 TCP 数据包（有个预检过程）
- 请求报头
  - Host：请求的主机名
  - User-Agent：浏览器的信息
  - Accept：浏览器能够接收的内容类型
  - Accept-Language：浏览器能够接收的语言
  - Accept-Encoding：浏览器能够接收的内容编码
  - Cookie：浏览器发送给服务器的 Cookie
  - Connection：浏览器与服务器的连接方式
  - Content-Type：请求体的媒体类型
  - cookie
- 请求正文
- HTTP 缓存

  > 强制缓存优先级高于协商缓存

  - 强缓存：浏览器会检查缓存是否过期，如果未过期，则直接使用缓存，否则发送请求到服务器
  - 协商缓存：浏览器会发送请求到服务器，服务器会检查缓存是否过期，如果未过期，则返回 304，否则返回新的资源
  - 缓存策略：Cache-Control、Expires(http1.0)、Last-Modified、ETag

  ::: warning
  **Cache-Control** 客户端缓存

  - 可缓存性

    - public：HTTP 请求返回时，经过的代理服务器以及客户端都可以对内容进行缓存。
    - private：只有发起请求的浏览器可以进行缓存
    - no-cache：(协商缓存)本地和代理服务器可以缓存，但是每次使用缓存时都要到服务器验证一下，服务器返回可以使用缓存才能生效。

  - 到期性

    - max-age=xxx (xxx is numeric) 缓存的内容将在 xxx 秒后失效, 这个选项只在 HTTP 1.1 可用, 并如果和 Last-Modified 一起使用时, 优先级较高
    - s-maxage 在代理服务器使用
    - max-stale = xxx 发起端设置， 即使缓存失效(max-age)，但在 max-stale 仍在在时间内，依然使用。浏览器端一般不用

  - 重新验证

    - must-revalidate 浏览器重新发送请求到服务器
    - proxy-revalidate

  - 其他
  - no-store 不能存缓存， 每次重新拿
  - no-transform 禁止对内容做修改

  **资源验证**

  - Last-Modified 上次修改时间

    配合 If-Modified-Since 或者 If-Unmodified-Since 使用， 通过对比上次修改时间以验证资源是否更新

    服务器返回带有 Last-Modified 的头部，收到带 Last-Modified 这个头，下次浏览器发送 request 就会带上 If-Modified-Since 或者 If-Unmodified-Since，服务器收到这个 request 的 If-Modified-Since 后，通过读取它的值对比资源存在的地方的 Last-Modified，服务器就告诉浏览器是否可以使用缓存

  - Etag 数据签名

    根据文件的内容生成 Etag（数据签名，最常用做法是对资源内容进行哈希计算），收到带 Etag 这个头，下次浏览器发送 request 就会带上 If-Match 或者 If-Non-Match，服务器收到这个 request 的上 If-Match 或者 If-Non-Match 后，通过读取它的值对比资源存在的地方的 Etag，服务器就告诉浏览器是否可以使用缓存。
    :::

<Image  src="/other/performance/images/cache.png" />

**通过缓存可以加快网页的加载速度，减少服务器的压力，提高用户体验**

### 服务器处理请求并返回 HTTP 报文

- http 状态码
  - 1xx：信息性状态码，表示请求已接收，继续处理
  - 2xx：成功状态码，表示请求已成功接收、理解和接受
  - 3xx：重定向状态码，表示请求需要进一步的操作以完成
    - 301：永久重定向
    - 302：临时重定向
    - 304：资源未修改
  - 4xx：客户端错误状态码，表示请求包含语法错误或无法完成请求
    - 401：未授权
    - 403：禁止访问
    - 404：未找到
  - 5xx：服务器错误状态码，表示服务器在处理请求的过程中发生了错误
    - 500：内部服务器错误
    - 502：Bad Gateway
    - 503：服务不可用
    - 504：Gateway Timeout
- 响应报头
  - Content-Type：响应体的媒体类型
  - Content-Length：响应体的长度
  - Content-Encoding：响应体的编码方式
  - Set-Cookie：服务器发送给浏览器的 Cookie
  - Connection：浏览器与服务器的连接方式
  - Cache-Control：缓存控制
- 响应报文
  - 请求的 html css js 图片等资源

### 浏览器解析渲染页面

- 解析 HTML，构建 DOM 树
  - 根据当前 html 的内容，构建 DOM 树(深度遍历)
  - 构建 DOM 树的过程中，如果遇到 js，会停止构建 DOM 树，先执行 js 代码，然后再继续构建 DOM 树
- 解析 CSS，构建 CSSOM 树
  - 解析 css 形成 css 规则树， 解析 css 规则树时，js 执行暂停，直到 css 规则树就绪（js 可能操作 css）
  - **css 规则树生成前，页面不会渲染**
- 合并 DOM 树和 CSSOM 树，构建渲染树
- 布局渲染树，计算每个节点的位置和大小
  - 布局： 通过渲染树中渲染对象的信息， 计算出渲染对象的位置和尺寸
  - 重排(回流)： 当渲染树中的一部分（或全部）因为元素的规模尺寸，布局，隐藏等改变而需要重新构建
- 绘制渲染树，根据计算好的信息，将每个节点绘制到屏幕上
  - 绘制阶段， 系统会遍历渲染树，并调用渲染器的 paint()方法，将每个节点绘制出来
  - 重绘： 当页面中元素样式的改变并不影响它在文档流中的位置时（例如：修改了字体颜色），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。 他不影响布局属性
  - 回流：某个元素尺寸发生变化，则需要计算它对周围元素的影响，浏览器需要重新渲染页面，这个过程称为回流。 它会影响布局属性
    - 首次渲染
    - 浏览器窗口大小发生变化
    - 元素尺寸或位置发生变化
    - 内容变化（文字数量）
    - 添加或者删除 Dom 元素
    - 激活 css 伪类（如：hover）
    - 查询某些属性或者调用某些方法
      - offsetTop、offsetLeft、offsetWidth、offsetHeight
      - scrollTop、scrollLeft、scrollWidth、scrollHeight
      - clientTop、clientLeft、clientWidth、clientHeight
      - width、height
      - getComputedStyle()
      - getBoundingClientRect()【只有布局定义为脏的时候才会触发重排】
- js 解析
  浏览器开始加载 html 页面， 遇到`script`标签， 会根据标签的属性（sync defer）来决定如何处理脚本
- 浏览器引擎执行 JS

  - 编译
    - 词法分析
    - 语法分析
    - 代码生成
  - 执行
    - 执行上下文和作用域
      - js 引擎会创建执行上下文，包含变量对象、作用域链、this 等
      - js 事件循环

- 页面渲染
  当所有资源都加载和执行完后，页面显示给用户

### 页面渲染过程中触发的事件

## 性能指标

- FP:首次绘制时间
  FP 是指浏览器第一次将任何内容渲染到屏幕上的时间点。这可以是背景颜色、文本、图像等任何形式的内容。FP 并不一定意味着用户可以看到有意义的内容，它只是表示页面开始发生变化的时间点
- FCP:首次内容渲染时间
  FCP:First Contentful Paint. 测量的是页面从开始加载到页面内容的任何部分在屏幕上渲染完成的时间点.对于此指标，“内容”是指文本、图片（包括背景图片）、`<svg>` 元素或非白色 `<canvas>` 元素。也就是用户第一次看到页面上有实际内容出现的时间。
  FCP 建议在 1.8s 以内，如果大于这个值，说明页面加载较慢
- FMP:首次有意义的绘制
  指的是页面主要内容部分完成加载并呈现给用户的时间点。这意味着用户可以开始与页面进行有效的交互或获取所需信息。FMP 通常发生在页面的关键视觉内容（如文章的主要文本、产品图片等）已经显示之后
- LCP:最大内容渲染时间
  LCP:Largest Contentful Paint. 衡量的是视口中最大内容元素何时渲染到屏幕上。这大致表示网页的主要内容何时可供用户查看<br/>
  LCP 建议在 2.5s 以内，如果大于这个值，说明页面加载较慢
- FID:首次输入延迟时间
  FID:First Input Delay. 测量的是从用户第一次与页面交互（例如点击一个链接、按钮或使用 JavaScript 驱动的自定义控件）到浏览器实际能够对交互做出响应的时间,FID 建议在 100ms 以内(考虑第一次交互)

- INP
  通过观察用户访问网页期间发生的所有点击、点按和键盘互动的延迟时间，评估网页对用户互动的总体响应情况
- CLS
  衡量页面在整个生命周期内发生的最大意外布局偏移分数。建议 CLS 小于 0.1s
- LONG TASK
  阻塞住线程超过 50ms 的长任务，包括响应事件的延迟和动画卡顿
- 长时间运运行的事件处理程序
- 回流或其他重新渲染操作，入 dom 操作，动画
- 超过 50ms 的长时间循环

## 性能优化方向

性能优化的目标是，减少页面加载的事件，让用户可以以更快的速度第一时间访问到页面内容，因此核心思路在于如何降低资源的加载时间与如何提高页面的渲染速度

### 网络方面

让资源体积更小，加载更快

- 构建优化

  - 减小打包体积

    - 代码分割 treeShaking 动态垫片 按需加载,代码压缩
      - split chunks 拆包 分割各个模块代码, 提取相同部分,好处是减少重复代码的的出现频率
    - 资源压缩。压缩 HTML/CSS/JS/图像等资源
    - 按需加载，我们可以把页面按照路由/功能单独打包成一个文件， 使用时再加载。 好处加快首屏渲染时间
    - 作用域提升后，构建后的代码会按照引入顺序放到一个函数作用域里，较少函数声明和内存
    - 使用 externals 通过外部导入的形式去使用第三方资源

    ```js
    export default {
      optimization: {
        concatendtedModules: true,
      },
    };
    ```

    - 配合缓存， 把不怎么改动的包单独打到一起。 vendor.js

  - 减少打包时间

    - treeShaking 移除重复代码和未使用代码, 只对 ES 规范生效,其他模块规范无效.因为 treeShaking 是针对静态分析的, 只有 import/export 才能提供静态的导入和导出功能. webpack 打包时, 只要把 mode 改成生产环境, 就会自动开启 treeShaking
    - 动态垫片 polyfill.io.提供一个服务, 根据当前 UA 的返回的浏览器需要的 polyfill, 按需使用 polyfill

    ```js
    import HtmlTagsPlugin from  "html-webpack-tags-plugin"
      export default {
        //...
        plugins: [
          new HtmlTagsPlugin({
            append: false, //在生成资源后插入
            publicjPath: false //使用公共路径
            tags: ["https: //polyfill.alicdn.com/polufill.min.js"]// 资源路径
          })
        ]
      }
    ```

  - 减少打包范围,缓存 定向搜索 提前构建 并行构建

    - 缩减范围

    ```js
    export default {
      //...
      modules: {
        rules: [
          {
            exclude: /node_modules/,
            include: /src/,
            test: /\.js/,
            use: "babel-loader",
          },
        ],
      },
    };
    ```

    - 构建缓存

    ```js
    export default {
      //...
      modules: {
        rules: [{
          exclude: /node_modules/,
          include: /src/,
          test: /\.js/,
          use: [{
            loader: "babel-loader"
            options: {cacheDirectory: true}
          }]
        }]
      }
    }
    ```

- 图像(静态资源)优化
  - 图片压缩，性价比很高。 实现自定义的 webpack 插件，在构建阶段接入一些图片压缩服务
- 分发策略优化
  - 内容分发 CDN
    - 所有静态资源都放在 CDN 上，用户访问时，从离用户最近的服务器上获取资源，减少资源加载时间
    - 核心特点就是缓存和回源， 缓存就是把资源复制到 CDN 服务器上， 回源就是资源过期/不存在就去源站上找
    - CDN 缓存命中率（90%以上）
- 缓存优化
  - 浏览器缓存，也是接入成本最低的性能优化策略
  - 服务器端配置的
    - 静态资源集群的话通常就是 nginx 配置
    - 配置协商缓存和强缓存

### 渲染层面

如何让代码解析更好执行更快，更多的是是一些编码规范

- css 优化
- DOM 优化
  - 缓存 DOM 计算属性(memory)
  - 避免过多的 DOM 操作
- 阻塞优化:基于脚本加载
  - js 与 DOM、其他脚本依赖很强，则设置为 defer
  - 依赖性不强，则设置为 async
- 回流重绘优化
- 异步更新优化
  - DOM 修改，尽量放到微任务中

### 性能优化策略

- 加载优化
  - 优化网络
  - 压缩文件
  - 首屏体验优化
    - 首屏有很多组件，可以只渲染视窗内的组件包括数据请求。
- 渲染优化

  - 更快加载的 js-缓存
    - 组件预加载
      - 组件库、二方库(打点、监控、fetch)、公共模块,通过拆包的方式拆分后，可以提前预加载。
      - 在客户端上，提前下发核心依赖。页面加载的时候，从客户端本地直接获取。
      - 预加载的命中率，如何提高？降级
    - 公共 JS 缓存
      - 通过缓存的方式，提前存储 js（浏览器端使用 indexDb、localstorage）
  - 数据优化
    - 缓存数据
      - 可以结合端侧，做数据缓存。
    - 减少请求
      - 通过 fass 服务（BFF）去合并首屏接口，做接口聚合处理
  - HTML 直出
    - SSR
      - 提前渲染出 HTML，客户端访问的就是最终的页面内容
      - SSR 还是需要网络请求，如果页面很复杂，HTML 内容很大，还是存在白屏时长
    - CSR
      - 客户端提前渲染出 HTMl，理论上任何一个可以运行 js 引擎的地方，都可以做 SSR

  性能优化的最终目标： 淘宝(PHA)和拼多多(做了预渲染)
  预渲染：在上一个提前渲染好下一个可能访问的页面 webview，这个需要客户端配置（做路由拦截，资源加载，webView 管理）,真正意义上的秒开。

## 实战

- vue
  - 路由懒加载
  - 组件异步加载 defineAsyncComponent
- FCP 骨架屏

## 引用

<a href="https://web.developers.google.cn/articles/lcp?hl=zh_cn" target="_blank"  style="display: block">web.developers</a>
