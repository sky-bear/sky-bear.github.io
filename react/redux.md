# React 状态管理

## 状态管理意义

- 集中管理状态
- 组件解耦
- 状态共享
- 性能优化
- 异步 同步 异步

## React 状态

- useState
- useReducer 复杂本地状态的管理者
- useContext

  :::warning

  面试官会问：Context 有什么缺点，怎么改进？
  Context 因为是整个大对象，只要数据变更，以下所有内容有可能会需要 rerender。

  1. 细化 context value，拆分，PageContext、WorkSpaceContext
  2. 通过定义 xxxProvider，将数据更新局限在 children 层，不再是 PageContext.Provider，而是 PageProvider

  :::

- useReducer + useContext 针对小型应用推荐
  - useReducer 擅长管理复杂状态逻辑
  - useContext 擅长共享数据


### 总结

- 优点： react 原生 无需额外库
- 缺点
  - 不是专门状态管理库
  - 性能问题
    - context value 所有订阅 context 组件都会重新渲染 value 部分值

优化策略：

- memo()
- 拆分 context 将不同的关注点 放到不同 context 中 cartContext 缩小 context 影响的范围 userContext itemContext
- bad case PageContext value
- good case PageContext 存储数据优先 存储 变化频次不高的 user theme en zh - cartContext - itemContext
  - theme 主题切换
  - en zh 事件 更改



## Redux

特征

- 单一数据源

  - state 特定时间的状态 状态快照
  - 基于 state 渲染出 view
  - state 根据事件进行更新 new state
  - new state 重新渲染 view

- state 只读
  - 基于不可变的数据 所有状态更新都是使用不可变的方式
- 纯函数 Reducer 状态修改
  - state Action 重新计算
  - 禁止直接修改 state
  - 禁止任何异步逻辑

```js
import {createStore} from 'redux'

const initialState = {
    count:1
}

function reducer(state, action) {
    switch(action.type) {
        case '+++':
            return {...state, count: state.count + 1}
        case '---':
            return {...state, count: state.count - 1}
        default:
            return state
    }
}

const store = createStore(reducer)

// 订阅state变化 通知react view更新
store.subscribe(（） => console.log(store.getState())) // 获取当前最新的state

store.dispatch({type: '+++'})

```




## 资料引用：

<a href="https://vgbixa7nr9.feishu.cn/docx/VvfidvfKZoYnPzx6uYhcEgwpnmh" target="_blank"  style="display: block">React 状态管理</a>
