# 同构渲染

<script setup>
import Image from "../../components/Image/index.vue"
</script>

服务端渲染（Server-Side Rendering，简称 SSR）是一种网页应用的渲染方式，指的是在服务器端完成页面的内容生成，并将生成好的 HTML 发送到客户端浏览器进行展示。这种方式与客户端渲染（Client-Side Rendering, CSR）相对，后者是在浏览器端通过 JavaScript 动态加载数据并构建页面内容

## 客户端渲染 CSR

<Image  src="/react/serve/images/CSR.png" />

客户端渲染（Client-Side Rendering，简称 CSR）是一种网页应用的渲染方式，指的是页面的初始 HTML 文件在客户端（浏览器）通过 JavaScript 动态加载数据并构建页面内容。与服务端渲染（Server-Side Rendering, SSR）不同，CSR 最初只发送一个包含最少 HTML、CSS 和 JavaScript 的页面到客户端，然后由 JavaScript 代码负责获取数据并在浏览器中生成最终的用户界面
<br />
客户端渲染的优势：

- 提高交互性：由于页面内容是根据用户的操作动态更新的，因此可以提供更流畅、响应更快的用户体验。
- 减少服务器负载：初次之后的数据请求通常采用 API 调用的形式，这使得服务器只需要处理数据逻辑而非视图渲染，从而减轻了服务器的负担。
- 良好的开发体验：现代前端框架（如 React、Vue.js、Angular 等）支持组件化开发，使开发者能够更容易地维护和扩展项目。
  <br />
  客户端渲染的挑战：
- 首屏加载时间较长：因为页面首次加载时需要下载必要的 JavaScript 文件并执行，这可能会导致用户看到空白页面的时间较长，特别是对于网络状况不佳或设备性能较差的用户来说更为明显。
- SEO 不友好：传统的 CSR 对搜索引擎爬虫不够友好，因为它们可能无法执行 JavaScript 来获取完整的页面内容。不过，随着技术的发展，一些搜索引擎已经改进了对 JavaScript 的支持，同时开发者也可以采用预渲染等技术来改善这个问题。
  <br />

  总的来说，CSR 非常适合那些需要高度交互性的 Web 应用程序，但对于静态内容较多或者对 SEO 要求较高的网站，可能需要结合其他渲染策略（如 SSR 或者静态站点生成）以达到最佳效果

## 服务端渲染

<Image  src="/react/serve/images/serve.jpg" />
<Image  src="/react/serve/images/SSR.png" />

优势
<br />

- 改善首屏加载时间：因为 HTML 已经在服务器端生成好，所以用户可以更快地看到页面内容，这特别有利于提高用户体验。
- SEO 友好：搜索引擎爬虫可以直接读取完整的 HTML 内容，而不需要执行 JavaScript 代码来获取页面内容，这对提升网站的搜索引擎排名非常有帮助。
- 减少客户端资源消耗：由于大部分的渲染工作由服务器承担，因此减少了客户端设备上的计算负担，特别是在移动设备上这一点尤为重要。

劣势
<br />

- 增加了服务器负载：由于需要在服务器端生成页面内容，因此会增加服务器的计算和内存消耗，特别是在高并发情况下，可能会对服务器造成压力。
- 开发和调试复杂度增加：由于需要在服务器端和客户端进行渲染，因此开发和调试变得更加复杂，需要处理跨平台和跨环境的问题。
- 需要更多的服务器资源：由于需要在服务器端进行渲染，因此需要更多的服务器资源，包括 CPU、内存和带宽等。

## 同构渲染

### 同构流程

- 服务端渲染应用快照
  - 生成快照的同时，还会生成当前数据状态的初始数据，给客户端做初始化处理
  - 应用快照不具备事件绑定的能力，即定义好的事件不会注册到 DOM 上
- 客户端激活
  - 把当前页面已经渲染的 DOM 元素和 vue.js 渲染的虚拟 DOM 建立联系
  - 由于真实 DOM 和虚拟 DOM 都是树形结构，并且节点之间存在相互关系的，激活就可以通过递归在真实 DOM 和虚拟 DOM 之间建立联系，即 vnode.el = el，并且保证是从容器元素的第一个子节点开始，即 el.firstChild
  - 为页面中 DOM 元素添加事件绑定，使页面支持事件交互
  - vue.js 从 HTMl 中提取由服务端序列化后发送过来的数据，用于初始化整个 vue.js 的应用

### 实现脱水（Dehydrate）和注水（Hydrate）

- 实现服务器端脱水
  - 服务器端获取到数据后，把数据跟随 HTML 一起传给客户端的过程
- 实现客户端注水
  - 客户端拿到 HTML 和数据，利用这个数据来初始化组件

### 同构渲染要点

- 避免状态单例，也就是避免将对象或者变量创建在全局作用域中，否则它会在所有请求之间共享，在不同请求中造成状态污染
- 避免访问特定平台的 API。node 端和浏览器端 API 不适配，我们推荐将操作 dom 或者访问 window 等浏览器行为，写在 onMounted 生命周期中，这样就可以避免在 node 端访问浏览器 api 导致报错
- 避免在服务端生命周期中执行全局副作用代码，比如 setInterVal。因为服务端不会执行 destory 的销毁 hook，会导致服务器内存溢出

### 服务器端优化

- 服务器端测试
  - 我们可以通过 apach bench, jmeter 等
  - abs -n 1000 -c 100 http://localhost:3000/ ,表示以 100 并发的形式发送了 1000 个请求到 localhost: 3000
  - 我们可以接入 nodejs 的监控告警，保证服务稳定性
- 多进程优化

  ```js
  const cluster = require("cluster");
  // cpu总数
  const numCPUs = require("os").cpus().length;
  module.exports = (task) => {
    if (cluster.isMaster) {
      for (let i = 0; i < numCPUS / 2; i++) {
        const worker = cluster.fork();
      }
    } else {
      task();
    }
  };
  ```

- 内存溢出处理
  - 我们可以通过 process 判断当前子进程用掉的内存，当占用内存大于阈值的时候，就关掉这个子进程，防止内存泄漏
  ```js
  const timer = setInterVal(() => {
    const mem = process.memoryUsage();
    if (mem.rss > 300 * 1024 * 1024) {
      cleaterVal(timer);
      process.exit(1);
    }
  }, 5000);
  ```
- 处理未捕获异常
  ```js
  process.on("oncaughtException", (err) => {
    // 需要对错误进行日志上报，写入日志，比如sentry
    process.exit(1);
  });
  ```
- 心跳包检测
  - 防止子进程卡死
    - 主进程通过 worker.send 给子进程发送消息
    - 子进程通过 process.on('messgae', () => {})订阅主进程发送的消息，然后通过 process.send 返回给主进程信息
    - 主进程通过 worker.on('message', () => {})订阅子进程发送的信息，如果累计一定次数没有收到子进程返回的信息，则关闭子进程
- 子进程自动重建
  ```js
  cluster.on("exit", () => {
    // 创建新的子进程
    setTimeout(() => {
      createWorker();
    });
  });
  ```
使用PM2部署我们的SSR应用
然后使用同构应用框架进行开发
- https://www.nuxtjs.cn/guide/installation(Vue)
- https://www.nextjs.cn/learn/basics/create-nextjs-app(React)