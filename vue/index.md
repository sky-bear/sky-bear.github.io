# vue

## 理论-数据驱动视图

### MVVM

- M: Model 数据模型
- V: View 视图
- VM: ViewModel 视图模型
  为视图层(View)量身定做一套视图模型(ViewModel),并在视图模型(VieewModel)中创建属性和方法,为视图层(View)绑定数据(Model)并实现交互。
  <br />
  视图发生变化 =>viewModel 监听到变化 => 更新数据
  <br />
  数据发生变化 => viewMode 监听到变化 => 更新视图

### 双向绑定的实现

双向绑定 是其核心特性之一，主要用于实现视图（DOM）和数据模型之间的同步。

- 利用花括`{{}}`构造了数据与 VM 的绑定关系
- 通过 v-model 指令实现了双向绑定，使得开发者可以轻松地在表单输入元素（如 `<input>`、`<textarea>` 和 `<select>` 等）中实现数据的双向绑定

核心原理：

- 数据劫持
  - Vue 使用 Object.defineProperty() 方法对数据对象的每个属性进行劫持，监听其变化。
  - 当数据发生变化时，会自动触发视图更新。
- 事件监听
  - 在模板中，v-model 会为表单元素绑定一个 input 事件监听器（或 change 事件，取决于具体元素）。
  - 当用户输入内容时，事件监听器会将新的值同步回数据模型

**v-model 的工作原理**：
v-model 是语法糖，本质上是以下两部分的组合：

- 数据绑定：通过 :value 绑定数据到表单元素。
- 事件监听：通过 @input 监听用户的输入事件，并更新数据

::: warning
面试题： 请简单说出 vue 的基本原理
这个问题实际上就是【双向绑定的实现+ 响应式原理+ diff】的大致汇总

complier | defineReactive | tick(任务)

- 双向绑定：参考上方
- 响应式原理：
  - 数据劫持
  - 依赖收集
  - 下发通知
- diff：
  - vue2: 双端 diff
  - vue3: 靶向更新+ 最长递增子序列（快速 diff）

tick: render => vnue => dom

:::

## vue 特征

### 特征一：模板化

将 html、css、js 写在一个模板文件中
<br/>
挑战： => 动态化节点 - 条件判断 | 组件化 | 动态组件 | 结构体

:::tip
react 是函数化， 将所有逻辑都放到函数中处理
:::

#### 插槽 slot: 以对比的形式存在

组件外部决定渲染内容和结构， 组件内部决定放置位置

#### 默认插槽的实现方式

父组件传递内容和结构， 子组件将 slot 替换成父组件传递的内容， 而且默认插槽会以聚合的形式传递到子组件中， 以`slot.default`的形式存在， 全部渲染出来

#### watch | computed

- 使用上：
  - watch 注重流程
  - computed 注重结果
- 原理上：
  - watch 对劫持的数据进行观察，处罚相应的回调
  - computed 是计算属性，收集依赖， 当依赖的数据发生变化时， 执行回调函数， 并且会将结果缓存起来， 如果依赖的数据没有发生变化， 则直接返回缓存的结果
- 方法上
  - watch：主动的行为： once | deep | immediate
  - computed：被动的行为： 缓存

### 特征二：组件化

组件化是 Vue 的核心特性之一，它允许开发者将 UI 拆分为独立的、可复用的组件，从而提高代码的可维护性和可扩展性。

#### 组件化

组件就是一个抽象复用的单元

- 组件化：将 UI 拆分为独立的、可复用的组件
- 组件通信：组件之间的数据传递和事件触发

### 特征化 - 插件

## vue2 和 vue3 的区别

### 响应式原理

数据劫持<br />
依赖收集<br />
下发通知<br />

- vue2: Object.defineProperty

- vue3: Proxy

### 应用实例

- vue3: 支持多应用实例，而且每个应用都拥有自己的用于配置和全局资源的作用域

  ```js
  const app1 = createApp({
    /* ... */
  });
  app1.mount("#container-1");

  const app2 = createApp({
    /* ... */
  });
  app2.mount("#container-2");
  ```

- vue2: 只能有一个全局实例
  ```js
  var app = new Vue({
    el: "#app",
    data: {
      message: "Hello Vue!",
    },
  });
  ```

### diff 算法不同

#### vue2 采用的是双端 diff

#### vue3 采用的是靶向更新+ 最长递增子序列（快速 diff）

### 设计理念

- vue2
  - 对 TS 支持不友好， 所有的属性都在 this 上， 难以推到数据类型
  - 全局 API 都在 Vue 对象上，无法实现 tree-shaking
  - 跨平台不太友好， 无法自定义渲染器
- Vue3
  - 耦合度低， 模块化， 每个模块都可以单独使用
  - 可以实现自定义渲染器
  - 框架更小，更衣扩展
  - 使用 monorepo 管理项目， 实现模块拆分
  ```md
  paclages
  。reactivity: 响应式系统
  。runtime-core:与平台无关的运行时核心
  。runtime-dom: 针对浏览器的运行时，包括 DOM API，属性。事件处理
  。runtime-test: 测试文件
  。server-renderer:服务端渲染
  。compiler-core:与平台无关的编译器核心
  。compiler-dom: 针对浏览器的编译模块
  。compiler-ssr: 服务端渲染
  ```

参看资料引用 vue3 核心模块源码解析

## 资料引用

<a href="https://y03l2iufsbl.feishu.cn/drive/folder/TdMXfDI62lHFNgd9qFBcf6LQnHf" target="_blank"  style="display: block">Vue 进阶</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/JVIFd1cOgoqzoNxohvqcUZX5nTb" target="_blank"  style="display: block">vue</a>

<a href="/vue/vue3/pdf/Vue3 核心模块源码解析.pdf" target="_blank"  style="display: block">Vue3 核心模块源码解析</a>
