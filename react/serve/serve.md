# 服务端渲染 SSR


<script setup>
import Image from "../../components/Image/index.vue"
</script>

服务端渲染（Server-Side Rendering，简称 SSR）是一种网页应用的渲染方式，指的是在服务器端完成页面的内容生成，并将生成好的 HTML 发送到客户端浏览器进行展示。这种方式与客户端渲染（Client-Side Rendering, CSR）相对，后者是在浏览器端通过 JavaScript 动态加载数据并构建页面内容

## 客户端渲染 CSR

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

## 服务端渲染优势

- 改善首屏加载时间：因为 HTML 已经在服务器端生成好，所以用户可以更快地看到页面内容，这特别有利于提高用户体验。
- SEO 友好：搜索引擎爬虫可以直接读取完整的 HTML 内容，而不需要执行 JavaScript 代码来获取页面内容，这对提升网站的搜索引擎排名非常有帮助。
- 减少客户端资源消耗：由于大部分的渲染工作由服务器承担，因此减少了客户端设备上的计算负担，特别是在移动设备上这一点尤为重要。


## 服务端渲染劣势

- 增加了服务器负载：由于需要在服务器端生成页面内容，因此会增加服务器的计算和内存消耗，特别是在高并发情况下，可能会对服务器造成压力。
- 开发和调试复杂度增加：由于需要在服务器端和客户端进行渲染，因此开发和调试变得更加复杂，需要处理跨平台和跨环境的问题。
- 需要更多的服务器资源：由于需要在服务器端进行渲染，因此需要更多的服务器资源，包括 CPU、内存和带宽等。

## 服务端渲染原理
<Image  src="./images/serve.jpg" />