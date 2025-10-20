# 前端工程化

## 介绍

- 模块化
- 组件化
- 规范化
- 自动化 CI CD
- 最佳实践 : 基于行业内最佳实践, 开箱即用的框架 dva umi
- 好, 快 , 稳 依赖 vite esm 等能力
  前端工程化是为了让前端开发更现代化、更高效率、更规范化、更可维护.尽可能通过更多的规范 约束开发人员的研发流程

### 模块化

模块化指的是将代码功能做拆分，分成独立地单能相互依赖的片段

- javascript 模块化: CMD, AMD, CommonJS, ES6
- CSS 模块化: CSS Modules, BEM, CSS in JS, Vue 特有的 CSS Scoped
- HTML 模块化: EJS, vue 的 template react 的 jsx

### 组件化

组件化指的是将 UI 拆分成独立的、可复用的代码片段

- React, Vue, Angular

### 规范化

规范化指的是制定一系列的规范，来约束开发人员的行为，保证代码质量

- 代码规范: ESLint, Stylelint
- 文档规范: Dumi, Storybook
- 项目规范: Commitlint, Gitflow
- 目录结构规定。
- 代码风格（包括 JS、HTML、CSS）。
- 注释规范。
- Git 工作流规范。
- Code Review。
- 请求接口规范。
- husky, lint-staged


### 自动化

自动化指的是通过工具，将一些重复性的工作自动化，提高开发效率

- 自动化构建: Webpack, Rollup, Parcel

## 工作中的具体体现

### 脚手架

- 准备阶段

  - 技术选型
  - 代码规范 lint
    - 分支管理规范
    - 项目初始资源规范
    - 生态规范 UI 库 静态站点 npm cdn github
    - 三方规范

- 开发阶段
  - ide 配置规范 vs code
  - 开发 打包流程
  - 本地 mock 服务
  - 代码质量规范 code review
  - 代码测试 单侧 E2E
- 发布阶段
  - commit changelog
  - 部署

### 体验衡量

- preformance
- 是否有问题
  - js
  - resource
  - request
- 秒开率
- 数据调研

### 稳定性

- 监控预警
- 行为监控

## 包管理工具

管理工具 nrm

### npm

#### package.json

- name： 一定要的

```js
npm view xxx    // 判断是否有这个包
```

- version：
- dependencies: 开发环境+生产环境的依赖模块
- devDependencies: 开发环境的依赖模块
- peerDependencies: 同等依赖， 依赖某个环境使用的， 依赖某个版本，比如 react-dom 和 react 的版本要一致
- bundledDependencies: 打包时包含的依赖模块，这几个包将被一起打包
- engine: 指定项目运行的 node 版本, 或者运行环境

#### lock

锁定版本， 确保每次安装的依赖版本一致

### yarn

### pnpm

- 高性能
- 节省空间
  - 使用硬链接的方式： 多个文件名指向同一个索引节点，及所有的 package 都放到一个地方，然后通过软链接的方式链接到项目中，只要符合条件就复用， 这样节省了磁盘空间， 并提升安装速度
  - node_modules 目录是非扁平的，在引用依赖时， 通过使用软链接的方式，相当于一个快捷方式， 找到对应磁盘目录（.pnpm）下的依赖地址用来维护层级关系

### 多包管理工具

优点：

- 提供标准的工作流程
- 降低基建成本

缺点:

- 体积问题
- 权限问题
- 版本控制问题

## 前端构建工具

### webpack

webpack 是一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundles，这些 bundles 会以供你的应用程序使用，从而实现快速的访问时间以及为您的代码提供细粒度的控制。

- entry: 入口文件 递归解析
- output: 输出文件
- loader: 处理不同类型的文件 ast 转换
- plugin: 插件：用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。
- mode: 模式

#### 构建流程

- 初始化
- 编译
- 输出

#### 面试

- 如何实现一个 loader

  - 如何测试
    - npm link
    - resolverLoader
  - 常见的 loader
  - 实现很少， 基本没啥意义
  - 原理

  ```js
  module.exports = function (source) {
    return source;
  };
  ```

#### 构建优化

- 包的大小优化
  - 按需加载（异步组件）， 减少首次加载页面的资源体积
  - 配合缓存， 把不怎么变动的包打包到一起(vendor.js),公共资源单独打包
  - 减少 commonjs, 尽量使用 esm 的库，tree shaking
  - externals: 把一些包放到 cdn 上， 不打包到 bundle 中, 通过外部导入的形式使用第三方资源
- 打包速度优化
  - 缓存（空间+时间的平衡） Cache dll
  - 多线程打包 (happy-pack) thread-loader
  - 云端构建缓存

## 引用

<a href="https://y03l2iufsbl.feishu.cn/docx/ILc7dH9SsoqFadxdzFHcsKM5nef" target="_blank"  style="display: block">前端工程化详解</a>
<a href="https://y03l2iufsbl.feishu.cn/docx/Ib50deJBsoJSNlxUE5SccJ1knUd" target="_blank"  style="display: block">自动化构建</a>
<a href="https://y03l2iufsbl.feishu.cn/docx/ARfxdc6b1oq7wCxGx9Dcpxmcnac" target="_blank"  style="display: block">自动化测试及部署 </a>
<a href="/other/specification/pdf/工程化建设.pdf" target="_blank"  style="display: block">前端构建工具</a>
<a href="/other/specification/pdf/前端包&代码管理工具.pdf" target="_blank"  style="display: block">代码管理工具</a>
<a href="/other/specification/pdf/前端构建工具.pdf" target="_blank"  style="display: block">前端构建工具</a>
<a href="/other/specification/pdf/webpack详解1.pdf" target="_blank"  style="display: block">webpack 详解 1</a>
<a href="/other/specification/pdf/webpack详解2.pdf" target="_blank"  style="display: block">webpack 详解 2</a>
<a href="/other/specification/pdf/webpack详解3.pdf" target="_blank"  style="display: block">webpack 详解 3</a>
<a href="/other/specification/pdf/webpack详解4.pdf" target="_blank"  style="display: block">webpack 详解 4</a>
