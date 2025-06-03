# 性能优化

<script setup>
import Image from "../../components/Image/index.vue"
</script>

从输入 URL 到页面展示谈整个前端页面的加载性能优化

<Image  src="/other/performance/images/load.jpg" />

上图是从输⼊ URL 到⻚⾯展⽰完整流程⽰意图， 整个过程中需要各个进程之间的配合

:::tip

- 浏览器进程主要负责⽤⼾交互、⼦进程管理和⽂件储存等功能。
- ⽹络进程是⾯向渲染进程和浏览器进程等提供⽹络下载功能。
- 渲染进程的主要职责是把从⽹络下载的 HTML、JavaScript、CSS、图⽚等资源解析为可以显⽰和交互的
  ⻚⾯。因为渲染进程所有的内容都是通过⽹络获取的，会存在⼀些恶意代码利⽤浏览器漏洞对系统进⾏攻
  击，所以运⾏在渲染进程⾥⾯的代码是不被信任的。这也是为什么 Chrome 会让渲染进程运⾏在安全沙箱
  ⾥，就是为了保证系统的安全。
  :::

## 用户输入

当⽤⼾在地址栏中输⼊⼀个查询关键字时，地址栏会判断输⼊的关键字是**搜索内容**，还是**请求的 URL**

- 如果是搜索内容，地址栏会使⽤浏览器默认的搜索引擎，来合成新的带搜索关键字的 URL。
- 如果判断输⼊内容符合 URL 规则，⽐如输⼊的是 time.geekbang.org，那么地址栏会根据规则，把这段内
  容加上协议，合成为完整的 URL<a href="#performance1"><Badge type="danger" text="URL和URI区别" /></a>

回车后，此时浏览器标签页上的图标进入加载状态，但是页面还是之前打开的页面， 并不会立即更换。 因为需要等待提交⽂档阶段，⻚⾯内容才会被替换

## URL 请求过程

- 浏览器进程构建请求⾏信息，会通过进程间通信（IPC）将 URL 请求发送给⽹络进程
- 网络进程获取到 URL 后会查找本地是否缓存了该资源，，如果有，拦截请求，直接 200 返回；否则进⼊⽹络请求过程<a href="/browser/cache.html"><Badge type="danger" text="如何使用缓存提高加载速度" /></a>
- 如果没有在缓存中找到资源， 进入网络请求
  - DNS 解析 <a href="#performance2"><Badge type="danger" text="如何加快DNS解析" /></a>
  - 如果是 HTTPS 需要建立 TLS<a href="#performance3"><Badge type="danger" text="什么是https" /></a>
  - TCP 链接<a href="/node/node.html#http1-0-http1-1-http2-http3"><Badge type="danger" text="怎么加快TCP链接" /></a>
  - 浏览器端会构建请求⾏、请求头等信息，并把和该域名相关的 Cookie 等数据附加到请求头中，然后向服务器发送构建的请求信息 <a href="/node/node.html#osi-七层模型"><Badge type="danger" text="IOS7层模型是啥" /></a>
  - 服务器接收到请求信息后，会根据请求信息⽣成响应数据（包括响应⾏、响应头和响应体等信息），并发给⽹络进程，由网络进程开始解析
    - 重定向： 如果状态码返回 301 或者 302 就是重定向
    - 响应数据处理， 针对不同的 Content-Type 进行不同的处理
      - 如果是下载类[application/octet-stream]，交给浏览器下载进程，该 url 导航流程结束
      - 如果是 HTML, 浏览器继续导航流程<a href="#performance4"><Badge type="danger" text="移动版本+ 桌面版本 同域名怎么区分资源" /></a>

## 准备渲染进程

谷歌会针对同一个站点复用相同渲染进程， 不同站点的都会有自己的渲染进程

总结来说，打开⼀个新⻚⾯采⽤的渲染进程策略渲染进程策略就是：

- 通常情况下，打开新的⻚⾯都会使⽤单独的渲染进程；
- 如果从 A ⻚⾯打开 B ⻚⾯，且 A 和 B 都属于同⼀站点的话，那么 B ⻚⾯复⽤ A ⻚⾯的渲染进程；如果是其他情况，浏览器进程则会为 B 创建⼀个新的渲染进程。

渲染进程准备好之后，还不能⽴即进⼊⽂档解析状态，因为此时的⽂档数据还在⽹络进程中，并没有提交给渲染进程，所以下⼀步就进⼊了提交⽂档阶段。

## 提交文档

⾸先要明确⼀点，这⾥的“⽂档”是指 URL 请求的响应体数据。

- “提交⽂档”的消息是由浏览器进程发出的，渲染进程接收到“提交⽂档”的消息后，会和⽹络进程建⽴传输数据的“管道
- 等⽂档数据传输完成之后，渲染进程会返回“确认提交”的消息给浏览器进程。
- 浏览器进程在收到“确认提交”的消息后，会更新浏览器界⾯状态更新浏览器界⾯状态，包括了安全状态、地址栏的 URL、前进后退的历史状态，并更新 Web ⻚⾯。

<Image  src="/other/performance/images/load1.png" />

这也就解释了为什么在浏览器的地址栏⾥⾯输⼊了⼀个地址后，之前的⻚⾯没有⽴⻢消失，⽽是要加载⼀会⼉才会更新⻚⾯。

到这⾥，⼀个完整的导航流程就“⾛”完了，这之后就要进⼊渲染阶段了。

## 渲染阶段

### 运行时概念

- 解析 HTML，构建 DOM 树

  - 根据当前 html 的内容，构建 DOM 树(深度遍历)
  - 构建 DOM 树的过程中，如果遇到 js，会停止构建 DOM 树，先执行 js 代码，然后再继续构建 DOM 树
    :::warning
    单页面应用， 只有一个根节点，其他都是 js 动态生成的

    面试题： 微前端 | 生成独立模块 | 环境隔离

    - iframe
    - webComponent
    - single-spa
      :::

- 解析 CSS，构建 CSSOM 树

  - 解析 css 形成 css 规则树， 解析 css 规则树时，js 执行暂停，直到 css 规则树就绪（js 可能操作 css）
  - **css 规则树生成前，页面不会渲染**

  :::warning
  css 处理过程? css 预处理器
  优先级排序 =》 从上而下进行样式补全

  css 预处理

  - 模块化
  - 变量化
  - 层级结构

  :::

- 合并 DOM 树和 CSSOM 树，构建渲染树 render tree
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
- js 加载
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

## 汇总

### URL 和 URI 的区别 {#performance1}

URL(统一资源定位符)

- scheme(protocol)：协议，例如 http、https、ftp 等
- host：主机名， 例如`www`就是一个主机名
- domain：域名，例如`www.baidu.com`就是一个域名
- port：端口号，http 默认 80
- path：路径
- query：查询字符串，以键值对形式出现
- fragment：文档/资源的名称，用于定位到某个具体的资源

URI 统一资源标识符，URI 是 URL 的父集，URI 是用来标识一个资源的，而 URL 是用来定位一个资源的，URL 是 URI 的子集

### http 和 TCP 的关系

http 和 TCP 的关系

- HTTP 是应用层协议，TCP 是传输层协议
- HTTP 是基于 TCP 协议的，HTTP 传输数据之前，需要先建立 TCP 连接，建立 TCP 连接的过程就是三次握手
- HTTP 传输数据之后，需要断开 TCP 连接，断开 TCP 连接的过程就是四次挥手
- HTTP 通常使用 TCP 作为其传输层协议，通过 TCP 提供的可靠连接来发送和接收数据

### 如何加快 DNS 解析 {#performance2}

DNS（域名系统）解析是将域名转换为 IP 地址的过程， DNS 通过域名查找 IP 地址， 或逆向从 IP 地址反查域名， DNS 就是一个网络服务商，我们的域名解析就是 DNS 上的一条数据

浏览器如何通过域名查询 IP

- 浏览器缓存: 浏览器会缓存 DNS 记录一段时间，这个时间就是 DNS 缓存时间（TTL 值），一般来说，DNS 的缓存时间比较短，大部分情况下，DNS 查询都会在浏览器缓存中找到结果。
- 操作系统缓存: 浏览器会查询操作系统中的 DNS 缓存，如果操作系统中有缓存，那么浏览器就会直接使用操作系统的 DNS 缓存。
- 路由器缓存: 浏览器会查询路由器的 DNS 缓存，如果路由器中有缓存，那么浏览器就会直接使用路由器的 DNS 缓存。
- ISP(互联网服务提供商) DNS 缓存: 浏览器会查询 ISP 的 DNS 缓存，如果 ISP 有缓存，那么浏览器就会直接使用 ISP 的 DNS 缓存。
- 根服务器

如何借助缓存优化呢？

- Prefetch：预加载用户将来可能访问的页面资源 ， 这里可以提前加载一个非常小的文件， 缓存 DNS,方便后期同域名的资源加载
  ```html
  <link rel="prefetch" href="xxx.com" />
  ```
- dns-prefetch: 用于提前解析域名到 IP 地址的过程
  ```html
  <link rel="dns-prefetch" href="//example.com" />
  ```
- preconnect:不仅包括了 DNS 预解析，还包括 TCP 握手以及可选的 TLS 协商（如果使用 HTTPS 的话）。这意味着它可以准备好与指定服务器的所有前期准备工作，使得当实际发起请求时，能够更快地建立连接并开始传输数据。相比于 dns-prefetch，preconnect 更加全面，但也可能消耗更多的资源，因为它准备了更多步骤

```html
<link rel="preconnect" href="https://example.com" crossorigin />
```

- CDN(解决文件根据地理位置的加载速度问题)
- 通过将内容复制到全球各地的服务器节点上来减少用户访问延迟，并提高内容传输的速度和可靠性

### 什么是 https {#performance3}

<Image  src="/other/performance/images/https.png" />

HTTPS 并⾮是⼀个新的协议，通常 HTTP 直接和 TCP 通信，HTTPS 则先和安全层通信，然后安全层再和 TCP 层通信

### 为什么 history 模式要配置 nginx 而 hash 不用

- hash 访问不需要配置是因为路径就是直接的资源路径，而 hash 是条件
- history 模式访问， 服务器不清楚具体的资源路径是哪个，所以需要配置 nginx，配置 nginx 后，nginx 会根据路径返回对应的资源，如果资源不存在，nginx 会返回 index.html，然后前端路由会根据路径进行匹配，然后返回对应的组件

### 文件资源加载有那些方式 怎么优化性能？

- 直接通过外链(同域)进行访问
- 转义文件
- 服务端渲染(优化首屏加载白屏)

如何优化加载性能？

- CDN 加速： 优化物理距离问题
- cookie 动态开关 | 独立域名(只拉取静态资源， 不处理任何其他请求)， 也就是动静分离加载
- 文件压缩 gzip： 减少传输大小
- 文件合并： 减少请求次数

写法
pre | script- defer async
css 放头部 js 放后面？ 避免 css 阻塞 js

<!-- TCP ip 详解 -->

### JS parse

v8: 把 js 高级语言转换成机器语言 js => 字节码 => 机器码
js 字节码： 相对于机器码减少了存储空间； 相对于高级语言减少了转义时间
字节码分流 JIT：把多次执行的代码转成机器码，存储在内存中，下次执行直接从内存中获取
M&S - mark & sweep: => 触达标记，锁定清空 =》<a href="/javascript/basis/GCAndEventLoop.html"><Badge type="danger" text="GC" /></a>

```JS
// 内存分配： 生命变量 函数 对象
// 内存使用： 直接使用， 指针使用
// 内存释放
// 书写时： 对象层级：宜平不宜深 | 根据业务深浅拷贝 | 避免循环引用
// 内存泄露： 尽量不要使用全局变量 | 未清理的定时器 | 合理使用闭包
//
```

### 移动版本+ 桌面版本 同域名怎么区分资源 {#performance4}

反向代理处理的，根据 useAgent 信息不同，返回不同的资源

代理服务器

- 代理服务器
- 反向代理：隐藏真正的服务端
- 正向代理：掩盖真正的请求者

### css 样式优化

选择类型结构 =》 优先排序 =》 从上而下进行样式补全

- 选择器类型优化
  尽量选择低优先级的选择器，避免使用 id 选择器，因为 id 选择器的优先级最高，会覆盖掉其他选择器的样式
- 选择器书写优化（选择读取解析时是从右往左读取的）
  不要使用过多嵌套， 过多的复杂选择器：会降低可读性和增加解析时间
- 避免使用通配符

  ```css
  /** bad */
  * {
  }
  /** good */
  ul,
  li,
  dl,
  dd {
    padding: 0;
    margin: 0;
  }
  ```

- 空选择器依然会触发节点查询， 应高移除空选择器
- 减少使用高级选择器，性能影响大
  ```css
  /** 避免使用正则的属性选择器 */
  [class*="foo"] {
  }
  ```
- 优化统一选择器： 提取选择器的公共部分，减少重复

  - 减少查询选择的效率
  - 减少 css 大小

- 优化统一属性
  ```css
  .a {
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
  }
  .a {
    margin: 10px;
  }
  ```
- 写法优化
  - @import 模块化， 只写复用部分， 后面的会覆盖前面的
  - 动画： css 动画优先 js 动画
  - 移动端布局： flex > float

### 渲染优化

- 减少 DOM 元素的数量以及嵌套层级
- 减少重排
  - 减少频繁的可能造成其他元素布局影响的操作
  - 减少文本流中元素的生成和去除 =》 隐藏 代替 消除
- 减少事件监听， 使用事件代理
- 减少 DOM 操作， 使用文档片段 DocumentFragment
- 修改 class 代替 style, 修改 style 就是相当于修改 DOM
- 虚拟列表

### 框架优化 MVVM

Vue 双向绑定

- 本身：vDOM =》 惰性更新 + 增量更新
- 补充：
  - 指令 v-if/v-show
  - vue-lazyload
  - keep-alive

React UI = fn(data)

- 本身： vDOM =》 差异更新 + 单项数据流 + 事件集约
- 补充
  - shouldComponentUpdate
  - React.memo
  - React.lazy
  - React.Suspense
