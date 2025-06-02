# webapck

## 介绍

webpack 是一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundles，这些 bundles 会以供你的应用程序使用，从而实现快速的访问时间以及为您的代码提供细粒度的控制。

- entry: 入口文件 递归解析
- output: 输出文件
- loader: 处理不同类型的文件 ast 转换
- plugin: 插件：用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。
- mode: 模式

## 常用配置

### loader

- babel-loader：是一个 Webpack 加载器，它允许你在 Webpack 构建过程中集成 Babel
- @babel/core： Babel 的核心库，它提供了将现代 JavaScript（ES6+）代码转换为向后兼容版本所需的所有基础功能。
- @babel/preset-env 预设的插件集合
- @babel/preset-typescript
- @babel/plugin-transform-runtime 辅助函数
- @babel/runtime
  `@babel/plugin-transform-runtime` 插件通过引用 `@babel/runtime` 提供的模块来替换这些内联的辅助函数，从而避免了重复，减少了打包后的文件大小。
- css-loader: 解析 css 文件，允许在 js 中导入 css， 模块化 css
- style-loader: 将 css 动态插入到 DOM 中，配合 css-loader 使用
- postcss-loader: 解析 css 文件，允许在 css 中使用 import, url 等语法

### plugin

- html-webpack-plugin
- mini-css-extract-plugin：将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，支持按需加载 CSS
- thread-loader：将耗时的 loader 放到 worker pool 中运行，以充分利用多核 CPU
- cache-loader：将结果缓存到文件系统，以加快构建速度
- happy-pack：多线程打包
- webpack-bundle-analyzer：可视化 webpack 输出文件的体积，从而找出那些大的依赖文件和模块，从而优化它们

## 构建流程

- 初始化
- 编译
- 输出

## 面试

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

## 构建优化

- 包的大小优化
  - 按需加载（异步组件）， 减少首次加载页面的资源体积
  - 配合缓存， 把不怎么变动的包打包到一起(vendor.js),公共资源单独打包
  - 减少 commonjs, 尽量使用 esm 的库，tree shaking
  - externals: 把一些包放到 cdn 上， 不打包到 bundle 中, 通过外部导入的形式使用第三方资源
- 打包速度优化
  - 缓存（空间+时间的平衡） Cache dll
  - 多线程打包 (happy-pack) thread-loader
  - 云端构建缓存

## 项目具体优化

### vue-cli 项目优化

## 引用

<a href="/other/specification/pdf/webpack详解1.pdf" target="_blank"  style="display: block">webpack 详解 1</a>
<a href="/other/specification/pdf/webpack详解2.pdf" target="_blank"  style="display: block">webpack 详解 2</a>
<a href="/other/specification/pdf/webpack详解3.pdf" target="_blank"  style="display: block">webpack 详解 3</a>
<a href="/other/specification/pdf/webpack详解4.pdf" target="_blank"  style="display: block">webpack 详解 4</a>
