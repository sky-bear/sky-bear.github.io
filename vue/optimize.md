# 性能优化

## vue-tools

主要用来分析项目中是否有频繁的 rerender，从而优化性能

- 禁止重写整个数组数据， 这样会导致整个与数据相关的组件全部重新渲染
  数据定义在父组件中，再怎么优化， 父组件和操作的子组件都会更新， 如果做到只更新子组件，父组件不发生更新呢？

  store compositon API， 面向切面编程

  :::warning
  新时代不要把状态提升到父组件， 使用 pinia 或者 自定义 hooks，在组件内部直接消费， 避免数据传递， 这样更新状态的时候， 只会更新子组件， 父组件不会更新。

  这样可以极大程度保证组件的颗粒度够细， 不受外部组件影响（说白了就是改动的时候， 不会碰到别人的代码）
  :::

```js
function updateBlock(id: string, newBlock: BlockInfo) {
  // blocks.value = blocks.value.map((block) => {
  //   if (block.id === id) {
  //     return newBlock
  //   }
  //   return block
  // })
  for (const block of blocks.value) {
    if (block.id === id) {
      Object.assign(block, newBlock);
      break;
    }
  }
}
```

## 打包构建优化

- vite - vite.config.ts - Rollup- output- manualChunks(旧的) ， 新版要用 optimizeDeps
- 组件异步加载

## vue 常见分析思路

- 虚拟列表
- 异步组件结合
- 减少 rerender 分析 props state
- 使用 provide inject
- 合理使用 KeepAlive
- 事件清除
- 计时器清除
- 官方推荐

### vue devtools 进行分析

### google performance 分析

查看渲染有问题的地方

### LightHouse 分析

评分最好都是绿色

分析包的体积

- 分包 chunk
- asyncComponent 异步导入 动态加载
- ssr

### 官方推荐

- 页面加载优化： 选择合适的架构 SPA SSR
- 包体积 与 tree-shaking(esm)
- 代码分割
  - 动态导入自动代码分割
  - 异步组件
  - 路由懒加载
- 更新优化
  - Props 稳定性
  - v-once
  - v-memo
- 虚拟列表
  - 减少大型不可变数据的响应性开销 vue2 Object.freeze vue3 shallowRef shallowReactive

## 资料引用

<a href="https://y03l2iufsbl.feishu.cn/docx/RQsedpiTnoN9DcxE8UscwJw7nqd" target="_blank"  style="display: block">vue 性能优化</a>
