# vue2

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## 源码解析

### vue 目录结构（2.6）

```js
src
├── compiler        # 编译相关
├── core            # 核心代码
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```

- compiler
  包含 Vue.js 所有编译相关的代码。它包括把模板解析成 ast 语法树，ast 语法树优化，代码生成等功能。
  编译的工作可以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

- core
  包含了 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等等。
  这里的代码可谓是 Vue.js 的灵魂，也是我们之后需要重点分析的地方。

- platform
  Vue.js 是一个跨平台的 类 MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。

- server
  Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。
  这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。
  服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

- sfc
  通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过 .vue 单文件来编写组件。
  这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。

- shared
  Vue.js 会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享的。

### Runtime Only VS Runtime + Compiler

通常我们利用 vue-cli 去初始化我们的 Vue.js 项目的时候会询问我们用 Runtime Only 版本的还是 Runtime + Compiler 版本。下面我们来对比这两个版本。

- Runtime Only
  我们在使用 Runtime Only 版本的 Vue.js 的时候，通常需要借助如 webpack 的 vue-loader 工具把 .vue 文件编译成 JavaScript，因为是在编译阶段做的，所以它只包含运行时的 Vue.js 代码，因此代码体积也会更轻量；
- Runtime + Compiler
  我们如果没有对代码做预编译，但又使用了 Vue 的 template 属性并传入一个字符串，则需要在客户端编译模板，如下所示：

```js
// 需要编译器的版本
new Vue({
  template: "<div>{{ hi }}</div>",
});

// 这种情况不需要
new Vue({
  render(h) {
    return h("div", this.hi);
  },
});
```

因为是在客户端编译的，所以模板字符串需要预先被编译成 render 函数，这样才可以进行渲染，因此使用 Runtime + Compiler 的版本的时候，代码的体积会更大一些。
在 Vue.js 2.0 中，最终渲染都是通过 render 函数，如果写 template 属性，则需要编译成 render 函数，那么这个编译过程会发生运行时，所以需要带有编译器的版本。
很显然，这个编译过程对性能会有一定损耗，所以通常我们更推荐使用 Runtime-Only 的 Vue.js。

### Vue 入口

真正初始化 Vue 的地方，在`src/core/index.js`

```js
import Vue from "./instance/index";
import { initGlobalAPI } from "./global-api/index";
import { isServerRendering } from "core/util/env";
import { FunctionalRenderContext } from "core/vdom/create-functional-component";

// 添加一些全局 API
initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, "$isServer", {
  get: isServerRendering,
});

Object.defineProperty(Vue.prototype, "$ssrContext", {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  },
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, "FunctionalRenderContext", {
  value: FunctionalRenderContext,
});

Vue.version = "__VERSION__";

export default Vue;
```

#### vue 定义文件

`src/core/instance/index.js`

```js
import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}
// 混入
initMixin(Vue);
// 数据初始化
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
```

::: warning
为何 Vue 不用 ES6 的 Class 去实现呢？
<br/>
我们往后看这里有很多 xxxMixin 的函数调用，并把 Vue 当参数传入，它们的功能都是给 Vue 的 prototype 上扩展一些方法，Vue 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里实现所有，这种方式是用 Class 难以实现的。这么做的好处是非常方便代码的维护和管理. 说白了就是原型继承方便进行对象实例的属性和方法共享， 更容易扩展

:::

#### initGlobalAPI

这里主要是在 vue 函数上添加一些全局的 api 和方法， 例如 vue-router 中用的`defineReactive`

```js
/* @flow */

import config from "../config";
import { initUse } from "./use";
import { initMixin } from "./mixin";
import { initExtend } from "./extend";
import { initAssetRegisters } from "./assets";
import { set, del } from "../observer/index";
import { ASSET_TYPES } from "shared/constants";
import builtInComponents from "../components/index";
import { observe } from "core/observer/index";

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive,
} from "../util/index";

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  configDef.get = () => config;
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      );
    };
  }
  Object.defineProperty(Vue, "config", configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  // Vue.observable = <T>(obj: T): T => {
  //   observe(obj)
  //   return obj
  // }

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}
```

##### Vue.set

```md
export function set (target: Array<any> | Object, key: any, val: any): any {
if (process.env.NODE_ENV !== 'production' &&
(isUndef(target) || isPrimitive(target))
) {
warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
}
if (Array.isArray(target) && isValidArrayIndex(key)) {
target.length = Math.max(target.length, key)
target.splice(key, 1, val)
return val
}
if (key in target && !(key in Object.prototype)) {
target[key] = val
return val
}
const ob = (target: any).**ob**
if (target.\_isVue || (ob && ob.vmCount)) {
process.env.NODE_ENV !== 'production' && warn(
'Avoid adding reactive properties to a Vue instance or its root $data ' +
'at runtime - declare it upfront in the data option.'
)
return val
}
if (!ob) {
target[key] = val
return val
}
defineReactive(ob.value, key, val)
ob.dep.notify()
return val
}
```

- 如果是数组， 直接 splice 方法修改。 splice 方法已经是重写过的
- 如果是对象
  - 如果 key 在对象上， 直接赋值
  - 如果当前对象不是响应式直接赋值
  - 否则调用 defineReactive 方法， 修改值， 并通知依赖更新

##### Vue.nextTick

```js
const callbacks = [];
let pending = false;

// 执行队列
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

let timerFunc;
// 如果promise存在， 使用promise
if (typeof Promise !== "undefined") {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== "undefined" &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === "[object MutationObserverConstructor]")
) {
  // MutationObserver在ie11中不可用
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

// 将回调函数推入队列
export function nextTick(cb, ctx) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```

vue 是异步更新的， 它自己的更新也是放到了异步队列里面更新， 使用 nextTick 本事就是在当前的异步队列里面再添加一个异步任务，当其执行时， dom 更新已经完成， 所以 nextTick 的回调函数可以获取到最新的 dom 更新结果
::: danger
这里有一个问题， dom 更新后，界面并不一定渲染， 但是此时可以读取
:::

- 优先使用 promise
- 使用 MutationObserver： 监听当前 dom 的(characterData)所有字符变化
- 使用 setImmediate
- 使用 setTimeout

##### Vue.use

插件函数

```js
export function initUse(Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    const args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === "function") {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === "function") {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  };
}
```

如果插件已经挂载，则直接返回， 否则调用插件函数，调用的时候将插件 install 的 this 指向插件本身， 将 vue 实例作为参数传入， 然后添加到已挂载插件列表中

##### Vue.component Vue.directive Vue.filter

initAssetRegisters 方法，主要是初始化这几个方法`component`,`directive`, `filter`

### 数据驱动

#### new Vue

```js
function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}
```

`new vue` 实际上执行了`this._init(options)`,`_init`的这个方法是在`initMixin`中添加的

```js
export function initMixin(Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this;
    // a uid
    vm._uid = uid++;

    let startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`;
      endTag = `vue-perf-end:${vm._uid}`;
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, "beforeCreate");
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, "created");

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(`vue ${vm._name} init`, startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
```

Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher 等

- initLifecycle 初始化声明周期
- initEvents 初始化事件
- initRender 初始化渲染
- callHook 调用 beforeCreate 钩子
- initInjections 初始化 inject
- initState 初始化 data、props、computed、watcher 等
- initProvide 初始化 provide
- callHook 调用 created 钩子
- 如果有 el 属性，则调用`$mount`方法挂载

#### vue 实例挂载的实现

我们直接看有 compiler 的定义. `platforms`文件夹下的`entry-runtime-with-compiler`

```js
const idToTemplate = cached((id) => {
  const el = query(id);
  return el && el.innerHTML;
});

const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  return mount.call(this, el, hydrating);
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    const container = document.createElement("div");
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

Vue.compile = compileToFunctions;
```

这段代码首先缓存了原型上的 $mount 方法，再重新定义该方法

1. 它对 el 做了限制，Vue 不能挂载在 body、html 这样的根节点上；
2. 如果没有定义 render 方法，则会把 el 或者 template 字符串转换成 render 方法。在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 render 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换成 render 方法；
3. 根据生成的 template 函数，会执行在线编译的过程，是调用 compileToFunctions 方法实现的，

这里真正执行的是`mount.call(this, el, hydrating)`，即调用原型上的 $mount 方法，而原型上的 $mount 方法实际是调用 `platforms/web/runtime/index.js` 中的 $mount 方法，代码如下：

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};
```

这里主要就是执行的`mountComponent`

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
  }
  callHook(vm, "beforeMount");

  let updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name;
      const id = vm._uid;
      const startTag = `vue-perf-start:${id}`;
      const endTag = `vue-perf-end:${id}`;

      mark(startTag);
      const vnode = vm._render();
      mark(endTag);
      measure(`vue ${name} render`, startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(`vue ${name} patch`, startTag, endTag);
    };
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, "mounted");
  }
  return vm;
}
```

其中 updateComponent 根据环境会进行更新时间监控, 下面这个 watcher 就是渲染 watcher， 页面中使用的双向绑定的数据发生变化时， 执行就是它

```js
new Watcher(
  vm,
  updateComponent,
  noop,
  {
    before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, "beforeUpdate");
      }
    },
  },
  true /* isRenderWatcher */
);
```

整个过程先执行

- beforeMount
- 创建 updateComponent
- 创建渲染 watcher,并执行 updateComponent
  - 此时如果是子组件， 也会按照当前逻辑执行， 所有生命周期
    - beforeCreate
    - created
    - beforeMount
    - mounted
- mounted
- 更新时执行 beforeUpdate
  - 此时如果是子组件
    - beforeUpdate
    - updated
- updated

这里说明下， 创建的渲染 Watcher， 会被添加到当前组件的 watchers 中， 当数据发生变化时， 会执行 watcher 的 update 方法，执行 queueWatcher，将整个 watcher 添加到队列，然后将执行当前队列的函数`flushSchedulerQueue`使用 nextTick 添加到异步队列中。当执行`flushSchedulerQueue`时， 先执行` watcher.before()`【加入队列的是 watcher】， 然后执行` watcher.run()`, ` watcher.run()`中调
用` watcher.get()`, 在`get`方法中执行传入的 updateComponent， 也就是重新渲染， 也就是执行 render 函数， 生成新的 vnode， 然后执行 patch 方法， 生成新的 dom， 替换旧的 dom
<br />
Watcher 在这里起到两个作用：（后面会详细讲解）

1. 初始化的时候会执行回调函数；
2. 当 vm 实例中的监测的数据发生变化的时候执行回调函数；

#### render

Vue 的 \_render 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。它的定义在 `src/core/instance/render.js` 文件中：
在`src/core/instance/init.js`中，执行`renderMixin`，注入到到`Vue.prototype`上

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this;
  const { render, _parentVnode } = vm.$options;

  // reset _rendered flag on slots for duplicate slot check
  if (process.env.NODE_ENV !== "production") {
    for (const key in vm.$slots) {
      // $flow-disable-line
      vm.$slots[key]._rendered = false;
    }
  }

  if (_parentVnode) {
    vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
  }

  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode;
  // render self
  let vnode;
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement);
  } catch (e) {
    handleError(e, vm, `render`);
    // return error render result,
    // or previous vnode to prevent render error causing blank component
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      if (vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(
            vm._renderProxy,
            vm.$createElement,
            e
          );
        } catch (e) {
          handleError(e, vm, `renderError`);
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } else {
      vnode = vm._vnode;
    }
  }
  // return empty vnode in case the render function errored out
  if (!(vnode instanceof VNode)) {
    if (process.env.NODE_ENV !== "production" && Array.isArray(vnode)) {
      warn(
        "Multiple root nodes returned from render function. Render function " +
          "should return a single root node.",
        vm
      );
    }
    vnode = createEmptyVNode();
  }
  // set parent
  vnode.parent = _parentVnode;
  return vnode;
};
```

最关键的是 render 方法的调用，在之前的 mounted 方法的实现中，会把 template 编译成 render 方法

```js
vnode = render.call(vm._renderProxy, vm.$createElement);
```

render 函数中的 createElement 方法就是 vm.$createElement 方法，其中vm.$createElement 的方法是在 initRender 中定义的，其中 vm.$createElement调用了createElement，另一个方法也调用了，这个方法是被模板编译成的 render 函数使用，而 vm.$createElement 是用户手写 render 方法使用的， 这俩个方法支持的参数相同，并且内部都调用了 createElement 方法

```js
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
```

此方法，也是 Vue 中提到的 render 的第一个参数 createElement

```js
render: function (createElement) {
  return createElement('div', {
     attrs: {
        id: 'app'
      },
  }, this.message)
}
```

##### VDOM

Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点

#### update

挂载时， 当前组件的 watchers 中已经添加了渲染 watcher,当响应式数据发生变化后， 触发`updateComponent`执行， 也就是执行`vm._update`

```js
let updateComponent;
/* istanbul ignore if */
if (process.env.NODE_ENV !== "production" && config.performance && mark) {
  updateComponent = () => {
    const name = vm._name;
    const id = vm._uid;
    const startTag = `vue-perf-start:${id}`;
    const endTag = `vue-perf-end:${id}`;

    mark(startTag);
    const vnode = vm._render();
    mark(endTag);
    measure(`vue ${name} render`, startTag, endTag);

    mark(startTag);
    vm._update(vnode, hydrating);
    mark(endTag);
    measure(`vue ${name} patch`, startTag, endTag);
  };
} else {
  updateComponent = () => {
    vm._update(vm._render(), hydrating);
  };
}

// we set this to vm._watcher inside the watcher's constructor
// since the watcher's initial patch may call $forceUpdate (e.g. inside child
// component's mounted hook), which relies on vm._watcher being already defined
new Watcher(
  vm,
  updateComponent,
  noop,
  {
    before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, "beforeUpdate");
      }
    },
  },
  true /* isRenderWatcher */
);
```

vm.\_update

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this;
  const prevEl = vm.$el;
  const prevVnode = vm._vnode;
  const restoreActiveInstance = setActiveInstance(vm);
  vm._vnode = vnode;
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
  restoreActiveInstance();
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null;
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm;
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el;
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
};
```

\_update 的核心就是调用 `vm.__patch__` 方法.这个方法实际上在不同的平台，比如 web 和 weex 上的定义是不一样的，因此在 web 平台中它的定义在 `src/platforms/web/runtime/index.js` 中

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop;
```

在 web 平台上，是否是服务端渲染也会对这个方法产生影响。因为在服务端渲染中，没有真实的浏览器 DOM 环境，所以不需要把 VNode 最终转换成 DOM，因此是一个空函数，而在浏览器端渲染中，它指向了 patch 方法，它的定义在 `src/platforms/web/runtime/patch.js`中：

```js
import * as nodeOps from "web/runtime/node-ops";
import { createPatchFunction } from "core/vdom/patch";
import baseModules from "core/vdom/modules/index";
import platformModules from "web/runtime/modules/index";

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules);

export const patch: Function = createPatchFunction({ nodeOps, modules });
```

该方法的定义是调用 `createPatchFunction` 方法的返回值，这里传入了一个对象，包含 nodeOps 参数和 modules 参数。其中，nodeOps 封装了一系列 DOM 操作的方法，modules 定义了一些模块的钩子函数的实现，我们这里先不详细介绍，来看一下 `createPatchFunction` 的实现，它定义在 `src/core/vdom/patch.js` 中

```js
const hooks = ["create", "activate", "update", "remove", "destroy"];

export function createPatchFunction(backend) {
  let i, j;
  const cbs = {};

  const { modules, nodeOps } = backend;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  // ...

  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
      return;
    }

    let isInitialPatch = false;
    const insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      const isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode;
            } else if (process.env.NODE_ENV !== "production") {
              warn(
                "The client-side rendered virtual DOM tree is not matching " +
                  "server-rendered content. This is likely caused by incorrect " +
                  "HTML markup, for example nesting block-level elements inside " +
                  "<p>, or missing <tbody>. Bailing hydration and performing " +
                  "full client-side render."
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        const oldElm = oldVnode.elm;
        const parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent;
          const patchable = isPatchable(vnode);
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
  };
}
```

`createPatchFunction` 内部定义了一系列的辅助方法，最终返回了一个 patch 方法，这个方法就赋值给了 `vm._update` 函数里调用的` vm.__patch__`。

::: warning
Q：为何 Vue.js 源码绕了这么一大圈，把相关代码分散到各个目录？
A：

1. 因为 patch 是平台相关的，在 Web 和 Weex 环境，它们把虚拟 DOM 映射到 “平台 DOM” 的方法是不同的，并且对 “DOM” 包括的属性模块创建和更新也不尽相同。因此每个平台都有各自的 nodeOps 和 modules，它们的代码需要托管在 src/platforms 这个大目录下；
2. 不同平台的 patch 的主要逻辑部分是相同的，所以这部分公共的部分托管在 core 这个大目录下。差异化部分只需要通过参数 nodeOps 和 modules 来区分：
3. nodeOps 表示对 “平台 DOM” 的一些操作方法；
4. modules 表示平台的一些模块，它们会在整个 patch 过程的不同阶段执行相应的钩子函数；
   :::

回到 patch 方法本身，它接收 4 个参数：

1. oldVnode 表示旧的 VNode 节点，它也可以不存在或者是一个 DOM 对象；
2. vnode 表示执行 \_render 后返回的 VNode 的节点；
3. hydrating 表示是否是服务端渲染；
4. removeOnly 是给 transition-group 用的；

先来回顾我们的例子

```js
var app = new Vue({
  el: "#app",
  render: function (createElement) {
    return createElement(
      "div",
      {
        attrs: {
          id: "app",
        },
      },
      this.message
    );
  },
  data: {
    message: "Hello Vue!",
  },
});
```

在 vm.\_update 的方法里是这么调用 patch 方法的：

```js
// initial render
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
```

## vue2 diff

### Diff 算法的目的

diff 算法的目的是为了找到哪些节点发生了变化，哪些节点没有发生变化可以复用。如果用最传统的 diff 算法，如下图所示，每个节点都要遍历另一棵树上的所有节点做比较，这就是 o(n^2)的复杂度，加上更新节点时的 o(n)复杂度，那就总共达到了 o(n^3)的复杂度，这对于一个结构复杂节点数众多的页面，成本是非常大的。

<Image  src="./images/diff.png" />

实际上 vue 和 react 都对虚拟 dom 的 diff 算法做了一定的优化，将复杂度降低到了 o(n)级别，具体的策略是：同层的节点才相互比较；

1. 节点比较时，如果类型不同，则对该节点及其所有子节点直接销毁新建；
2. 类型相同的子节点，使用 key 帮助查找，并且使用算法优化查找效率。其中 react 和 vue2 以及 vue3 的 diff 算法都不尽相同；
   <Image  src="./images/diff1.png" />

### 双端比较

双端比较就是新列表和旧列表两个列表的头与尾互相对比，，在对比的过程中指针会逐渐向内靠拢，直到某一个列表的节点全部遍历过，对比停止；

### patch

先判断是否是首次渲染，如果是首次渲染那么我们就直接 createElm 即可；如果不是就去判断新老两个节点的元素类型否一样；如果两个节点都是一样的，那么就深入检查他们的子节点。如果两个节点不一样那就说明 Vnode 完全被改变了，就可以直接替换 oldVnode；

先判断是否是首次渲染，如果是首次渲染那么我们就直接 createElm 即可；如果不是就去判断新老两个节点的元素类型否一样；如果两个节点都是一样的，那么就深入检查他们的子节点。如果两个节点不一样那就说明 Vnode 完全被改变了，就可以直接替换 oldVnode；

```js
function patch(oldVnode, vnode, hydrating, removeOnly) {
  // 判断新的vnode是否为空
  if (isUndef(vnode)) {
    // 如果老的vnode不为空 卸载所有的老vnode
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
    return;
  }
  let isInitialPatch = false;
  // 用来存储 insert钩子函数，在插入节点之前调用
  const insertedVnodeQueue = [];
  // 如果老节点不存在，直接创建新节点
  if (isUndef(oldVnode)) {
    isInitialPatch = true;
    createElm(vnode, insertedVnodeQueue);
  } else {
    // 是不是元素节点
    const isRealElement = isDef(oldVnode.nodeType);
    // 当老节点不是真实的DOM节点，并且新老节点的type和key相同，进行patchVnode更新工作
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
    } else {
      // 如果不是同一元素节点的话
      // 当老节点是真实DOM节点的时候
      if (isRealElement) {
        // 如果是元素节点 并且在SSR环境的时候 修改SSR_ATTR属性
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          // 就是服务端渲染的，删掉这个属性
          oldVnode.removeAttribute(SSR_ATTR);
          hydrating = true;
        }
        // 这个判断里是服务端渲染的处理逻辑
        if (isTrue(hydrating)) {
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
            invokeInsertHook(vnode, insertedVnodeQueue, true);
            return oldVnode;
          }
        }
        // 如果不是服务端渲染的，或者混合失败，就创建一个空的注释节点替换 oldVnode
        oldVnode = emptyNodeAt(oldVnode);
      }

      // 拿到 oldVnode 的父节点
      const oldElm = oldVnode.elm;
      const parentElm = nodeOps.parentNode(oldElm);

      // 根据新的 vnode 创建一个 DOM 节点，挂载到父节点上
      createElm(
        vnode,
        insertedVnodeQueue,
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      );
      // 如果新的 vnode 的根节点存在，就是说根节点被修改了，就需要遍历更新父节点
      // 递归 更新父占位符元素
      // 就是执行一遍 父节点的 destory 和 create 、insert 的 钩子函数
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent;
        const patchable = isPatchable(vnode);
        // 更新父组件的占位元素
        while (ancestor) {
          // 卸载老根节点下的全部组件
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor);
          }
          // 替换现有元素
          ancestor.elm = vnode.elm;
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor);
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            const insert = ancestor.data.hook.insert;
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]();
              }
            }
          } else {
            registerRef(ancestor);
          }
          // 更新父节点
          ancestor = ancestor.parent;
        }
      }
      // 如果旧节点还存在，就删掉旧节点
      if (isDef(parentElm)) {
        removeVnodes([oldVnode], 0, 0);
      } else if (isDef(oldVnode.tag)) {
        // 否则直接卸载 oldVnode
        invokeDestroyHook(oldVnode);
      }
    }
  }
  // 执行 虚拟 dom 的 insert 钩子函数
  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
  // 返回最新 vnode 的 elm ，也就是真实的 dom节点
  return vnode.elm;
}
```

## 常用方法实现

## 资料引用

<a href="https://y03l2iufsbl.feishu.cn/docx/E6J2dV7aLogtQ4xq2Fvc1yCFnjf" target="_blank"  style="display: block">vue</a>
