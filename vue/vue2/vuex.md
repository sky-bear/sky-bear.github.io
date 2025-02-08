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


## 资料引用

<a href="https://v3.vuex.vuejs.org/zh/" target="_blank"  style="display: block">vuex</a>



