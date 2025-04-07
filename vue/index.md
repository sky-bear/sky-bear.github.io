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

### vue2 采用的是双端 diff

### vue3 采用的是靶向更新+ 最长递增子序列（快速 diff）

参看资料引用 vue3 核心模块源码解析

## 资料引用

<a href="https://y03l2iufsbl.feishu.cn/drive/folder/TdMXfDI62lHFNgd9qFBcf6LQnHf" target="_blank"  style="display: block">Vue 进阶</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/JVIFd1cOgoqzoNxohvqcUZX5nTb" target="_blank"  style="display: block">vue</a>

<a href="/vue/vue3/pdf/Vue3 核心模块源码解析.pdf" target="_blank"  style="display: block">Vue3 核心模块源码解析</a>
