
# 基础专栏

针对一些难点的基础进行整理

## this
参考书籍《你不知道的javascript上》

<script setup>
import Image from "../components/Image/index.vue"
</script>
<Image  src="../images/你不知道的javascript上.jpg" />



### 基础
- 普通函数
  - this在任何情况下都不指向函数的词法作用域
  - this实际上是在函数被调用时发生的绑定， 它指向什么完全取决于函数在哪里被调用
- 箭头函数
  - 箭头函数体内的 this 对象就是定义时所在的对象，而不是使用时所在的对象
  - 是箭头函数根本没有自己的 this，导致内部的 this 就是外层代码块的 this


### 解析
- 调用位置
  - 调用位置：函数在代码中被调用的位置（而不是声明的位置）.
  - 调用栈：为了到达当前执行位置所调用的所有函数
- <span class="k-p">绑定规则</span>
  - 默认绑定
    - 独立函数调用
      - 非严格模式 window
      - 严格模式 undefined
  - 隐式绑定：当函数引用有山下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象
  - 显式绑定
    - API调用的"上下文"
    - call apply bind
    - new绑定
      - new操作符会进行如下操作
        - 创建一个全新的对象
        - 新对象会被执行[[Prototype]]连接
        - 新对象会绑定到函数调用的this
        - 如果函数没有返回其他对象，表达式会返回这个新对象
    - 优先级
      - new绑定 > 显式绑定 > 隐式绑定 > 默认绑定
    - 绑定例外:忽略的this
      - call apply bind  会忽略  null 或者undefined作为this的 绑定对象
      - 使用Object.create()，创建{}， 并委托this,更安全

    

