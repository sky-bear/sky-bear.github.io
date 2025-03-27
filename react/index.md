# react

## 基础

### 类组件声明周期

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







## 引用

<a href="https://react.docschina.org/" target="_blank"  style="display: block">react 官网</a>
