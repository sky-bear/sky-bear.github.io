# 可视化

## Canvas

- 概述: Canvas API 提供了一个通过 JavaScript 和 HTML 的 `<canvas>` 元素来绘制图形的方式。它可以用来绘制 2D 图形，包括线条、矩形、圆形以及更复杂的形状。Canvas 也支持图像操作，比如图像裁剪、变形等。
- 特点:
  - 2D 图形渲染: 主要用于二维图形的渲染
  - 简单易用: Canvas API 相对简单，上手快
  - 适用场景: 适用于图表、简单游戏、图像编辑等场景
  - 性能: 对于不需要复杂 3D 效果的应用，性能足够好

## WebGL

- 概述: WebGL 是一个在任何兼容的网页浏览器中使用 GPU 加速渲染图形的 API，它基于 OpenGLES，一个用于嵌入设备上的图形渲染的标准。WebGL 提供了更底层的图形 API，可以用来创建复杂的 3D 图形和效果。
- 特点:
  - 3D 图形渲染: 专注于 3D 图形的渲染
  - 复杂和强大: 提供底层图形渲染能力，可以创建复杂的 3D 图形和动画
  - 适用场景: 适用于 3D 游戏、可视化模拟、复杂动画等场景
  - 性能: 利用 GPU 加速，能够处理更复杂和资源密集的图形任务

## SVG

是一种基于 XML 的矢量图形格式，支持缩放而不失真，适合用来创建高质量的图形元素，如图标、图表、地图等， 是一系列的 dom 标签

## three.js

Three.js 是一个基于原生 WebGL 的 JavaScript 3D 库，它提供了一套易于使用的 API，使开发者能够在网页上创建和展示 3D 内容。这个库抽象了 WebGL 的复杂性，让开发者不必深入了解 WebGL 的详细信息就能构建 3D 场景、渲染物体和实现动画效果。下面是 Three.js 的一些基础概念，以及一个简单的入门示例

### 基础概念

- 场景（Scene）：场景是 Three.js 中所有 3D 对象的容器，你可以将场景想象为一个空的空间，所有的物体、光源、相机等都需要添加到场景中。
- 相机（Camera）：相机决定了我们能看到场景中的哪些部分，以及以什么样的视角来看。Three.js 提供了多种相机类型，如透视相机（PerspectiveCamera）和正交相机（OrthographicCamera）。- 渲染器（Renderer）：渲染器负责将场景和相机渲染到屏幕上。Three.js 提供了多种渲染器，如 WebGLRenderer、CanvasRenderer 等。
- 物体（Object）：物体是 Three.js 中最基本的元素，可以是几何体（如立方体、球体等）或自定义的 3D 模型。物体可以通过材质（Material）和纹理（Texture）来定义外观。
- 光源（Light）：光源决定了场景中物体的光照效果。Three.js 提供了多种光源类型，如点光源（PointLight）、平行光（DirectionalLight）等。
- 动画（Animation）：Three.js 提供了动画功能，可以通过修改物体的位置、旋转、缩放等属性来实现动画效果。
- 材质（Material）：材质决定了物体的外观，如颜色、透明度、纹理等。Three.js 提供了多种材质类型，如基础材质（MeshBasicMaterial）、 Lambert 材质（MeshLambertMaterial）等。
- 渲染器（Renderer）：渲染器负责将场景和相机渲染到屏幕上。Three.js 提供了多种渲染器，如 WebGLRenderer、CanvasRenderer 等。


## Antv
## Echarts
## D3.js
svg操作的封装， 矢量的 

## ZRender
ZRender 是百度开源的一个轻量级 2D 图形渲染库，是 ECharts 的底层渲染引擎



