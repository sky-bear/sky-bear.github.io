# vue3

## ref 和 reactive 嵌套

```js
createApp({
  setup() {
    const count = ref(15);
    const obj = reactive({
      name: "张三",
      age: count,
    });
    count.value = 10;
    console.log(count.value); // 10
    console.log(count.value === obj.age); // true
    obj.age = 20;
    console.log(obj.age); // 20
    console.log(count.value === obj.age); // true
    return {
      obj,
    };
  },
}).mount("#app");
```

这里需要注意， 响应式嵌套响应式 依然是响应式的

- `count.value === obj.age`,这里 obj.age 访问的是 ref 对象， 没有`.value`是底层自动解包了, 源码在 reactiveHandler 的 get 方法中做了处理
  ```js:line-numbers {61-63}
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly,
        isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (
          receiver ===
            (isReadonly2
              ? isShallow2
                ? shallowReadonlyMap
                : readonlyMap
              : isShallow2
              ? shallowReactiveMap
              : reactiveMap
            ).get(target) || // receiver is not the reactive proxy, but has the same prototype
          // this means the receiver is a user proxy of the reactive proxy
          Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)
        ) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        let fn;
        if (targetIsArray && (fn = arrayInstrumentations[key])) {
          return fn;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        isRef(target) ? target : receiver
      );
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (isRef(res)) {
        return targetIsArray && isIntegerKey(key) ? res : res.value;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    }
  }
  ```
- `obj.age = 20`，这里设置 obj.age，为啥 count.value 跟着变化呢<br />
  源码`MutableReactiveHandler`中的 set 有单独处理

  ```js:line-numbers {9-14}
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value,
      isRef(target) ? target : receiver
    );
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  }
  ```

## 异步组件 `defineAsyncComponent`

异步组件打包时， 会**单独打包**， 这样可以按需加载， 提升性能， 同时提高复用性， 代码分割 <br />

大致的实现原理

```js
import { ref } from "@vue/reactivity";
import { h } from "./h";
import { isFunction } from "@vue/shared";

export function defineAsyncComponent(options) {
  if (isFunction(options)) {
    options = { loader: options };
  }

  return {
    setup() {
      const { loader, errorComponent, timeout, delay, onError } = options;
      const loaded = ref(false);
      const error = ref(false);
      const loading = ref(false);
      let Comp = null;
      let delayTimer = null;

      let attempts = 0;
      function laodFunc() {
        attempts++;
        return loader().catch((err) => {
          if (onError) {
            return new Promise((resolve, reject) => {
              const retry = () => resolve(laodFunc());
              const fail = () => reject(err);
              onError(err, retry, fail, attempts);
            });
          } else {
            throw err;
          }
        });
      }

      laodFunc()
        .then((comp) => {
          console.log("compcomp", comp);
          Comp = comp;
          loaded.value = true;
        })
        .catch((err) => {
          error.value = true;
        })
        .finally(() => {
          loading.value = false;
          if (delayTimer) {
            clearTimeout(delayTimer);
          }
        });

      if (timeout) {
        setTimeout(() => {
          error.value = true;
        }, timeout);
      }
      if (delay) {
        delayTimer = setTimeout(() => {
          loading.value = true;
        }, delay);
      }

      const placeholder = h("div");
      return () => {
        if (loaded.value) {
          return h(Comp);
        } else if (error.value && errorComponent) {
          return h(errorComponent);
        } else if (loading.value) {
          return h("p", "loading");
        } else {
          return placeholder;
        }
      };
    },
  };
}
```

## hooks

<a href="https://github.com/InhiblabCore/vue-hooks-plus/blob/master/README.zh-CN.md" target="_blank"  style="display: block">VueHooks Plus</a>
