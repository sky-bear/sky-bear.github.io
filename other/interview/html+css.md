# html +css

1. SEO 优化

- 概念：SEO 是搜索引擎优化
- 目的： 让⽤户在使⽤关键字搜索时我们的⽹站可以尽量⾼的提升⾃然排名
- 优化方
- SSR 服务器端渲染
- html meta 标签： title、description、keywords
- 语义化的 HTML 元素、图⽚ alt、h1、h2 的合理使⽤
- 编写合理的 robots.txt ⽂件
- 过指示搜索引擎忽略不重要的⽂件或⽬录，可以让搜索引擎更专注于重要内容的抓取和索引。
- 当然也可以避免⼀些敏感或私有内容被⽆意中索引。

2. defer 和 async 属性在 script 标签中分别有什么作⽤

机制不同：

- defer 的下载不会阻⽌ DOM 的构建，但是在 DOM Tree 构建完成后，在 DOMContentLoaded 事件之前，先执
  ⾏脚本的内容，并且 defer 脚本的执⾏是有有序的。
- async 的下载也不会阻⽌ DOM 的加载，⽽且不会保证在 DOMContentLoaded 之前或者之后执⾏，也不能保证
  顺序，它的每个脚本是独⽴进⾏的。

场景不同：

- defer 通常⽤于需要在⽂档解析后操作 DOM 的 JavaScript 代码，并且对多个 script ⽂件有顺序要求的；
- async 通常⽤于独⽴的脚本，对其他脚本，甚⾄对 DOM 没有依赖的脚本；

3. CSS3 新特性

- 选择器： j 结构性伪类，如:`nth-child` 、`:nth-last-child `等等
- 边框圆角
- 转换和动画
- 等等

4. 物理像素-逻辑像素-CSS 像素-像素密度

- 物理像素 PPI：也叫设备像素，是显示屏幕的最⼩物理单位。
  - 每个物理像素可以发光并显示特定的颜⾊。
  - 物理像素的⼤⼩是固定的，由设备的硬件决定。
  - ⽐如 iPhone X 的分辨率 1125x2436，指的就是物理像素；
    物理像素的密度（像素每英⼨，即 PPI，英语：Pixels Per Inch，缩写：PPI）PPI 越⾼，屏幕显示的内容就越细腻
- 逻辑像素:设备独立像素 DIP
  - 是⼀个抽象的单位，⽤于在编程中统⼀不同设备的显示标准。
  - 逻辑像素是⽤来衡量在不同设备上如何统⼀显示内容的尺⼨单位。
  - 例如，在⾼分辨率设备上，可能有多个物理像素组成⼀个逻辑像素。
- DPR:设备像素⽐: 物理像素和逻辑像素的比值（物理像素 / CSS 像素）
  `window.devicePixelRatio`:是一个浏览器提供的只读属性，用于表示当前显示设备的物理像素与 CSS 像素之间的比例关系
  window.devicePixelRatio 表示每个 CSS 像素对应多少个物理像素。
  - 如果 devicePixelRatio = 1，则 1 个 CSS 像素对应 1 个物理像素。
  - 如果 devicePixelRatio = 2，则 1 个 CSS 像素对应 4 个物理像素（2x2）。
  - 如果 devicePixelRatio = 3，则 1 个 CSS 像素对应 9 个物理像素（3x3）。
- CSS 像素：一种用在 web 的逻辑像素
- DPI:每英⼨的打印点数, 主要用于打印领域
  DPI 衡量的是墨⽔点的数量，PPI 衡量的是像素的数量

5. 为什么在移动端使⽤@2x、@3x 的图⽚？

提供不同倍数的图片

```js
image{
  background-image: url('image@1x.png');
}
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  image {
    background-image: url('image@2x.png');
  }
}
@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {
  image {
    background-image: url('image@3x.png');
  }
}
```

6. 什么是 1px 问题，前端如何去解决它，如何画出 0.5px 边框？
   我们知道在移动端的设计稿中，往往 UI 给的设计稿宽度为 750px ，图中设计的边框宽度为 1px ，在我们 375px 的设备下，我们应该将宽度写为 0.5px 。
   但是如果直接设置 0.5 的话，⼀些设备（特别是旧的移动设备和浏览器）并且不⽀持 0.5px，这个就是我们常说的 1px 问题以及如何画出 0.5px 边框的问题。
   那么这种问题应该如何去处理呢？

- box-shadow
  ```css
  .box-shadow-border {
    width: 300px;
    height: 300px;
    background-color: #aff;
    box-shadow: 0 0 0 0.5px black; /* 使用box-shadow模拟0.5px边框 */
  }
  ```
- 使用伪元素和 transform, 主要是用scaleY(0.5)

7. BFC解释？  怎么创建 ？ 可以解决什么问题？
我们所有的盒⼦，不管是块级盒⼦还是⾏内盒⼦，它们都属于某⼀个FC（格式化上下⽂），块级盒⼦属于BFC（块级格式化上下⽂），⾏内级元素属于IFC（⾏内格式化上下⽂）。

参考css


7. 通常会采取哪些措施来确保⽹站或者应⽤在不同的浏览器上的兼容性
 - 工程化： ⽐如browserslist可以配置⽬标的浏览器或者Node环境，然后在不同的⼯具中起作⽤，⽐如autoprefixer/babel/postcss-preset-env等，在进⾏了正确的配置后，开发的Vue或者React项⽬在进⾏打包
时，会⾃动根据⽬标环境来添加CSS前缀、Babel代码转换等
- ⽤polyfill来处理浏览器兼容性问题，⽐如babel-polyfill、core-js、regenerator-runtime等
- 在开发过程中，使⽤postcss-preset-env来处理CSS兼容性问题，⽐如添加前缀、转换新的CSS特性等
- 在开发过程中，使⽤babel来处理JavaScript兼容性问题，⽐如转换新的JavaScript特性、转换ES6+语法的语法糖等
  


8. 其余参考CSS模块
<a href="/css/css.html">CSS</a>
<a href="/browser/">浏览器</a>