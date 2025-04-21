# react

<script setup>
import Image from "../components/Image/index.vue"
</script>

React 是一个声明式，高效且灵活的用于构建用户界面的 JavaScript 库。使用 React 可以将一些简短、独立的代码片段组合成复杂的 UI 界面，这些代码片段被称作“组件”
<br />
声明式编程侧重于描述结果，命令式编程则侧重于过程

ui = render (data) -> 单向数据流

:::warning

与 vue 的差异

- 相同点
  - 虚拟 dom
  - 组件化
  - 专注于视图
- 不同点
  - vue 是双向数据绑定,采用 MVVM，react 是单向数据绑定
  - vue 的组件使用的是选项式 API，react 使用的是函数式 API
  - 运行时 VS 编译时
    - VUE 重编译 v-if v-for template 按需编译， 运行时 diff
    - react 重运行时, jsx 编译成 js 运行时 diff
  - 数据是否可变
    - vue 是可变的，react 是不可变的
  - 语法不同 - vue 使用的是模板语法， - react 使用的是 JSX 语法

:::

## 基础

### 过程

jsx => babel => React.createElement => 虚拟 dom => diff => ReacDom.render => 真实 dom

### 类组件声明周期

<Image  src="/react/images/classLifeCycle.png" />

#### 初始化阶段

- constructor
- static getDerivedStateFromProps
- componentWillMount
  如果类中，已经有了 getDerivedStsteFromProps 这个生命周期，则不会执行 componentWillMount
- render
- componentDidMount

#### 更新阶段

- componentWillReceiveProps
  如果类中，已经有了 getDerivedStsteFromProps 这个生命周期，则不会执行 componentWillReceiveProps
- static getDerivedStateFromProps
- shouldComponentUpdate
- getSnapshotBeforeUpdate
  它被标记为废弃的 API 且只能在 class component 中使用, 但是如果需要去获取 DOM 更新之前的相关快照信息
- componentWillUpdate
- render
- componentDidUpdate

#### 销毁阶段

- componentWillUnmount

### 函数组件声明周期

- useState
- useEffect
- useLayoutEffect

### 受控组件与非受控组件

- 受控组件：表单数据由 React 组件管理
  - 对表单数据进行及时校验
- 非受控组件：表单数据由 DOM 元素本身管理

### props 和 state

- props: 所有 React 组件都必须像纯函数一样保护它们的 props 不被更改

- state
- `this.setState`是类组件唯一可以更改 state 的地方
- `this.setState`是可能异步的，如果需要同步获取最新的 state，可以使用`this.setState({}, () => {})`回调函数, 回调函数将在更新之后调用

:::warning
setState
v18 前

- 在组件生命周期 或者 React 合成事件中，都是异步的
- 在 setTimeout 或者原生 dom 事件中（addEventListener ），是同步的

v18 后

- 都是异步, 可以使用`flushSync`改成同步

:::

### 合成事件

- 进行浏览器兼容， 跨平台
- 避免垃圾回收，React 对事件进行封装，减少了内存开销
- 方便事件统一管理（如事件的委托）
  :::warning
  区别：
- 命名不一样，react 事件采用驼峰命名，原生事件采用小写
- 事件处理函数写法不一样
- 阻止默认行为方式不同`e.preventDefault`
  :::

### immutable 及 immer

## 引用

<a href="https://react.docschina.org/" target="_blank"  style="display: block">react 官网</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/P4osdzJsHoFXhLxB17xcJElanTP" target="_blank"  style="display: block">react 基础</a>
