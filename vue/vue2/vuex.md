# vuex

<script setup>
import Image from "../../components/Image/index.vue"
</script>

状态管理工具。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化

状态自管理应用包含以下几个部分：

- state，驱动应用的数据源；
- view，以声明方式将 state 映射到视图；
- actions，响应在 view 上的用户输入导致的状态变化。

<Image  src="./images/单项数据流.png" />

## 解决的问题

- 多个视图依赖同一个状态
- 来自不同视图的行为需要变更同一个状态

## 好处

- 能够在 vuex 中集中管理共享的数据，易于开发和后期维护
- 能够高效地实现组件之间的数据共享，提高开发效率
- 在 vuex 中的数据都是响应式的

## 基本使用， 直接看官网吧

## 实现

### 原理

vuex 借助的是 Vue 中的 mixin， 在 beforeCreate 钩子中获取 store 实例，添加到当前实例上，这样在组件中就可以通过 this.$store 来访问 vuex 实例了

```js
// store.js
export function install(_Vue) {
  Vue = _Vue; // 保存Vue构造函数
  applyMixin(Vue); // 本质是使用minxins混入实现的
}

// applyMixin.js
export default function applyMixin(Vue) {
  Vue.mixin({
    // store 不能放到原型上， 放到原型上， 所有的实例都会有这个属性
    // 只能从当前的根实例开始， 所有根实例在子组件才有$store方法
    beforeCreate: vuexInit,
  });
}

// 初始化Vuex
function vuexInit() {
  const options = this.$options;
  if (options.store) {
    // 根实例
    this.$store = options.store;
  } else if (options.parent && options.parent.$store) {
    // 儿子 或者孙子....
    this.$store = options.parent.$store;
  }
}
```

这样每个组件实例都可以通过 this.$store 来访问 vuex 实例了 <br />

那响应式是怎么来的呢?<br />
其实就是把数据放到 vm 实例上，这样数据变化就会触发视图更新了

```js
function resetStoreVM(store, state) {
  const computed = {}; // 定义计算属性
  store.getters = {}; // 定义store中的getters
  forEachValue(store._wrappedGetters, (fn, key) => {
    computed[key] = () => {
      return fn(store);
    };
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key], // 去计算属性中取值
    });
  });
  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed: computed,
  });
}
```

这里要注意的是， getters 中的值是计算属性， 所以 getters 中的值是响应式的， 但是 getters 中的值是函数， 所以 getters 中的值不能直接修改， 只能通过修改 state 中的值来触发 getters 中的值的变化

::: warning
当数据放到 vm 实例上时，进行双向绑定， 此时模板中使用到的地方， 会被收集到当前数据的 effect 中，此时收集的是组件的渲染 watcher, 当数据变更时， 会触发 effect 中的 watcher，从而更新视图， 其他地方同理， 只是收集的不是渲染 watcher， 而是组件中其他地方使用的 watcher, 这样数据更新， effect 中的 watcher 就会触发，从而触发函数
:::

### 模块化

vuex 支持模块化， 模块化后， 每个模块都有自己的 state, mutations, actions, getters, 但是在访问时， 需要带上模块名， 比如访问 state 中的值时， 需要使用 $store.state.b.count
:::

那么 vuex 实例是如何创建的呢？ <br />

::: tip
这里重点考虑模块的嵌套

1.  modules 可以嵌套， 访问时 $store.state.b.count 带上模块名就行
2.  不使用 namespaced: true 时 ,modules 内同名的 mutations 会收集到一起， 触发时会全部触发
3.  使用 namespaced: true 时 ,modules 内同名的 mutations 不会收集到一起， 触发时只会触发当前模块的 mutations
4.  父级使用 namespaced： true, 自己不加，会被过滤掉

:::

主要分为三步 <br />

- 格式化传入的模块化数据
- 挂载处理好后的模块化数据
- 将状态添加到 vue 实例上,实现响应式

```js
//  大致实现
export class Store {
  constructor(options) {
    // 容器初始化
    const state = options.state; // 数据变化要更新视图 （vue的核心逻辑依赖收集）
    this._mutations = Object.create(null);
    this._actions = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modulesNamespaceMap = Object.create(null);
    this._subscribes = [];

    // 数据格式化， 把传入的options数据进行格式化， 处理成想要的数据格式
    // 1.模块收集
    this._modules = new ModuleCollection(options);
    // 2.安装模块
    installModule(this, state, [], this._modules.root);
    // 3,将状态和getters 都定义在当前的vm上
    resetStoreVM(this, state);
    console.log(this);

    // 插件内部会依次执行
    (options.plugins || []).forEach((plugin) => plugin(this));
  }
  subscribe(fn) {
    this._subscribes.push(fn);
  }
  commit = (type, payload) => {
    //保证当前this 当前store实例
    // 调用commit其实就是去找 刚才绑定的好的mutation
    this._mutations[type].forEach((mutation) => mutation.call(this, payload));
  };
  dispatch = (type, payload) => {
    this._actions[type].forEach((action) => action.call(this, payload));
  };
  replaceState(state) {
    // 替换掉最新的状态
    this._vm._data.$$state = state;
  }
  get state() {
    // 属性访问器   new Store().state  Object.defineProperty({get()})
    return this._vm._data.$$state;
  }
}
```

格式化传入的模块化数据 `new ModuleCollection` 这个主要是转换模块数据格式

```js
// this.root = {
//   _row: rootModule,
//   _children: {
//     期待的数据格式
//     a: {
//       _row: aModule,
//       _children: {
//         b: {
//           _row: bModule,
//           _children: {
//           },
//           state: bModule.state,
//         }
//       },
//       state: aModule.state,
//     }
//   },
//   state: rootModule.state,
// };
```

大致实现

```js
export default class ModuleCollection {
  constructor(options) {
    // 深度递归， 遍历所有的子模块, 格式化数据
    this.register([], options);
  }
  register(path, rootModule) {
    const newModule = new Module(rootModule);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      // 先找到当前模块上一级的模块
      let parentModule = path.slice(0, -1).reduce((root, current) => {
        return root.getChild(current);
      }, this.root);
      parentModule.addChild(path[path.length - 1], newModule);
    }
    // 递归处理所有的modules
    if (rootModule.modules) {
      forEachValue(rootModule.modules, (module, moduleName) => {
        // 将 a 模块进行注册 [a] a模块的定义
        // 将 b 模块进行注册 [b] b模块的定义
        // 将 c 模块进行注册 [b,c]  c 模块的定义
        this.register(path.concat(moduleName), module);
      });
    }
  }
  getNamespaced(path) {
    let root = this.root; // 从根模块找起来
    return path.reduce((str, key) => {
      root = root.getChild(key); // 不停的去找当前的模块
      return str + (root.namespaced ? key + "/" : "");
    }, "");
  }
}
```

其中 `forEachValue`是一个遍历对象的方法

```js
export const forEachValue = (obj, callback) => {
  Object.keys(obj).forEach((key) => callback(obj[key], key));
};
```

`Module` 是一个模块类，用来处理模块中的数据

```js
export default class Module {
  constructor(newModule) {
    this._raw = newModule;
    this._children = {};
    this.state = newModule.state;
  }
  get namespaced() {
    return !!this._raw.namespaced;
  }
  getChild(key) {
    return this._children[key];
  }

  addChild(key, module) {
    this._children[key] = module;
  }
  // 给模块继续扩展方法
  forEachMutation(fn) {
    if (this._raw?.mutations) {
      forEachValue(this._raw.mutations, fn);
    }
  }
  forEachAction(fn) {
    if (this._raw?.actions) {
      forEachValue(this._raw.actions, fn);
    }
  }
  forEachGetter(fn) {
    if (this._raw?.getters) {
      forEachValue(this._raw.getters, fn);
    }
  }
  forEachChild(fn) {
    forEachValue(this._children, fn);
  }
}
```

安装`installModule`

> 所谓的安装只是把格式化的数据根据参数整理成对应的 mutation actions getters 等等

```js
function installModule(store, rootState, path, module) {
  // 这里我需要遍历当前模块上的 actions、mutation、getters 都把他定义在
  // 将所有的子模块的状态安装到父模块的状态上
  let namespace = store._modules.getNamespaced(path); // 返回前缀即可
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace]) {
      console.error(
        `[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join(
          "/"
        )}`
      );
    }
    store._modulesNamespaceMap[namespace] = module;
  }
  // a/add  b/add b/c/add  b/f/add
  // 动态处理，vuex 可以动态添加模块
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, rootState);
    // 如果这个对象本身不是响应式的 那么Vue.set 就相当于  obj[属性 ]= 值
    Vue.set(parent, path[path.length - 1], module.state);
  }

  // 处理mutation
  module.forEachMutation((mutation, key) => {
    store._mutations[namespace + key] = store._mutations[namespace + key] || [];
    store._mutations[namespace + key].push((payload) => {
      //  this 绑定在store 上， 并传入对应模块的state
      mutation.call(store, getState(store, path), payload);
      store._subscribes.forEach((fn) => {
        fn(mutation, store.state); // 用最新的状态
      });
    });
  });
  module.forEachAction((action, key) => {
    store._actions[namespace + key] = store._actions[namespace + key] || [];
    store._actions[namespace + key].push((payload) => {
      action.call(store, store, payload);
    });
  });
  module.forEachGetter((getter, key) => {
    // 模块中getter的名字重复了会覆盖
    store._wrappedGetters[namespace + key] = function () {
      return getter(getState(store, path), store.getters, rootState);
    };
  });
  module.forEachChild((child, key) => {
    // 递归加载模块
    installModule(store, rootState, path.concat(key), child);
  });
}
```

`getState`获取对应模块的 state

```js
// 获取对应模块的state
export function getState(store, path) {
  // 获取最新的状态 可以保证视图更新
  return path.reduce((newState, current) => {
    return newState[current];
  }, store.state);
}
```

`resetStoreVM`添加响应式 ，上面有了

### 部分方法的说明

#### registerModule

同初始化一样

- 格式化数据 `this._modules.register(path, rawModule);`
- 安装模块 `installModule(this, this.state, path, this._modules.get(path), options.preserveState);`
- 重置 `resetStoreVM(this, this.state);`

```js
  // 源码
  registerModule (path, rawModule, options = {}) {
    if (typeof path === 'string') path = [path];

    {
      assert(Array.isArray(path), `module path must be a string or an Array.`);
      assert(path.length > 0, 'cannot register the root module by using registerModule.');
    }

    this._modules.register(path, rawModule);
    installModule(this, this.state, path, this._modules.get(path), options.preserveState);
    // reset store to update getters...
    resetStoreVM(this, this.state);
  }
```

#### mapState

- 判断是否传入命名空间
- 获取对应模块的 state
- 返回一个对象，key 是传入的 key，value 是一个函数，函数返回对应模块的 state

```js
// map可能是数组字符串或者对象
// 这里全部转成[{key,value}] 数组
function normalizeMap(states) {
  if (Array.isArray(states)) {
    return states.map((state) => ({ key: state, value: state }));
  } else {
    return Object.keys(states).map((key) => ({ key, value: states[key] }));
  }
}

function getModuleByNamespace(store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace];
  if (!module) {
    console.error(
      `[vuex] module namespace not found in ${helper}(): ${namespace}`
    );
  }
  return module;
}

function normalizeNamespace(fn) {
  return (namespace, map) => {
    if (typeof namespace !== "string") {
      map = namespace;
      namespace = "";
    } else if (namespace.charAt(namespace.length - 1) !== "/") {
      namespace += "/";
    }
    return fn(namespace, map);
  };
}

export const mapState = normalizeNamespace((namespace, states) => {
  const res = {};
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState() {
      let state = this.$store.state;
      let getters = this.$store.getters;
      if (namespace) {
        const module = getModuleByNamespace(this.$store, "mapState", namespace);
        if (!module) {
          return;
        }
        // 源码
        const module = getModuleByNamespace(this.$store, "mapState", namespace);
        if (!module) {
          return;
        }
        state = module.context.state;
        getters = module.context.getters;

        //  源码是做了一堆操作， 我们这里找到对应的模块的state 和getters 就行
        // const context = {};
        // Object.defineProperties(context, {
        //   state: {
        //     get: () => getState(state, namespace.split("/").filter((item) => item !="/")),
        //   },
        // });

        // state = context.state;
      }
      return typeof val === "function"
        ? val.call(this, state, getters)
        : state[val];
    };
  });
  return res;
});
```

#### createNamespacedHelpers
就是把 mapState、mapGetters、mapMutations、mapActions 的第一个参数都加上命名空间
```js
const createNamespacedHelpers = (namespace) => ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace),
});
```

一些其他的细节就不考虑了，比如：mapMutations、mapActions、mapGetters、createNamespacedHelpers、辅助函数的参数校验等等，有兴趣的可以自己去看源码。

## 资料引用

<a href="https://gitee.com/sky__bear/vue2" target="_blank"  style="display: block">自己实现的 Vuex（内部有源码）</a>
<a href="https://v3.vuex.vuejs.org/zh/" target="_blank"  style="display: block">vuex</a>
