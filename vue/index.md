# vue

> vue2 和 vue3 的区别

## 响应式原理
- vue2: Object.defineProperty

- vue3: Proxy

## 应用实例

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


## diff 算法不同

### vue2 采用的是双端diff
### vue3 采用的是靶向更新+ 最长递增子序列（快速diff）
参看资料引用 vue3核心模块源码解析


## 资料引用

<a href="https://y03l2iufsbl.feishu.cn/drive/folder/TdMXfDI62lHFNgd9qFBcf6LQnHf" target="_blank"  style="display: block">Vue进阶</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/JVIFd1cOgoqzoNxohvqcUZX5nTb" target="_blank"  style="display: block">vue</a>

<a href="/vue/vue3/pdf/Vue3 核心模块源码解析.pdf" target="_blank"  style="display: block">Vue3 核心模块源码解析</a>




## vue 特征

### 特征一：模板化
 将html、css、js 写在一个模板文件中
 <br/>
 挑战： => 动态化节点 - 条件判断 | 组件化 | 动态组件 | 结构体


:::tip
react 是函数化， 将所有逻辑都放到函数中处理
:::

#### 插槽slot: 以对比的形式存在
组件外部决定渲染内容和结构， 组件内部决定放置位置

#### 默认插槽的实现方式
父组件传递内容和结构， 子组件将slot替换成父组件传递的内容， 而且默认插槽会以聚合的形式传递到子组件中， 以`slot.default`的形式存在， 全部渲染出来