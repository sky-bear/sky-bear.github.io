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
  - 声明式编程范式
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
- 17 之前都放到 document 17 开始 react 树的根节点

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

- 样式增强

```js
function withBackgroundColor(WrappedComponent) {
  return class extends React.Component {
    render() {
      return (
        <div style={{ backgroundColor: "#ccc" }}>
          <WrappedComponent {...this.props} {...newProps} />
        </div>
      );
    }
  };
}
```

#### 反向继承

使用一个函数接受一个组件作为参数传入，并返回一个继承了该传入组件的类组件，且在返回组件的 render() 方法中返回 super.render() 方法， 主要针对类组件

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

#### 对比

1. 属性代理：从“组合”角度出发，有利于从外部操作 wrappedComp，可以操作 props，或者在 wrappedComp 外加一些拦截器（如条件渲染等）；
2. 反向继承：从“继承”角度出发，从内部操作 wrappedComp，可以操作组件内部的 state，生命周期和 render 等，功能能加强大；

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

- 权限控制
- 页面复用
- 主题 样式切换 国际化 等等共有的东西可以抽象到 HOC

:::warning

- mixins:混入一些共有的方法和数据

:::

## Hooks

react 16.8 后新增的功能

- useState

  :::warning
  初始化时采用惰性初始化

  ```js
  // 好的 ，这种只在初始化时执行一次
  const [state, setState] = useState(() => fn());
  // 差的， 每次都会执行
  const [state, setState] = useState(fn());
  ```

  :::

- useEffect: 先 DON 更新, 再执行 useEffect 中的 cb => 闪动
- useLayoutEffect: 先执行 useLayoutEffect 中的 cb, 再 DOM 更新 => 卡顿
- useRef
  - 获取 dom 节点
  - 保存数据:
    - 变更不会触发页面渲染
    - 可以在重新渲染之间 存储信息（普通对象存储的值每次渲染都会重置）。
- useContext
  - 如果采用 props 传递 ， 中间不需要消费的组件也会更新
- useReducer
- useMemo: 缓存结果

  - 避免重复计算
  - 避免不必要的渲染

    ```js
    // 避免props 更新重新渲染
    const ChildComponent = React.memo((props) => {
      return (
        <div>
          <p>Name:{props.value.name}</p>
          <p>Age:{props.value.age}</p>
        </div>
      );
    });

    // 避免重新创建引用
    const memoizedValue = useMemo(() => {
      return {
        name: 2,
        age: 10,
      };
    });

    return <ChildComponent value={memoizedValue} />;
    ```

- useCallback: 缓存函数， 避免重复创建函数 避免子组件不必要的渲染

  ```js
  // handleClick引用没变， MemoizedButton就不会重新渲染
  import React, { useState, useCallback } from "react";

  function Button(props) {
    const { handleClick, children } = props;
    console.log("Button -> render");
    return <button onClick={handleClick}>{children}</button>;
  }

  const MemoizedButton = React.memo(Button);

  export default function Index() {
    const [clickCount, increaseCount] = useState(0);
    // 这里使用了`useCallback`
    const handleClick = useCallback(() => {
      console.log("handleClick");
      increaseCount(clickCount + 1);
    }, []);

    return (
      <div>
        <p>{clickCount}</p>
        <MemoizedButton handleClick={handleClick}>Click</MemoizedButton>
      </div>
    );
  }
  ```

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

### Hooks VS HOC

1. Hook 最典型的就是取代掉生命周期中大多数的功能，可以把更相关的逻辑放在一起，而非零散在各个生命周期方法中；
2. 高阶组件可以将外部的属性功能到一个基础 Component 中，更多作为扩展能力的插件（如 react-swipeable-views 中的 autoPlay 高阶组件，通过注入状态化的 props 的方式对组件进行功能扩展，而不是直接将代码写在主库中）；
3. Hook 的写法可以让代码更加紧凑，更适合做 Controller 或者需要内聚的相关逻辑，一般与目标组件内强依赖，HOC 更强调对原先组件能力的扩展；
4. 目前 Hook 还处于相对早期阶段（React 16.8.0 才正式发布 Hook 稳定版本），一些第三方的库可能还暂时无法兼容 Hook；

## 异步组件

React16.6 中，引入了 React.lazy 和 React.Suspense 两个 API，再配合动态 import() 语法就可以实现组件代码打包分割和异步加载。
传统模式：渲染组件-> 请求数据 -> 再渲染组件
异步模式：请求数据-> 渲染组件

```js
// demo
import React, { lazy, Suspense } from "react";
// lazy 和 Suspense 配套使用，react原生支持代码分割
const About = lazy(() => import(/* webpackChunkName: "about" */ "./About"));
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <Suspense fallback={<div>loading</div>}>
          <About />
        </Suspense>
      </div>
    );
  }
}
export default App;
```

### 异步组件实现

Suspense 组件需要等待异步组件加载完成再渲染异步组件的内容。

1. lazy wrapper 住异步组件，React 第一次加载组件的时候，异步组件会发起请求，并且抛出异常，终止渲染；
2. Suspense 里有 componentDidCatch 生命周期函数，异步组件抛出异常会触发这个函数，然后改变状态使其渲染 fallback 参数传入的组件；
3. 异步组件的请求成功返回之后，Suspense 组件再次改变状态使其渲染正常子组件（即异步组件）；

```js
// comp About
const About = lazy(() => new Promise(resolve => {
  setTimeout(() => {
    resolve({
      default: <div>component content</div>
    })
  }, 1000)
}))

// comp Suspense
import React from 'react'
class Suspense extends React.PureComponent {
  /**
   * isRender 异步组件是否就绪，可以渲染
   /
  state = {
    isRender: true
  }
  componentDidCatch(e) {
    this.setState({ isRender: false })
    e.promise.then(() => {
      / 数据请求后，渲染真实组件 */
      this.setState({ isRender: true })
    })
  }
  render() {
    const { fallback, children } = this.props
    const { isRender } = this.state
    return isRender ? children : fallback
  }
}

export default Suspense

// comp lazy
import React, { useEffect } from 'react'
export function lazy(fn) {
  const fetcher = {
    status: 'pending',
    result: null,
    promise: null,
  }
  return function MyComponent() {
    const getDataPromise = fn()
    fetcher.promise = getDataPromise
    getDataPromise.then(res => {
      fetcher.status = 'resolved'
      fetcher.result = res.default
    })
    useEffect(() => {
      if (fetcher.status === 'pending') {
          throw fetcher
      }
    }, [])
    if (fetcher.status === 'resolved') {
      return fetcher.result
    }
    return null
  }
}

// 实现的效果与React支持内容保持一致
import React, {Suspese, lazy} from 'react'

const About= lazy(() => { import('../About') });

class App extends React.Component {
  render() {
    /**
     * 1. 使用 React.Lazy 和 import() 来引入组件
     * 2. 使用<React.Suspense></React.Suspense>来做异步组件的父组件，并使用 fallback 来实现组件未加载完成时展示信息
     * 3. fallback 可以传入html，也可以自行封装一个统一的提示组件
     */
    return (
      <div>
        <Suspense
          fallback={
            <Loading />
          }
        >
          <About />
        </Suspense>
      </div>
    )
  }
}
export default ReactComp;
```

## 源码解析

### 理念

- 单项数据流 ui = render(data)
- 快速响应
- 异步非阻塞 用户优先级渲染

### react15

- reconiler: 协调器 diff 找到谁发生变化
  - update: 触发更新
  - component render jsx => virtual dom
  - Vnode 跟上次的 vdom diff
  - 找到变化的部分， 打上标记，如果有子组件，递归上面操作
  - 通知 renderer 渲染
- renderer: 渲染器 将变化的组件渲染到视图中
  - ReactDom 跨平台框架
  - ReactNative

同步更新，其中 reconiler 和 renderer 交替执行， 递归更新子组件， 不可中断， 用户体验差。

### react16

在以上的基础上增加了 scheduler， 实现了异步可切片， 所谓的异步指的任务， 是打标的过程是可中断的

- scheduler: 调度器,调度优先级 , 发生数据变化后，通知 reconiler
  - requestIdleCallback 很多浏览器兼容性不好，react 自己实现了一个这样的功能
- reconiler 会根据 scheduler 下发的任务， reconiler 会针对 Vdom 打标，所有的打标都完成后， 才给到 renderer 执行渲染。 这里是递归可中断的

- renderer：渲染器将变化的组件渲染到页面上，拿着 reconiler 提供的标识，更新所有的，这个过程 是同步的， 不可中断

#### scheduler

### Fiber

React 内部实现的一套数据结构，支持状态更新， 支持优先级调度，支持中断与恢复， 支持并发执行。

- 架构
  - React 15 的 Reconciler 采用递归遍历的方式执行， 当组件层级很深时，递归更新时间超过了 16ms，就会出现卡顿， 为了解决这个问题，
  - React 16 将递归的无法拆分的任务进行拆分， 拆分成一个个小任务， 小任务执行时间不会超过 16ms， 这样就不会出现卡顿现象。
- 数据结构
  - Fiber 是一个数据结构， 每个 fiber 节点对应一个组件， 通过链表的形式， 将所有 fiber 节点连接起来， 形成一个 fiber 树， fiber 树的结构和 virtual dom 树的结构是一致的。
- 工作单元
  - 在当前更新过程中，当前节点发生什么变化， 打标

### diff

React 的 diff 会预设三个限制：

1. 只对同级元素进行 diff。如果一个 DOM 节点在前后两次更新中跨越了层级，那么 React 会忽略；
2. 两个不同类型的元素会产生出不同的树。如果元素由 div 变为 p，React 会销毁 div 及其子孙节点，并新建 p 及其子孙节点；
3. 开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定

## hooks

hooks 在 fiber 是链表结构，这里用数组来模拟

### 为什么不能在循环 和条件判断里使用 hooks

因为 hooks 的状态 是通过类似数组的形式维护的，也就是按照 hooks 定义的顺序维护的， 如果在 if, for 中使用 hooks， 如果顺序发生变化， 导致 hooks 的依赖项无法正确获取

### 为什么不能在函数组件中使用 hooks

因为函数组件没有自己的生命周期， 所以无法使用 hooks

### 为什么不能在函数组件中使用 hooks

### 为什么 useEffect,第二个参数为空数组时，相当于 componentDidMount

### hooks 如何解决依赖复用的问题

采用类似数组的方式处理依赖项， 例如 useState, useEffect, useReducer, useCustom 等等
每创建使用一个 hooks， 把对应的依赖项会存储在一个数组中， 当执行 useEffect 时， 会根据依赖项的索引， 找到对应的依赖项， 如果依赖项发生变化， 则会执行 useEffect 中的 cb

共用一个 memoizeState

### 模拟实现 hooks 的实现

## 引用

<a href="https://react.docschina.org/" target="_blank"  style="display: block">react 官网</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/P4osdzJsHoFXhLxB17xcJElanTP" target="_blank"  style="display: block">react 基础</a>
<a href="https://vgbixa7nr9.feishu.cn/docx/RqpmdJVSNooTrvxhHYScWWkqnUb" target="_blank"  style="display: block">react 高级用法</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/KiLQdRbFCoFpOLxuv2Acc2FpnFe" target="_blank"  style="display: block">react 源码 上</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/TWPadLxd0odw1HxsP5UcJW26nlc" target="_blank"  style="display: block">react 源码 下</a>
<a href="https://vgbixa7nr9.feishu.cn/docx/CYQHdPQ5wovCODxFHG4cxYQgnMf" target="_blank"  style="display: block">react 源码 下(zw)</a>

<a href="https://react.iamkasong.com/me.html" target="_blank"  style="display: block">react 技术揭秘</a>
<a href="https://y03l2iufsbl.feishu.cn/docx/AsKMdzcoNojUA2xAh9cc1fzknJh" target="_blank"  style="display: block">状态管理和 CRA</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/V2y4d9zEJobo7XxErDMcM436nA9" target="_blank"  style="display: block">hooks2</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/LpaZdo2q8ozsI2x09vNcyFkznrg" target="_blank"  style="display: block">hooks3</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/V7BadFHrooGtJmxdH5EcsoMznje" target="_blank"  style="display: block">hooks4</a>

<a href="https://vgbixa7nr9.feishu.cn/docx/IOmJdkSFyo8byCxnkgQcxmUWn9d" target="_blank"  style="display: block">面试题</a>
