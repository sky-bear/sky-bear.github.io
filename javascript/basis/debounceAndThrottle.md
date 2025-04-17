# 节流和防抖

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## 函数防抖（debounce）

```
在事件触发n秒后在执行回调， 如果在期间内再次触发， 从新计时
```

下面是一个例子：
<Image  src="/javascript/basis/images/debounce.gif" />

最左边`加1`是没有进行防抖处理的， 每次点击都会执行， `加3`是处理过的， 效果很明显

```js
防抖函数
const debounce = (fn, time = 1000, options = { leading: true }) => {
    let timer;
    const _debounce = function() {
        const that = this;
        if (timer) {
            clearTimeout(timer);
        }
        if (options.leading && !timer) {  // 首次是否执行
            timer = setTimeout(null, time);
          return  fn.apply(that, arguments); // 将dom中的this传递到函数中
        }
        if (timer) clearTimeout(timer);

            timer = setTimeout(() => {
                fn.apply(that, arguments); // 将dom中的this传递到函数中
                timer = null;
            }, time);

    };
    return _debounce;
};
const add_1 = debounce(add);
 button[2].addEventListener("click", add_1);

上面是为了将dom中的this传递到函数中这么写，如果想给函数绑定其他的this
const debounce = (
    fn,
    time = 1000,
    options = { leading: true, context: null } // 这里的context 就是需要绑定的this
) => {
    let timer;
    const _debounce = function (...args) {
     if(timer) clearTimeout(timer);
    if(options.immediately && !timer) {
      timer = setTimeout(null, time);
     return fn.apply(options.context,args);
    }

    timer = setTimeout(() => {
      fn.apply(options.context,args);
      timer = null
    }, time)

  }
    return _debounce;
};
```

## 函数节流(throttle)

```
规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
```

<Image  src="/javascript/basis/images/throttle.gif" />

```js
 const throttle = (fn, time = 1000, options = { leading: true }) => {
     let last, timer;
     const _throttle = function() {
         const that = this;
         let now = +new Date();
         if (last && now < last + time) {
             if (timer) return;
             timer = setTimeout(() => {
                 clearTimeout(timer);
                 last = now;
                 fn.apply(that, arguments);
             }, time);
         } else {
             last = now;
             fn.apply(that, arguments);
         }
     };
     return _throttle;
 }
 同上如果需要改变绑定的this， 直接传参就行
```

## 使用场景

- 防抖
  - 窗口发生变化的 resize 事件
  - 搜索框输入内容， 防止每次输入都触发请求
  - 文本编辑器实时保存
- 节流
  - scroll 事件， 滚动监听
  - 拖拽事件
  - 鼠标移动事件
