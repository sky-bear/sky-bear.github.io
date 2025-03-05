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




## 资料引用

<a href="https://y03l2iufsbl.feishu.cn/drive/folder/TdMXfDI62lHFNgd9qFBcf6LQnHf" target="_blank"  style="display: block">Vue进阶</a>
<a href="https://nwy3y7fy8w5.feishu.cn/docx/JVIFd1cOgoqzoNxohvqcUZX5nTb" target="_blank"  style="display: block">vue</a>


