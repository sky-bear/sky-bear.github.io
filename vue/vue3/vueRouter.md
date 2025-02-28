# vueRouter

## vueRouter3

```js
//myVueRouter.js
let Vue = null;
class HistoryRoute {
  constructor() {
    this.current = null;
  }
}
class VueRouter {
  constructor(options) {
    this.mode = options.mode || "hash";
    this.routes = options.routes || []; //你传递的这个路由是一个数组表
    this.routesMap = this.createMap(this.routes);
    this.history = new HistoryRoute();
    this.init();
  }
  init() {
    if (this.mode === "hash") {
      // 先判断用户打开时有没有hash值，没有的话跳转到#/
      location.hash ? "" : (location.hash = "/");
      window.addEventListener("load", () => {
        this.history.current = location.hash.slice(1);
      });
      window.addEventListener("hashchange", () => {
        this.history.current = location.hash.slice(1);
      });
    } else {
      location.pathname ? "" : (location.pathname = "/");
      window.addEventListener("load", () => {
        this.history.current = location.pathname;
      });
      window.addEventListener("popstate", () => {
        this.history.current = location.pathname;
      });
    }
  }

  createMap(routes) {
    return routes.reduce((pre, current) => {
      pre[current.path] = current.component;
      return pre;
    }, {});
  }
}
VueRouter.install = function (v) {
  Vue = v;
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.router) {
        // 如果是根组件
        this._root = this; //把当前实例挂载到_root上
        this._router = this.$options.router;
        //  这里写什么都没有关系，只是监听this._router.history 实现响应式
        Vue.util.defineReactive(this, "XXXX", this._router.history);
      } else {
        //如果是子组件
        this._root = this.$parent && this.$parent._root;
      }
      Object.defineProperty(this, "$router", {
        get() {
          return this._root._router;
        },
      });
      Object.defineProperty(this, "$route", {
        get() {
          return this._root._router.history.current;
        },
      });
    },
  });
  Vue.component("router-link", {
    props: {
      to: String,
    },
    render(h) {
      let mode = this._self._root._router.mode;
      let to = mode === "hash" ? "#" + this.to : this.to;
      return h("a", { attrs: { href: to } }, this.$slots.default);
    },
  });
  Vue.component("router-view", {
    render(h) {
      let current = this._self._root._router.history.current;
      let routeMap = this._self._root._router.routesMap;
      return h(routeMap[current]);
    },
  });
};

export default VueRouter;
```
这里使用`Vue.util.defineReactive`,将`this._router.history`编程响应式， 这样当路由改变的时候，页面就会重新调用`router-view`中的render函数，从而实现页面更新


## vueRouter4

通过对 history.pushState 或 replaceState 中 url 参数加#/，就能实现既改变了 window.history 对象也改变 window.hash 对象

```js
const hashIndex = base.indexOf("#");
const url =
  hashIndex > -1
    ? (location.host && document.querySelector("base")
        ? base
        : base.slice(hashIndex)) + to
    : createBaseLocation() + base + to;
try {
  // BROWSER QUIRK
  // NOTE: Safari throws a SecurityError when calling this function 100 times in 30 seconds
  history[replace ? "replaceState" : "pushState"](state, "", url);
  historyState.value = state;
} catch (err) {
  if (process.env.NODE_ENV !== "production") {
    warn("Error with push/replace State", err);
  } else {
    console.error(err);
  }
  // Force the navigation, this also resets the call count
  location[replace ? "replace" : "assign"](url);
}
```

## 组合API 
这里实现和vuex是一样的, useRoute 都是使用provide 和 inject 实现的， 
```js
export function createRouter(options) {
  const currentRoute = shallowRef()
  const matcher = createRouterMatcher(options.routes, options)

  console.log("matcher", matcher)

  // 定义一个install函数，用于安装组件
  
  function install(app) {
    // 这里的this 指向插件
    const router = this;
    app.component("router-link", RouterLink);
    app.component("router-view", RouterView);
    // 支持this.$router
    app.config.globalProperties.$router = router;
    // 添加当前的currentRoute
    Object.defineProperty(app.config.globalProperties, '$route', {
      enumerable: true,
      get: () => unref(currentRoute),
    })
    // 支持组合式api
    app.provide(routerKey, router)
    app.provide(routerViewLocationKey, currentRoute)
  }

  const router = {
    install,
  };
  return router;
}

```




## 刷新问题
- 如何改变url不引起页面刷新
  - ‌pushState‌是HTML5 History API的一部分，允许开发者在不重新加载页面的情况下改变浏览器的URL。pushState方法可以向浏览器的历史记录中添加一个新的记录，而不会导致页面刷新
  <br />
  当使用pushState或replaceState方法时，不会立即触发popstate事件。只有当用户点击浏览器的回退或前进按钮，或者使用JavaScript调用history.back()、history.forward()、history.go()方法时，才会触发popstate事件。
  - location.hash
  <br />
  location.hash属性是URL中hash部分的值，即URL中#后面的部分。当location.hash的值发生变化时，浏览器会触发hashchange事件，从而实现页面不刷新的情况下改变URL。
  <br />



## 资料引用

<a href="https://router.vuejs.org/zh/" target="_blank"  style="display: block">vueRouter 官网</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/JVIFd1cOgoqzoNxohvqcUZX5nTb" target="_blank"  style="display: block">vueRouter 资料</a>
