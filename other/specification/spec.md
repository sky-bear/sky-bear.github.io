# 前端工程化

## 介绍

- 模块化
- 组件化
- 规范化
- 自动化 CI CD 
- 最佳实践 : 基于行业内最佳实践, 开箱即用的框架 dva umi
- 好, 快 , 稳 依赖vite esm 等能力
前端工程化是为了让前端开发更现代化、更高效率、更规范化、更可维护.尽可能通过更多的规范 约束开发人员的研发流程 脚手架

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
  - ide 配置规范  vs code 
  - 开发 打包流程
  - 本地mock服务
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

