# vuex 4

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## vuex3 和 vuex4 的区别

1. 兼容性

- vuex3 适用于 vue2
- vuex4 适用于 vue3

2. vuex4 的 store 实例不再是一个 vue 实例，而是一个普通的 js 对象

- vuex3 中，store 实例是一个 vue 实例，因此可以直接使用 vue 实例的方法，如$watch、$subscribe 等

3. 安装方式上的区别

- vuex3

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  // ...
});
```

- vuex4

```js
import { createApp } from "vue";
import { createStore } from "vuex";

const store = createStore({
  // ...
});

const app = createApp({
  /* your root component */
});
app.use(store);
```

## 实现

### 原理

vuex4 主要借助的是方法 provide 和 inject，通过 provide 将 store 实例注入到根组件中，然后通过 inject 在子组件中获取 store 实例
<br />

`install`中就是store的注入，`provide`方法将 store 实例注入到根组件中，`app.config.globalProperties.$store = this;`则是将 store 实例挂载到全局属性上，这样就可以在组件中通过`this.$store`来访问 store 实例了

```js:line-numbers{27-31}
// store.js
export class Store {
  constructor(options = {}) {
    const { plugins = [], strict = false, devtools } = options;
    const store = this;
    this._mutations = Object.create(null);
    this._subscribers = [];
    this._actionSubscribers = [];
    this._mutations = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modulesNamespaceMap = Object.create(null);
    // 格式module数据
    this._modules = new ModuleCollection(options);
    this._actions = Object.create(null);
    this._makeLocalGettersCache = Object.create(null);
    this._committing = false;

    this.strict = strict;

    // 安装模块
    const rootState = this._modules.root.state;
    console.log("rootState", rootState);
    installModule(this, rootState, [], this._modules.root);

    resetStoreState(this, options.state);
    plugins.forEach((plugin) => plugin(this));
  }
  install(app, injectKey) {
    console.log("app, injectKey", app, injectKey);
    app.provide(injectKey || storeKey, this);
    // 添加 全局属性  支持  $store 访问
    app.config.globalProperties.$store = this;
  }

  get state() {
    return this._state.data;
  }

  replaceState(state) {
    this._withCommit(() => {
      this._state.data = state;
    });
  }

  // 实际使用的还是vue的watch
  watch(getter, callBaclk, options) {
    return watch(() => getter(this.state, this.getters), callBaclk, options);
  }
  // 绑定thsi 为当先store
  commit = (_type, _payload, _options) => {
    const { type, payload, options } = unifyObjectStyle(
      _type,
      _payload,
      _options
    );
    const mutation = { type, payload };

    this._withCommit(() => {
      this._mutations[type].forEach(function commitIterator(handler) {
        handler(payload);
      });
    });

    this._subscribers.forEach((sub) => sub(mutation, this.state));
  };
  // 确保this 指向 store
  dispatch = (_type, _payload, _options) => {
    const { type, payload, options } = unifyObjectStyle(
      _type,
      _payload,
      _options
    );
    const action = { type, payload };
    const entry = this._actions[type];
    if (!entry) return;
    // _actionSubscribers before action
    try {
      // 这里使用slice 浅拷贝，防止订阅者同步调用取消订阅时迭代器无效 场景： 同时添加before after 如果同步取消， after就不会执行
      this._actionSubscribers
        .slice()
        .filter((sub) => sub.before)
        .forEach((sub) => sub.before(action, this.state));
    } catch (error) {
      console.log(error);
    }
    // dispath 返回的是promise
    const result =
      entry.length === 1
        ? entry[0](payload)
        : Promise.all(entry.map((handler) => handler(payload)));
    return new Promise((resolve, reject) => {
      result.then(
        (res) => {
          this._actionSubscribers
            .filter((sub) => sub.after)
            .forEach((sub) => sub.after(action, this.state));
          resolve(res);
        },

        (error) => {
          this._actionSubscribers
            .filter((sub) => sub.error)
            .forEach((sub) => sub.error(action, this.state, error));
          reject(error);
        }
      );
    });
  };

  // 订阅mutation
  subscribe(fn, options) {
    // 返回一个取消订阅的函数
    return genericSubscribe(fn, this._subscribers, options);
  }
  // 订阅actions
  subscribeAction(fn, options) {
    const subs = typeof fn === "function" ? { before: fn } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options);
  }

  // 动态注册模块
  registerModule(path, module, options) {
    if (typeof path === "string") path = [path];
    // 格式化需要注入的模块数据
    this._modules.register(path, module);
    // this._modules.get(path) 这个指的是当前path 对应的模块
    installModule(
      this,
      this.state,
      path,
      this._modules.get(path),
      options.preserveState
    );
    resetStoreState(this, this.state);
  }
  //卸载模块
  unregisterModule(path) {
    if (typeof path === "string") path = [path];
    // 删除格式化数据上的module
    this._modules.unregister(path);
    // 删除 state 上的数据
    this._withCommit(() => {
      const parentState = getNestedState(this.state, path.slice(0, -1));
      delete parentState[path[path.length - 1]];
    });
    // 相当于重新执行一遍 store 的constructor
    resetStore(this);
  }

  // 判断当前模块是否已经加载过
  hasModule(path) {
    if (typeof path === "string") path = [path];
    return this._modules.isRegistered(path);
  }

  _withCommit(fn) {
    const committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  }
}

// 创建一个容易， 返回的数据要满足vue插件注册的格式
export function createStore(options) {
  return new Store(options);
}
```
当使用`useStore`时, 实际上获取的就是通过inject获取的store实例
```js
import { inject } from 'vue'
export const storeKey = 'store';
export function useStore(injectKey = storeKey) {
  return inject(injectKey)
}

```



那响应式是怎么来的呢?<br />
getters 使用computed包装，state 使用reactive包装 这样就都可以响应式了

```js:line-numbers{31-33,17-26}
export function resetStoreState(store, state, hot) {
  // 旧的state 和旧的scope
  const oldState = store._state;
  const oldScope = store._scope;

  store.getters = {};
  // reset local getters cache
  // store._makeLocalGettersCache = Object.create(null) ???
  var wrappedGetters = store._wrappedGetters;
  var computedObj = {};
  var computedCache = {};
  const scope = effectScope();
  // 批量手机副作用
  scope.run(() => {
    forEachValue(wrappedGetters, (fn, key) => {
      // 这个传入的store 取的值实际上 reactive后的值
      computedObj[key] = partial(fn, state); // computed 的参数是函数
      computedCache[key] = computed(function () {
        return computedObj[key]();
      }); // 具有缓存作用
      Object.defineProperty(store.getters, key, {
        get: function () {
          return computedCache[key].value;
        },
        enumerable: true, // for local getters
      });
    });
  });

  // 为啥要包装一层呢？ 如果需要替换state，直接替换store._state.data就行了,不然还要 reaceive 处理一下
  store._state = reactive({
    data: state,
  });
  store._scope = scope;

  // 严格模式下禁止在mutation之外更改state
  if (store.strict) {
    enableStrictMode(store);
  }

  // 如果是热更新，则替换state
  if (oldState) {
    if (hot) {
      store._withCommit(() => {
        oldState.data = null;
      });
    }
  }

  // 只能存在一个scope
  if (oldScope) {
    oldScope.stop();
  }
}
```


其余的过程和vue3差不多， 整个过程主要是三步

- 格式化传入的模块化数据
- 挂载处理好后的模块化数据
- 将状态添加到 vue 实例上,实现响应式

<br />
实现 `store.js`

```js:line-numbers{27-31}
// store.js
export class Store {
  constructor(options = {}) {
    const { plugins = [], strict = false, devtools } = options;
    const store = this;
    // 用来存放格式化后的mutations
    this._mutations = Object.create(null);
    // 订阅mutations的函数，当mutations触发时，会执行这些函数
    this._subscribers = [];
    // 订阅actions的函数，当actions触发时，会执行这些函数
    this._actionSubscribers = [];
    // 用来存放格式化后的getters
    this._wrappedGetters = Object.create(null);
    // 用来存放模块 {a: Amodule, b: Bmodule}
    this._modulesNamespaceMap = Object.create(null);
    // 格式module数据
    this._modules = new ModuleCollection(options);
    //用来存放格式化后的actions
    this._actions = Object.create(null);
    // 临时存放getters 注册完成后清除
    this._makeLocalGettersCache = Object.create(null);
    // 执行committing 的状态 
    this._committing = false;

    this.strict = strict;

    // 安装模块
    const rootState = this._modules.root.state;
    console.log("rootState", rootState);
    installModule(this, rootState, [], this._modules.root);
    // 添加响应式
    resetStoreState(this, options.state);
    // 安装插件
    plugins.forEach((plugin) => plugin(this));
  }
  install(app, injectKey) {
    console.log("app, injectKey", app, injectKey);
    app.provide(injectKey || storeKey, this);
    // 添加 全局属性  支持  $store 访问
    app.config.globalProperties.$store = this;
  }

  get state() {
    return this._state.data;
  }

  replaceState(state) {
    this._withCommit(() => {
      this._state.data = state;
    });
  }

  // 实际使用的还是vue的watch
  watch(getter, callBaclk, options) {
    return watch(() => getter(this.state, this.getters), callBaclk, options);
  }
  // 绑定thsi 为当先store
  commit = (_type, _payload, _options) => {
    const { type, payload, options } = unifyObjectStyle(
      _type,
      _payload,
      _options
    );
    const mutation = { type, payload };

    this._withCommit(() => {
      this._mutations[type].forEach(function commitIterator(handler) {
        handler(payload);
      });
    });

    this._subscribers.forEach((sub) => sub(mutation, this.state));
  };
  // 确保this 指向 store
  dispatch = (_type, _payload, _options) => {
    const { type, payload, options } = unifyObjectStyle(
      _type,
      _payload,
      _options
    );
    const action = { type, payload };
    const entry = this._actions[type];
    if (!entry) return;
    // _actionSubscribers before action
    try {
      // 这里使用slice 浅拷贝，防止订阅者同步调用取消订阅时迭代器无效 场景： 同时添加before after 如果同步取消， after就不会执行
      this._actionSubscribers
        .slice()
        .filter((sub) => sub.before)
        .forEach((sub) => sub.before(action, this.state));
    } catch (error) {
      console.log(error);
    }
    // dispath 返回的是promise
    const result =
      entry.length === 1
        ? entry[0](payload)
        : Promise.all(entry.map((handler) => handler(payload)));
    return new Promise((resolve, reject) => {
      result.then(
        (res) => {
          this._actionSubscribers
            .filter((sub) => sub.after)
            .forEach((sub) => sub.after(action, this.state));
          resolve(res);
        },

        (error) => {
          this._actionSubscribers
            .filter((sub) => sub.error)
            .forEach((sub) => sub.error(action, this.state, error));
          reject(error);
        }
      );
    });
  };

  // 订阅mutation
  subscribe(fn, options) {
    // 返回一个取消订阅的函数
    return genericSubscribe(fn, this._subscribers, options);
  }
  // 订阅actions
  subscribeAction(fn, options) {
    const subs = typeof fn === "function" ? { before: fn } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options);
  }

  // 动态注册模块
  registerModule(path, module, options) {
    if (typeof path === "string") path = [path];
    // 格式化需要注入的模块数据
    this._modules.register(path, module);
    // this._modules.get(path) 这个指的是当前path 对应的模块
    installModule(
      this,
      this.state,
      path,
      this._modules.get(path),
      options.preserveState
    );
    resetStoreState(this, this.state);
  }
  //卸载模块
  unregisterModule(path) {
    if (typeof path === "string") path = [path];
    // 删除格式化数据上的module
    this._modules.unregister(path);
    // 删除 state 上的数据
    this._withCommit(() => {
      const parentState = getNestedState(this.state, path.slice(0, -1));
      delete parentState[path[path.length - 1]];
    });
    // 相当于重新执行一遍 store 的constructor
    resetStore(this);
  }

  // 判断当前模块是否已经加载过
  hasModule(path) {
    if (typeof path === "string") path = [path];
    return this._modules.isRegistered(path);
  }
  // 更改state时使用， 确保在commit时， 为同步函数
  _withCommit(fn) {
    const committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  }
}

```

`ModuleCollection`格式化模块数据

```js
export default class ModuleCollection  {
  constructor(rawRootModule) {
    this.register([], rawRootModule)
  }
  // 获取当前路径的的父级模块
  get(path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }

  getNamespace(path) {
    // this 指向 store._modules 就是ModuleCollection实例
    let module = this.root;
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespaced ? key + "/" : "")
    }, "")

  }
  register(path, rawModule) {
    const newModule = new Module(rawModule)
    if (path.length === 0) {
      this.root = newModule
    } else {
      // 找当当前模块的父级模块 [a,b,c]  找到c的父级b , 并把c 添加到b 上
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
    }

    // 递归处理所有modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule)
      })
    }
  }
  unregister(path) {
    const parent = this.get(path.slice(0, -1))
    const key = path[path.length - 1]
    parent.removeChild(key)
  }
  isRegistered(path) {
    const parent = this.get(path.slice(0, -1))
    const key = path[path.length - 1]
    if (parent) {
      return parent.hasChild(key)
    }

    return false
  }

}

```

对应的`Module`类

```js
export default class Module {
  constructor(rawModule) {
    this._children = Object.create(null);
    this._rawModule = rawModule;
    // state 可以是个函数， 也可使是个对象
    const rawState = rawModule.state;
    this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
  }

  get namespaced() {
    return !!this._rawModule.namespaced;
  }

  // 获取当前模块的子模块
  getChild(key) {
    return this._children[key];
  }
  // 添加子模块
  addChild(key, module) {
    this._children[key] = module;
  }
  hasChild (key) {
    return key in this._children
  }

  removeChild (key) {
    delete this._children[key]
  }

  forEachChild(fn) {
    forEachValue(this._children, fn);
  }

  forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  }
  forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  }
  forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  }
}

```
安装格式化后的`module`
```js:line-numbers {88-128}
// store-util.js
export function resetStoreState(store, state, hot) {
  // 旧的state 和旧的scope
  const oldState = store._state;
  const oldScope = store._scope;

  store.getters = {};
  // reset local getters cache
  // store._makeLocalGettersCache = Object.create(null) ???
  var wrappedGetters = store._wrappedGetters;
  var computedObj = {};
  var computedCache = {};
  const scope = effectScope();
  // 批量手机副作用
  scope.run(() => {
    forEachValue(wrappedGetters, (fn, key) => {
      // 这个传入的store 取的值实际上 reactive后的值
      computedObj[key] = partial(fn, state); // computed 的参数是函数
      computedCache[key] = computed(function () {
        return computedObj[key]();
      }); // 具有缓存作用
      Object.defineProperty(store.getters, key, {
        get: function () {
          return computedCache[key].value;
        },
        enumerable: true, // for local getters
      });
    });
  });

  // 为啥要包装一层呢？ 如果需要替换state，直接替换store._state.data就行了,不然还要 reaceive 处理一下
  store._state = reactive({
    data: state,
  });
  store._scope = scope;

  // 严格模式下禁止在mutation之外更改state
  if (store.strict) {
    enableStrictMode(store);
  }

  // 如果是热更新，则替换state
  if (oldState) {
    if (hot) {
      store._withCommit(() => {
        oldState.data = null;
      });
    }
  }

  // 只能存在一个scope
  if (oldScope) {
    oldScope.stop();
  }
}

// 异步的更改state
function enableStrictMode(store) {
  watch(
    () => store._state.data,
    () => {
      assert(
        store._committing,
        "do not mutate vuex store state outside mutation handlers"
      );
    },
    { deep: true, flush: "sync" }
  );
}

// 格式化 mutation actions 参数
export function unifyObjectStyle(type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }
  {
    assert(
      typeof type === "string",
      "expects string as the type, but found " + typeof type + "."
    );
  }

  return { type, payload, options };
}

export function installModule(store, rootState, path, module,hot) {
  const isRoot = !path.length;
  const namespace = store._modules.getNamespace(path);
  console.log("namespace", namespace);

  if (module.namespaced) {
    // 同名的模块，直接覆盖
    store._modulesNamespaceMap[namespace] = module;
  }
  // 往根上的state 设置module的state  不是热更新时
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.splice(0, -1));
    const moduleName = path[path.length - 1];
    parentState[moduleName] = module.state;
  }

  // 当前模块的context 里面包含 commit dispatch getters state
  const local = (module.context = makeLocalContext(store, namespace, path));

  module.forEachMutation((mutation, key) => {
    // namespace  a/
    // key mutation 名称
    const namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction((action, key) => {
    const type = namespace + key;
    registerAction(store, type, action, local);
  });

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

function getNestedState(rootState, path) {
  return path.reduce((state, key) => state[key], rootState);
}

// 添加模块直接访问到 store.getters 和 store.state， 并处理命名空间调用dispatch 和 commit
function makeLocalContext(store, namespace, path) {
  // 当不存在时 为空字符串 ""
  const oNamespace = namespace === ""; // 也就是根

  const local = {
    //处理dispatch ， 当不是根模块时，拼接上命名空间
    dispatch: oNamespace
      ? store.dispatch
      : (_type, _payload, _options) => {
          const args = unifyObjectStyle(_type, _payload, _options);
          const { payload, options } = args;
          let type = args.type;
          // 当不是访问根模块时
          if (!options || !options.root) {
            type = namespace + type; // a/asyncAdd
          }
          return store.dispatch(type, payload);
        },

    commit: oNamespace
      ? store.commit
      : (_type, _payload, _options) => {
          const args = unifyObjectStyle(_type, _payload, _options);
          const { payload, options } = args;
          let type = args.type;
          // 当不是访问根模块时
          if (!options || !options.root) {
            type = namespace + type; // a/asyncAdd
          }
          return store.commit(type, payload, options);
        },
  };

  Object.defineProperties(local, {
    getters: {
      // 这里访问store.getters 实际是访问 computedCache
      get: oNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace),
    },
    state: {
      get: () => getNestedState(store.state, path),
    },
  });
  return local;
}

// 添加一个 namnespace 对应的getters集合缓存
function makeLocalGetters(store, namespace) {
  //本地缓存没有时
  if (!store._makeLocalGettersCache[namespace]) {
    const gettersProxy = {};
    const splitPos = namespace.length;
    // 执行这里时， 所有的getters 都已经挂载到store.getters上了

    Object.keys(store.getters).forEach((type) => {
      // type double  a/double
      // namespace   ""  a/
      if (type.slice(0, splitPos) !== namespace) return; // slice 取0到splitPos位置的字符串，但是不包含splitPos位置的字符

      // 去掉命名空间 a/double => double
      const localType = type.slice(splitPos);
      // 把本地的getters代理到store.getters上
      Object.defineProperty(gettersProxy, localType, {
        get: () => store.getters[type],
        enumerable: true,
      });
    });
    // 增加对应模块的getter访问，
    store._makeLocalGettersCache[namespace] = gettersProxy;
  }
  return store._makeLocalGettersCache[namespace];
}

function registerMutation(store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler(payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction(store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = []);
  // dispatch返回的是一个promise
  entry.push(function wrappedActionHandler(payload) {
    let res = handler.call(
      store,
      {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store.getters,
        rootState: store.state,
      },
      payload
    );
    // 如果返回的是不是一个promise
    if (isPromise(res)) {
      res = Promise.resolve(res);
    }
    return res;
  });
}

function registerGetter(store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) return;
  store._wrappedGetters[type] = function wrappedGetter(store) {
    return rawGetter(
      local.state,
      local.getters,
      store.state, //  root state
      store.getters //  root getters
    );
  };
}


// 处理订阅函数
export function genericSubscribe(fn, subs, options ={}) {
  if(!subs.includes(fn)) {
    options.prepend ? subs.unshift(fn) : subs.push(fn);
  }
  // 返回一个取消订阅的函数
  return () => {
    const i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }

}

// 重制store
export function resetStore(store, hot) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  store._modulesNamespaceMap = Object.create(null)
  const state = store.state
  // init all modules
  installModule(store, state, [], store._modules.root, true)
  // reset state
  resetStoreState(store, state, hot)
}
```

插件就更简单了
```js
plugins.forEach((plugin) => plugin(this));
```

安装后就是响应式了, 一开始就贴过代码了， 这里就不重复了



## 资料引用

<a href="https://gitee.com/sky__bear/vue3" target="_blank"  style="display: block">自己实现的 Vuex（内部有源码）</a>
<a href="https://github.com/vuejs/vuex" target="_blank"  style="display: block">vuex</a>