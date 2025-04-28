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

## 高阶组件

组件作为参数，返回的还是组件函数

- 实现重复代码的抽离
- 条件渲染， 权限管理
- 拦截传入组件的生命周期 拦截组件渲染性能 日志打点

### HOC 的实现方式

#### 属性代理：

不能改变原有的属性

- 代理 props

```js
// 函数式组件
function withHOC(WrappedComponent) {
  const newProps = {};
  return (props) => <WrappedComponent {...props} {...newProps} />;
}

function withHOC(WrappedComponent) {
  return class extends React.Component {
    render() {
      const newProps = {};
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
```

- 抽象 state

```js
function withHOC(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { name: "HOC" };
      this.onChange = this.onChange.bind(this);
    }
    onChange() {
      this.setState({ name: "new HOC" });
    }
    render() {
      const newProps = { name: this.state.name, onChange: this.onChange };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
```

- 条件渲染

```js
function withHOC(WrappedComponent) {
  return (props) => {
    if (props.visible) {
      return <WrappedComponent {...props} />;
    }
    return null;
  };
}
```

#### 反向继承

- 生命周期

```js
const HOC = (WrappedComponent) => {
  return class extends WrappedComponent {
    render() {
      return super.render();
    }
  };
};

// 针对组件的生命周期处理-类
function HOC(WrappedComponent) {
  return class extends WrappedComponent {
    componentDidMount() {
      console.log("HOC componentDidMount");
      super.componentDidMount();
    }
    render() {
      return super.render();
    }
  };
}

// 针对组件的生命周期处理- 原型链
function HOC(WrappedComponent) {
  const didMount = WrappedComponent.prototype.componentDidMount;
  return class extends WrappedComponent {
    async componentDidMount() {
      await (didMount && didMount.call(this));
      console.log("HOC componentDidMount");
    }
    render() {
      return super.render();
    }
  };
}
```

- 操作 state

```js
// 操作state
function HOC(WrappedComponent) {
  const didMount = WrappedComponent.prototype.componentDidMount;
  return class extends WrappedComponent {
    constructor(props) {
      super(props);
      this.state = { name: "HOC" };
    }

    async componentDidMount() {
      await (didMount && didMount.call(this));
      console.log("HOC componentDidMount");
      this.setState({ name: "new HOC" });
    }
    async componentDidMount() {
      await (didMount && didMount.call(this));
      console.log("HOC componentDidMount");
    }
    render() {
      return super.render();
    }
  };
}
```

- 条件渲染

```js
const HOC = (WrappedComponent) => {
  return class extends WrappedComponent {
    render() {
      if (this.props.visible) {
        return super.render();
      }
      return null;
    }
  };
};
```

- 修改返回的 react 结构

```js
function HOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      const element = super.render();
      if (element.type === "div") {
        const newStyle = { ...element.props.style, color: "red" };
        const newElement = React.cloneElement(
          element,
          {
            children: <div>{element.props.children}</div>,
            style: newStyle,
          },
          element.props,
          element.props.children
        );
      }
      return newElement;
    }
  };
}
```

#### 使用场景

- 计算组件渲染时间

```js
function withHOC(WrappedComponent) {
 return class extends WrappedComponent {
   constructor(props) {
     super(props);
      start = 0；
      end = 0
   }

   componentWillMount() {
     super?.componentWillMount();
     strart = Date.now();
   }
   aync componentDidMount() {
     super?.componentDidMount();
     end = Date.now();
     console.log('组件渲染时间', end - start)

   }
   render() {
     return super.render();
   }


 }
}
```

:::warning

- mixins:混入一些共有的方法和数据

:::

## Hooks

- useState
- useEffect: 先 DON 更新, 再执行 useEffect 中的 cb => 闪动
- useLayoutEffect: 先执行 useLayoutEffect 中的 cb, 再 DOM 更新 => 卡顿
- useRef
  - 获取 dom 节点
  - 保存数据:
    - 变更不会触发页面渲染
    - 可以在重新渲染之间 存储信息（普通对象存储的值每次渲染都会重置）。
- useContext
- useReducer
- useMemo: 缓存结果
- useCallback: 缓存函数
- 自定义 Hooks

```jsx
import { useEffect } from "react";

function useCustom() {
  useEffect(() => {
    console.log("useCustom");
  }, []);
}

function App() {
  useCustom();
  return <div>App</div>;
}

export default App;
```

```jsx
// 自定义更新
import { useState } from "react";

function useUpdate() {
  const [, forceUpdate] = useState(0);
  return () => forceUpdate((n) => n + 1);
}

function App() {
  const update = useUpdate();
  return <div onClick={update}>App</div>;
}
```

## 源码解析

### 理念

- 单项数据流 ui = render(data)
- 快速响应
- 异步非阻塞 用户优先级渲染

### react15

- reconiler: 协调器 diff 找到谁发生变化
  - update
  - component render jsx => virtual dom
  - Vnode 跟上次的 vdom diff
  - 找到变化的部分
  - 通知 renderer 渲染
- renderer: 渲染器 将变化的组件渲染到视图中
  - ReactDom 跨平台框架
  - ReactNative

同步更新， 递归更新子组件， 不可中断， 用户体验差

### react16

在以上的基础上增加了 scheduler， 实现了异步可切片， 所谓的异步指的任务， 是打标的过程是可中断的

- reconiler 会根据 scheduler 下发的任务， reconiler 会针对 Vdom 打标，所有的打标都完成后， 才给到 renderer 执行渲染
- scheduler: 调度器,调度优先级 , 发生数据变化后，通知 reconiler
  - requestIdleCallback 很多浏览器兼容性不好，react 自己实现了一个这样的功能
- renderer： 是同步的

### Fiber

React 内部实现的一套数据结构，支持状态更新， 支持优先级调度，支持中断与恢复， 支持并发执行。

- 架构
  - React 15 的 Reconciler 采用递归遍历的方式执行， 当组件层级很深时，递归更新时间超过了 16ms，就会出现卡顿， 为了解决这个问题，
  - React 16 将递归的无法拆分的任务进行拆分， 拆分成一个个小任务， 小任务执行时间不会超过 16ms， 这样就不会出现卡顿现象。
- 数据结构
  - Fiber 是一个数据结构， 每个 fiber 节点对应一个组件， 通过链表的形式， 将所有 fiber 节点连接起来， 形成一个 fiber 树， fiber 树的结构和 virtual dom 树的结构是一致的。
- 工作单元
  - 在当前更新过程中，当前节点发生什么变化， 打标

## 引用

<a href="https://react.docschina.org/" target="_blank"  style="display: block">react 官网</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/P4osdzJsHoFXhLxB17xcJElanTP" target="_blank"  style="display: block">react 基础</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/KiLQdRbFCoFpOLxuv2Acc2FpnFe" target="_blank"  style="display: block">react 源码 上</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/TWPadLxd0odw1HxsP5UcJW26nlc" target="_blank"  style="display: block">react 源码 下</a>
<a href="https://react.iamkasong.com/me.html" target="_blank"  style="display: block">react 技术揭秘</a>
<a href="https://y03l2iufsbl.feishu.cn/docx/AsKMdzcoNojUA2xAh9cc1fzknJh" target="_blank"  style="display: block">状态管理和 CRA</a>
