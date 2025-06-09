# 性能优化

ui = render(data)

## React 性能优化

### 不必要的组件更新

在组件状态发生变更后，通过减少不必要的组件更新来实现

- PureComponent React.memo
- shouldComponentUpdate
  不要给子组件传递大对象， 用到哪个属性传递哪个属性，否则当大对象中某个「子组件未使用的属性」发生了更新，子组件也会触发 Render 过程
- useMemo、useCallback 实现稳定的 Props 值
  如果传给子组件的派生状态或函数，每次都是新的引用，那么 PureComponent 和 React.memo 优化就会失效。所以需要使用 useMemo 和 useCallback 来生成稳定值，并结合 PureComponent 或 React.memo 避免子组件重新 Render
- 使用发布订阅者跳过中间组件 Render 过程
  只有关心该状态的组件才去订阅该状态，不再需要中间组件传递该状态， 避免中间组件不必要的 Render
- 状态下方， 缩小状态影响范围
- 列表项使用 key 属性
  优化 diff 遍历 和减少更新次数
- useMemo 返回虚拟 DOM
  利用 useMemo 可以缓存计算结果的特点，如果 useMemo 返回的是组件的虚拟 DOM，则将在 useMemo 依赖不变时，跳过组件的 Render 阶段

### 提交阶段优化

这类优化的目的是减少提交阶段耗时。

- 避免在 didMount、didUpdate 中更新组件 State
  React 工作流提交阶段的第二步就是执行提交阶段钩子，它们的执行会阻塞浏览器更新页面。如果在提交阶段钩子函数中更新组件 State，会再次触发组件的更新流程，造成两倍耗时

### 前端通用优化
- 批量更新
React 18之前的批量更新：
在 React 17及之前的版本中，批量更新仅限于事件处理函数内部。这意味着如果你在异步操作（如 setTimeout、网络请求回调等）中调用 setState()，这些调用不会被批量处理，而是立即执行。
React 18的变化：
React 18引入了自动批量更新，扩展了批量更新的应用范围。现在，不仅仅是事件处理函数内的多次 setState() 调用会被批量处理，连在异步操作中的 setState() 调用也默认会尝试进行批量处理。这意味着更多情况下 setState() 是异步的，并且多个连续的 setState() 调用可能会合并成一个重新渲染过程。

-  按优先级更新，及时响应用户

## 组件设计优化

- 懒加载
- 虚拟滚动

## 组件加载优化

### 按需加载
- babel-plugin-import 

### 分包
异步组件加载
React16.6 中，引入了 React.lazy 和 React.Suspense 两个 API，再配合动态 import() 语法就可以实现组件代码打包分割和异步加载。

## 资料引用：

<a href="https://nwy3y7fy8w5.feishu.cn/docx/MOScdYEQNojGCqxioSkciDtGn0W" target="_blank"  style="display: block">react 性能优化</a>
