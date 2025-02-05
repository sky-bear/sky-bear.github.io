# vue2

## mixin

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

- 数据合并： 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先
- 钩子函数：将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用
- 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对

::: danger 问题

- **命名问题**： 在跨多个组件和 mixin 处理命名属性时，编写代码变得越来越困难。一旦第三方 mixin 作为带有自己命名属性的 npm 包被添加进来，就会特别困难，因为它们可能会导致冲突
- **依赖不透明**：mixin 和使用它的组件之间没有层次关系。这意味着组件可以使用 mixin 中定义的数据属性（例如 myData），但是 mixin 也可以使用假定在组件中定义的数据属性（例如 myData）。以后的某天如果想修改 mixin，包袱有点重
- **无法按需**
  :::

## 动画

动画的实现就是通过在 DOM 元素上添加/移除 CSS 类再结合 requestAnimationFrame 实现的, 通过监听 animationend 事件，在动画结束后移除类名

<a href="https://animatecss.node.org.cn/" target="_blank"  style="display: block">animatecss</a>

## 插槽

插槽的本质就是函数！

## 插件

插件可以是对象，或者是一个函数。如果是对象，那么对象中需要提供 install 函数，如果是函数，形态需要跟前面提到的 install 函数保持一致。
install 是组件安装的一个方法，跟 npm install 完全不一样，npm install 是一个命令

### 定义插件

```js
const MyPlugin = {
    install(Vue, options) {
      // 1. 添加全局方法或 property
      Vue.myGlobalMethod = function () {
        // 逻辑...
      }

      // 2. 添加全局资源
      Vue.directive('my-directive', {
        bind (el, binding, vnode, oldVnode) {
          // 逻辑...
        }
        ...
      })

      // 3. 注入组件选项
      Vue.mixin({
        created: function () {
          // 逻辑...
        }
        ...
      })

      // 4. 添加实例方法
      Vue.prototype.$myMethod = function (methodOptions) {
        // 逻辑...
      }
    }
};

```

### 插件化机制原理

```js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 获取已经安装的插件
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 看看插件是否已经安装，如果安装了直接返回
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // toArray(arguments, 1)实现的功能就是，获取Vue.use(plugin,xx,xx)中的其他参数。
    // 比如 Vue.use(plugin,{size:'mini', theme:'black'})，就会回去到plugin意外的参数
    const args = toArray(arguments, 1)
    // 在参数中第一位插入Vue，从而保证第一个参数是Vue实例
    args.unshift(this)
    // 插件要么是一个函数，要么是一个对象(对象包含install方法)
    if (typeof plugin.install === 'function') {
      // 调用插件的install方法，并传入Vue实例
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 在已经安装的插件数组中，放进去
    installedPlugins.push(plugin)
    return this
  }
}
```




## 资料引用

<a href="https://y03l2iufsbl.feishu.cn/docx/Nw95dajtyogDCcx0P9Zc4GRWn5g" target="_blank"  style="display: block">Vue2 高级用法</a>
