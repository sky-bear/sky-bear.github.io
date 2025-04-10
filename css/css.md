# css

<script setup>
import Image from "../components/Image/index.vue"
</script>

> CSS 指层叠样式表 ( Cascading Style Sheets), 用来描述如何显示 HTML 元素， 通俗点将就是控制页面的布局和外观。样式层叠就是对一个元素多次设置同一个样式，这将使用最后一次设置的属性值。样式层叠次序基于一定的规则权重

## 面试分类

### 必知必会

- 选择器&优先级
- 显示隐藏
- 盒模型及其特性
- 图片格式&精灵图
- 像素密度和图片应用
- CSS 工程化和预处理
- 单行多行文本溢出

### 布局场景

- px em rem
- 两列布局
- 三列布局
- 水平垂直居中
- 弹性布局相关

### 定位浮动

- 清除浮动的原因和方法
- BFC 创建和 margin 问题
- position 属性

### 手写案例

- 三角形 与梯形
- 扇形
- 0.5px 的线和小于 12px 的文字
  缩放scale
- 1px 问题

## css 样式引入

- 样式分类

  - 内部样式

    ```css
    <style type="text/css">
    /*css语句*/
    </style>
    注：使用style标记创建样式时，最好将该标记写在<head></head>;
    ```

  - 外部样式

    ```css
    方法一：
    <link rel="stylesheet" type="text/css" href="目标文件的路径及文件名全称" />
    方法二：
    <style type="text/css">
    @import url(目标文件的路径及文件名全称);
    </style>
    注：@和import之间没有空格 url和小括号之间也没有空格；必须结尾以分号结束；
    ```

    **区别**：

    - link 是 XHTML 标签，除了加载 CSS 外，还可以定义 RSS 等其他事务；@import 属于 CSS 范畴，只能加载 CSS。
    - link 引用 CSS 时，在页面载入时同时加载；@import 需要页面完全载入后才加载。
    - link 是 XHTML 标签，无兼容问题；@import 是在 CSS2.1 中提出的，低版本的浏览器不支持。
    - link 支持使用 JavaScript 控制 DOM 去改变样式；@import 不支持这样的操作（JavaScript 可以获取 link 标签元素，但获取不到@import，因为@import 只是一种 CSS 语法）

  - 行类样式

    - <标签 style=“属性属性值;属性:属性值;”></标签>

## 权重

  <table>
  <thead>
  <tr>
  <th>权重值</th>
  <th>选择器</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>1,0,0,0</td>
  <td>内联样式：style=""</td>
  </tr>
  <tr>
  <td>0,1,0,0</td>
  <td>ID选择器：<code>#idName{...}</code></td>
  </tr>
  <tr>
  <td>0,0,1,0</td>
  <td>类、伪类、属性选择器：<code>.className{...}</code> / <code>:hover{...}</code> / <code>[type="text"] ={...}</code></td>
  </tr>
  <tr>
  <td>0,0,0,1</td>
  <td>标签、伪元素选择器：<code>div{...}</code> / <code>:after{...}</code></td>
  </tr>
  <tr>
  <td>0,0,0,0</td>
  <td>通用选择器（*）、子选择器（&gt;）、相邻选择器（+）、同胞选择器（~）</td>
  </tr>
  </tbody>
  </table>

1. 先从高等级进行比较，高等级相同时，再比较低等级的，以此类推；
2. 完全相同的话，就采用 后者优先 原则；
3. `!important`的权重最大。如果出现了`!important`，则不管权重如何都取有`!important`的属性值。但是宽高有例外情况，由于宽高会被`max-width`/`min-width`覆盖，所以`!important`会失效

## 常用 css 选择器

- 基本选择器

<Image  src="/css/images/css_slect.png" />

- 关系选择器（层次）（~ + >）
  <Image  src="/css/images/css_relation.png" />

  ~选择元素下边的所有兄弟节点

  注意:兄弟选择器选中的是【E 标签之后】的所有兄弟 F

  只匹配第一层的子元素

- 动态伪类选择器

  - `E:link`: 结构伪类选择器 ，
  - `E:visited`
  - `E:active`
  - `E:hover`
  - `E:focus`
    <Image  src="/css/images/css_pseudo_class.png" />

- 目标伪类选择器

  - `E:target` : 锚点的目标元素被选中

  ```html
  div { margin-top: 600px; } :target h3 { color: #f00; }

  <a href="#html">html</a>
  <a href="#css">css</a>
  <a href="#js">js</a>
  <div id="html">
    <h3>html是什么</h3>
    <p>html是xxx</p>
  </div>
  <div id="css">
    <h3>css是什么</h3>
    <p>css是xxx</p>
  </div>
  <div id="js">
    <h3>js是什么</h3>
    <p>js是xxx</p>
  </div>

  // 点击链接对应的h3标签变色
  ```

- 语言伪类选择器

  ```css
  q:lang(no){quotes: "~" "~"}

  <p>:lang 伪类允许您为不同的语言定义特殊的规则。在下面的例子中，在下面的例子中，:lang 类为带有值为 "no" 的 lang 属性的 q 元素定义引号的类型：</p>
  <p>一些文本 <q lang="no">段落中的引用</q> 一些文本。</p>  // ...~段落中的引用~...

  ```

- UI 元素状态伪类选择器
  <Image  src="/css/images/css_active_class.png" />

  ```css
  :checked 选择的时候
  input[type="checkbox"]:checked+span{background:red;}
  <input type="checkbox"><span>span1</span>


  :enabled  可用状态
  input:enabled{background:#0F0;}
  <input type="text">
  <input type="text" disabled>
  <input type="text">


  :disabled	禁止状态
  input:disabled{background:#000;}
  <input type="text">
  <input type="text" disabled>
  <input type="text">

  :read-write  可读写的元素 （火狐不支持需要加前缀-moz-）
  input:-moz-read-write{background:#F00;}


  :read-only 	只读元素 （火狐不支持需要加前缀-moz-）
  input:read-only{background:#C63;}
  <input type="text" readonly>
  ：：selection 选中元素的一个操作（火狐不支持需要加前缀-moz-）
  ::selection{color:#f00}
  ：和：：的区别
  单冒号叫做伪类（指针对这个标签的一个动作），双冒号叫做伪元素（类似于将某一个东西加入在其他元素上）

  ```

- 结构伪类选择器

<Image  src="/css/images/css_structure_class.png" />

- 否定伪类选择器

  - `E:not(F)`: 匹配所有元素 F 的 E 元素

  - ```css
    div[contentEditable="true"]:empty:not(:focus):before {
      content: attr(data-placeholder);
      color: rgba(0, 0, 0, 0.25) !important;
    }
    ```

- 属性选择器

  - `E[attr]`: 表示存在 attr 属性即可：div [class]
  - `E[attr=val]`: 表示属性值完全等于 val：div [class=mydemo]
  - `E[attr^=val]`:表示的属性值里包含 val 字符并且在“开始”位置；div[class^=mydemo]
  - `E[attr$=val]`:表示的属性值里包含 val 字符并且在“结束”位置；div[class$=demos]
  - `E[attr*=val]`:表示的属性值里包含 val 字符并且在“任意”位置；div[class*=mydemo]

- 伪元素选择器
  - `E::first-line`:表示 E 元素中的第一行
  - `E::first-letter`:表示 E 元素中的第一个字符
  - `E::selection`:表示 E 元素在用户选中文字时。只能应用少量 CSS 属性：color、background、cursor 以及 outline。

## 盒模型

- 概念 ： 盒模型是 css 布局的基石，规定了网页元素如何显示以及元素间相互关系。css 定义所有的元素都可以拥有像盒子一样的外形和平面空间
- 分类

  - IE 盒模型： `box-sizing: border-box` 此模式下，元素的宽度（width）计算为`border+padding+content`的宽度总和
  - 标准盒模型：`box-sizing: content-box` 此模式下，元素的宽度（width）计算为`content`的宽度

- 组成：

  - 边框（border）

    - `border-width`属性的默认值是`3px`

    - `border-color`默认是跟随字体的颜色, 相当于默认设置了`border-color: currentColor`

    - 三角形

      ```css
      border: 20px solid;
      border-color: blue transparent transparent transparent;
      ```

  - 内容区(content)

  - 内填充(padding)

    - 含义: 在设定页面中一个元素内容到元素的边缘(边框) 之间的距离。
    - 作用
      - 用来调整内容在容器中的位置关系
      - 用来调整子元素在父元素中的位置关系。padding 属性需要添加在父元素上
    - 设置大小
      - padding:10px; 所有四个填充都是 10px
      - padding:10px 5px; 上下填充是 10px，右左填充是 5px
      - padding:10px 5px 15px; 上 10px， 右左填充是 5px，下 15px
      - padding:10px 5px 15px 20px; 上 右 下 左
    - 注意点
      - padding 不可以为负值
      - 背景会从 padding 的区域开始摆放，说明 background-position:0 0;在 padding 的左上角。

  - 外边距(margin)

    - 含义：在元素外边的空白区域，被称为边距
    - 设置大小：同 padding 一样
    - 注意点

      - margin 区域不应用背景
      - margin 可以为负数

    - 常见问题
      - 外边距合并: 当一个元素出现在另一个元素上面时，第一个元素的下外边距与第二个元素的上外边距会发生合并
      - margin 塌陷现象: 若一个大盒子中包含一个小盒子,给小盒子设 margin-top,大盒子会一起向下平移(解决方法： 1.加边框 2.触发 BFC)

## 定位

- static 静态的

  - position:static; 静态定位。
  - 所有的标准流（文档流）中的元素都是静态定位。Left、bottom、top、right 都是无效的。

- relative 相对定位

  - position:relative; 相对定位。
  - 使用的时候可配合：top,left,right,bottom 来使用。
  - 如果设置了相对定位以及 trbl 属性，那将来盒子会以其原本的位置发生偏移.
  - 设置了相对定位的元素,即使发生了偏移,在页面上还**占据着为变动前的位置**.

- absolute 绝对

  - position:absolute

  - 使用的时候可配合 trbl 属性来使用

  - 特点：

    (1) 如果绝对定位元素没有父元素或者是所有的父元素都没有定位，那么将来 trbl 是相对于 html 定位的；

    (2) 如果绝对定位的元素有祖先，而且祖先有定位（非 static），那么这个绝对定位的元素偏移是以自己的祖先为基础。

    (3) 绝对定位以后的元素会脱离标准流,**不占据原来的位置**.

- fixed 固定

  - position:fixed。

  - 使用的时候也要配合 trbl 属性来使用

  - 特点

  (1) 不管页面有多大，trbl 永远是相对于浏览器的可视区域来的。

  (2) 固定定位的元素也脱离了标准流（**不在页面上占据位置**）

  - 包含块
    - 包含块就是为定位元素提供坐标，偏移和显示范围的参照物，即确定绝对定位的偏移起点和百分比
      长度的参考
    - html 是一个大的包含块，所有绝对定位的元素都是根据窗口来定自己所处的位置和百分比大小的显示的，如果我们定义了包含元素为包含元素块以后，对于被包含的绝对定位元素来说，就会根据最接近的具有定位功能的上级包含元素来定位自己的显示位置

- sticky 粘性定位

  - position: sticky
  - 这是一个结合了 `position:relative` 和 `position:fixed` 两种定位功能于一体的特殊定位，适用于一些特殊场景。
  - 注意点
    - 须指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。
      - 并且 `top` 和 `bottom` 同时设置时，`top` 生效的优先级高，`left` 和 `right` 同时设置时，`left` 的优先级高。
    - 设定为 `position:sticky` 元素的任意父节点的 overflow 属性必须是 visible，否则 `position:sticky` 不会生效。这里需要解释一下：
      - 如果 `position:sticky` 元素的任意父节点定位设置为 `overflow:hidden`，则父容器无法进行滚动，所以 `position:sticky` 元素也不会有滚动然后固定的情况。
      - 如果 `position:sticky` 元素的任意父节点定位设置为 `position:relative | absolute | fixed`，则元素相对父元素进行定位，而不会相对 viewprot 定位。
    - 达到设定的阀值。这个还算好理解，也就是设定了 `position:sticky` 的元素表现为 `relative` 还是 `fixed` 是根据元素是否达到设定了的阈值决定的。

- **<font color="red">注意</font>**
  对于布局受 CSS 盒模型控制的元素，拥有 transform 属性的元素，其值除 none 以外的任何值都会导致元素为其所有后代建立一个包含块（containing block）。它将用于布局它的所有 absolute 定位后代、fixed 定位后代.

  上代码：

  ```html
  <style>
    .box {
      position: relative;
      border: 1px solid red;
      width: 100px;
      height: 100px;
    }
    .box .absolute {
      position: absolute;
      width: 20px;
      height: 20px;
      background: pink;
      left: 20px;
      top: 20px;
    }
    .box .fixed {
      position: fixed;
      width: 20px;
      height: 20px;
      background: greenyellow;
      left: 20px;
      top: 20px;
    }
    .box_transform {
      transform: translateZ(0px);
      width: 50px;
      height: 50px;
      background: blue;
      margin-left: 20px;
    }
  </style>
  <body>
    <div>transform 对定位的影响</div>
    <div class="box">
      <div class="box_transform">
        <div class="absolute"></div>
        <div class="fixed"></div>
      </div>
    </div>
  </body>
  ```

  当添加 transform 时效果如下：
  <Image  src="/css/images/css_fixed.png" />

  不添加 transform 时效果如下：
  <Image  src="/css/images/css_fixed_transform.png" />

## 浮动

- 定义：浮动元素会脱离标准流[高度塌陷]，不占据空间，但会影响其他元素的位置
- 特性
  - 浮动元素会向左或向右移动，直到它的外边缘碰到包含框或另一个浮动元素的边框为止。
  - 不受原有文档流的影响,同时无法影响原有父类
  - 浮动元素会脱离文档流，但不会脱离文本流，即不会脱离文档流中的文字
  - 浮动元素高度独立, 不在撑开父元素的高度
- 解决高度塌陷
  - 给父元素定义 heigth
  - 浮动的后面增加一个元素: 使用` clear: both;`清除浮动
  - 父级元素定义`overflow: hidden;`或者`overflow: auto;`触发 BFC
  - 父级元素增加伪元素: `clear: both;`清除浮动
  ```css
  .clearfix::after {
    content: "";
    display: table;
    clear: both;
  }
  ```

## BFC

- 定义： BFC(Block formatting context)直译为“块级格式化上下文”。它是一个独立的渲染区域，只有 Block-level box（块）参与， 它规定了内部的块如何布局，并且与这个区域外部毫不相干
- 特性
  - 内部的 Box 会在垂直方向，一个接一个地放置。
  - Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 会发生 margin 重叠。
  - 每个元素的 margin box 的左边， 与包含块 border box 的左边相接触
  - BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。应用场景：防止 margin 合并，对独立的 bfc 里面的子元素不会影响到外面的元素
  - 计算 BFC 的高度时，里面的浮动元素也参与计算（应用场景：清除浮动的第一种方式）
  - BFC 的区域不会与 float box 重叠。（应用场景：清除浮动的第二种方式）
- 创建方式

  - 根元素 html（独立的 BFC）
  - 浮动元素 (`float`不为`none`的元素)
  - 绝对定位元素 (元素的`position`为`absolute`或`fixed`)
  - display 为 inline-block, table-cell, table-caption, flex,
    inline-flex（css3）
  - overflow 的值不为 visible 的元素

- 问题

  - 使用 float 脱离文档流，高度塌陷

  ```html
  <style>
    .box {
      background: pink;
    }
    .box .float {
      width: 100px;
      background: red;
      margin: 20px;
      float: left;
      text-align: center;
      line-height: 100px;
    }
  </style>
  <body>
    <h1>BFC</h1>
    <div>浮动的影响</div>
    <div class="box">
      <div class="float">1</div>
      <div class="float">2</div>
    </div>
  </body>
  ```

  此时由于浮动的影响，box 盒子的高度为 0，未显示背景颜色：

  <Image  src="/css/images/css_bfc_float.png" />
  添加 `display: inline-block;`处方 BFC,显示背景颜色， 上面说到的方法都可以，只是取一起测试

  <Image  src="/css/images/css_bfc_float_bfc.png" />

  - margin 重叠

  ```html
  <style>
    .content {
      background: pink;
    }
    .box {
      width: 100px;
      background: red;
      text-align: center;
      line-height: 100px;
    }
    .box-1 {
      margin-bottom: 20px;
    }
    .box-2 {
      margin-top: 20px;
    }
  </style>
  <body>
    <h1>BFC</h1>
    <div>浮动的影响</div>
    <div class="content">
      <div class="box box-1">1</div>
      <div class="box box-2">2</div>
    </div>
  </body>
  ```

  两个盒子的 margin 合并了， 只有 20px,这就是 margin 合并的问题，此时取 margin 较大的值

     <Image  src="/css/images/css_bfc_margin.png" />

  **解决方式**

  - flex 布局处理【父元素和子元素，子元素与子元素】
    ```css
    display: flex;
    flex-direction: column;
    ```
    <Image  src="/css/images/css_bfc_margin_flex.png" />
  - 利用外层 padding 代替内部 margin，但是如果盒子有背景色的话，会受到影响【父元素和子元素，子元素与子元素】
  - 父元素增加 border【处理父元素和子元素 margin 合并】
  - 父元素设置 float【处理父元素和子元素 margin 合并】

- 作用
  - 清除浮动
  - 解决高度塌陷
  - 防止 margin 重叠
  - 实现两栏布局
  - 实现圣杯布局和双飞翼布局

## 元素的显示隐藏

- 总结

  - 如果希望元素不可见、不占据空间、资源会加载、DOM 可访问,但是渲染树中不会存在： `display: none`；

  - 如果希望元素不可见、不能点击、但占据空间、资源会加载，可以使用： `visibility: hidden`；

  - 如果希望元素不可见、不占据空间、显隐时可以又`transition`淡入淡出效果

    ```css
    div{
      position: absolute;
      visibility: hidden;
      opacity: 0;
      transition: opacity .5s linear;
      background: cyan;
    }
    div.active{
      visibility: visible;
      opacity: 1;
    }

    这里使用visibility: hidden而不是display: none，是因为display: none会影响css3的transition过渡效果。 但是display: none并不会影响css animation动画的效果。
    ```

  - 如果希望元素不可见、可以点击、占据空间，可以使用： `opacity: 0`；
  - 如果希望元素不可见、可以点击、不占据空间，可以使用： `opacity: 0; position: absolute;`
  - 如果希望元素不可见、不能点击、占据空间，可以使用： `position: relative; z-index: -1;`
  - 如果希望元素不可见、不能点击、不占据空间，可以使用： `position: absolute ; z-index: -1;`
  - clip 裁剪 占据空间
  - transform: scale(0) 缩放 占据空间

- display:none 和 visibility:hidden 的区别

  - `display: none`的元素不占据任何空间，渲染树中不会存在，DOM 树存在，`visibility: hidden`的元素空间保留；

  - `display: none`会影响 css3 的`transition`过渡效果，`visibility: hidden`不会；

  - `display: none`隐藏产生重绘 ( repaint ) 和回流 ( relfow )，`visibility: hidden`只会触发重绘；

  - 株连性：`display: none`的节点和子孙节点元素全都不可见，`visibility: hidden`的节点的子孙节点元素可以设置 `visibility: visible`显示。`visibility: hidden`属性值具有继承性，所以子孙元素默认继承了`hidden`而隐藏，但是当子孙元素重置为`visibility: visible`就不会被隐藏。

- [对应测试代码](https://gitee.com/sky__bear/vue-press-demo/blob/master/base/css/demo5.html)

## width:auto 和 height:auto

- width 和 height 的默认值都为 auto

- 块级元素的 width 默认撑满父元素宽度， 内联元素的宽度有子元素决定
- 块级元素和内联元素的默认高度都有子元素决定
- 如果块级元素的 width 设置成 auto, magin 为固定值，则 width 会撑满父元素剩余的宽度， 如果 width 固定，`margin:auto`,则 margin 会撑满剩余空间，且元素水平居中

## flex 布局 [flex](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

flex 布局就是弹性布局， 用来为盒模型提供最大的灵活性

**容器属性**

- flex-direction 主轴的方向 `row | row-reverse | column | column-reverse`; 默认 row 水平向右

- flex-wrap 如果一条轴线排不下，如何换行 `nowrap | wrap | wrap-reverse`; 默认不换行

- flex-flow `flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`

- justify-content 定义了项目在主轴上的对齐方式 `flex-start | flex-end | center | space-between | space-around` 默认 flex-start 左对齐

- align-items 定义项目在交叉轴上如何对齐 `flex-start | flex-end | center | baseline | stretch（拉伸）` 默认 stretch

- align-content 定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用

  `flex-start | flex-end | center | space-between | space-around | stretch`默认 stretch

**项目属性**

- `order` 属性定义项目的排列顺序。数值越小，排列越靠前，默认为 0

- `flex-grow` 定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大

- `flex-shrink` 定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。

- `flex-basis` 定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小

- `flex` 是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。

  该属性有两个快捷值：`auto` (`1 1 auto`) 和 none (`0 0 auto`)。

- `align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

## css 工程化与预处理器

- 预处理器:less scss => 利用编译库提供的能力,提供层级,函数,变量,mixin 等能力,最终编译成 css
- 后处理器: postCss => 利用后处理编译,属性增加前缀, 实现浏览器兼容

## 常见 CSS 布局单位、区别和使用场景

### 文本溢出截断省略

- **单行省略**

  - css 语句
    - `overrflow: hidden`；（文字长度超出限定宽度，则隐藏超出的内容）
    - `white-space: nowrap`；（设置文字在一行显示，不能换行）[有宽度就会换行,加这个防止换行]
    - `text-overflow: ellipsis`；（规定当文本溢出时，显示省略符号来代表被修剪的文本）
  - 优点
    - 无兼容问题
    - 响应式截断
    - 文本溢出范围才显示省略号，否则不显示省略号
    - 省略号位置显示刚好
  - 缺点
    - 只支持单行文本截断

- **多行文本溢出省略(纯 css)**

  - css 语句
    - -webkit-line-clamp: 2；（用来限制在一个块元素显示的文本的行数, 2 表示最多显示 2 行。 为了实现该效果，它需要组合其他的 WebKit 属性）
    - display: -webkit-box；（和 1 结合使用，将对象作为弹性伸缩盒子模型显示 ）
    - -webkit-box-orient: vertical；（和 1 结合使用 ，设置或检索伸缩盒对象的子元素的排列方式 ）
    - overflow: hidden；（文本溢出限定的宽度就隐藏内容）
  - 优点
    - 响应式截断
    - 文本溢出范围才显示省略号，否则不显示省略号
    - 省略号显示位置刚好
  - 缺点
    - 兼容性一般： -webkit-line-clamp 属性只有 WebKit 内核的浏览器才支持

- **js 实现方案**

  - 优点

    - 无兼容问题
    - 响应式截断
    - 文本溢出范围才显示省略号，否则不显示省略号

  - 缺点

    - 需要 JS 实现，背离展示和行为相分离原则
    - 文本为中英文混合时，省略号显示位置略有偏差

  - 代码

    ```js
    const text =
      " 这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文本";
    const totalTextLen = text.length;
    const formatStr = () => {
      const ele = document.getElementsByClassName("demo")[0];
      const lineNum = 2;
      const baseWidth = window.getComputedStyle(ele).width;
      const baseFontSize = window.getComputedStyle(ele).fontSize;
      const lineWidth = +baseWidth.slice(0, -2);

      // 所计算的strNum为元素内部一行可容纳的字数(不区分中英文)
      const strNum = Math.floor(lineWidth / +baseFontSize.slice(0, -2));

      let content = "";

      // 多行可容纳总字数
      const totalStrNum = Math.floor(strNum * lineNum);

      const lastIndex = totalStrNum - totalTextLen;

      if (totalTextLen > totalStrNum) {
        content = text.slice(0, lastIndex - 3).concat("...");
      } else {
        content = text;
      }
      ele.innerHTML = content;
    };

    formatStr();

    window.onresize = () => {
      formatStr();
    };
    ```

- **多行文本溢出省略（按高度）**

  - css 语句
    - overflow: hidden；（文本溢出限定的宽度就隐藏内容）
    - line-height: 20px；（结合元素高度，高度固定的情况下，设定行高， 控制显示行数）
    - max-height: 40px；（设定当前元素最大高度）
  - 优点
    - 无兼容问题
    - 响应式截断
  - 短板
    - 单纯截断文字, 不展示省略号，观感上较为生硬

- **伪元素+定位实现多行省略**（效果太差）

  - 代码

    ```css
    .demo {
      position: relative;
      line-height: 20px;
      height: 40px;
      overflow: hidden;
    }
    .demo::after {
      content: "...";
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 0 20px 0 10px;
    }
    ```

  - 优点

    - 无兼容问题
    - 响应式截断

  - 缺点

    - 无法识别文字的长短，无论文本是否溢出范围, 一直显示省略号, 必须要直知道固定行高
    - 省略号显示可能不会刚刚好，有时会遮住一半文字

[参考文章]： [文本溢出截断省略](https://juejin.im/post/5dc15b35f265da4d432a3d10)

### 布局单位 [掘进](https://zhuanlan.zhihu.com/p/547003009)

- 多单位的布局差别
  百分比: 子元素的百分比相对于直接父元素的对应属性
  em: 相对于父元素的字体大小的倍数
  rem: 相对于根元素的字体大小的倍数
  vw/vh: 相对于视口宽高
  vmin/vmax: 相对于视口宽高中较小/较大的值
- 如何利用 rem 实现响应式
  根据当前设备的视窗宽度与设计稿的宽度得到一个比例
  根据比例设置根节点的 font-size
  所有的长度都用 rem 布局

### 布局手写
查看example 5.html
- 两列布局
  - 浮动+生成BFC不重叠
  - (绝对定位)
  - flex 布局
- 三列布局
  - flex
  - 绝对布局
  - 浮动
- 圣杯布局
- 水平剧中
  - 绝对定位
  ```css
  div {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: red
    }
  ```
  - 自我拉扯
   ```css
  div {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      background-color: red
    }
  ```
 - flex 布局    


## 常见面试问题[掘进](https://juejin.cn/post/6936913689115099143#heading-35)

## 常见面试方式

相对零散 从点到面

### display

- display 属性

  - none
  - block
  - inline
  - inline-block
  - flex
  - grid
  - inherit 继承

- inline-block 和 block inline 的区别

  - block 块级元素（Block-level element）会占据其父容器的整个宽度，并且在其前后都会换行
    - 独占一行
    - 宽度默认 100%
    - 高度、内边距（padding）、外边距（margin）等属性都可以正常生效
    - 可以自动换行
    - 默认情况下，块级元素是垂直方向排列的
    - 常见元素： `div p h1~h6 ul li`
  - inline-block 行内块级元素（Inline-block element）既具有块级元素的特点，又具有行内元素的特点
    - 不独占一行
    - 宽度默认由内容撑开
    - 高度、内边距（padding）、外边距（margin）等属性都可以正常生效
  - inline 行内元素（Inline element）不会占据其父容器的整个宽度，并且在其前后不会换行
    - 不独占一行
    - 宽度默认由内容撑开，无法设置宽高
    - 高度、内边距（padding-top/padding-bottom）和外边距（margin-top/margin-bottom）等属性水平有效， 垂直无效
    - 不会自动换行
    - 常见元素：`span a img input em i `

- 切换方式
  - display
  - float : 设置浮动后，会自动成为 display :block =》去除行内元素之间的空白问题
  - position : 设置 absolute/ fixed 后，会自动成为 display :block

### 可以继承的属性有哪些

- 字体
  - font-family, font-weight, font-size, font-style
- 文本
  - text-indent, text-align, line-height, color,word-spacing,letter-spacing
- 元素
  - visibility
- 列表布局
- list-style
- 光标
  - cursor

### 隐藏和显示相关

- 哪些可以隐藏元素？ 区别是什么？
  参考上面的元素显示隐藏

### 伪元素和伪类的区别

- 伪元素:
  - 常见
    - ::before
    - ::after
    - ::first-letter
    - ::first-line
  - 伪元素用于创建一些不在文档树中的元素，并为其添加样式, 只存在于 CSS 中
  - 使用双冒号
- 伪类 选中元素的某种状态或特定位置的元素
  - 常见
    - :hover
    - :active
    - :focus
    - :first-child
    - :last-child
    - :nth-child(n)
    - :nth-last-child(n)
    - :nth-of-type(n)
    - :nth-last-of-type(n)
  - 使用单冒号
  - 伪类用于当已有元素处于某个状态时，为其添加对应的样式

### 图片格式

有哪些? 怎么应用?怎么选择?

- 常见图片格式

  - JPEG
    - 优点：压缩率高，适合大图, 直接色存储,适合还原度要求高的图片
    - 缺点：不支持透明度，不支持动画
  - PNG-8
    - 优点：无损,支持透明度,体积优秀, 使用索引色
    - 缺点：对于包含大量颜色的图像，文件大小可能比 JPEG 大。
  - PNG-24
    - 优点：无损,支持透明度,直接色存储,压缩
    - 缺点：对于包含大量颜色的图像，文件大小可能比 JPEG 大。
  - GIF
    - 优点: 无损,支持动画效果
    - 缺点: 颜色限制为 256 种颜色
  - SVG
    - 优点: 矢量格式，可以无限缩放而不失真。适合做 logo,图标等
    - 缺点: 对于复杂的图像或照片，SVG 可能不如位图格式（如 JPEG 或 PNG）清晰
  - WebP
    - 优点:提供无损和有损压缩选项，可以生成比 JPEG 和 PNG 更小的文件, 使用直接色
    - 缺点不是所有浏览器都原生支持 WebP 格式，需要额外的库或插件支持
  - BMP:
    - 优点:无损的，几乎不进行压缩
    - 缺点:图片文件较大

- 精灵图(雪碧图)
  所有涉及到的图片放到一张大图中, 使用 background-position 来定位
  <br />
  提高加载性能

### 像素密度与图片应用

#### 基础

`window.devicePixelRatio`:是一个浏览器提供的只读属性，用于表示当前显示设备的物理像素与 CSS 像素之间的比例关系
window.devicePixelRatio 表示每个 CSS 像素对应多少个物理像素。
例如：

- 如果 devicePixelRatio = 1，则 1 个 CSS 像素对应 1 个物理像素。
- 如果 devicePixelRatio = 2，则 1 个 CSS 像素对应 4 个物理像素（2x2）。
- 如果 devicePixelRatio = 3，则 1 个 CSS 像素对应 9 个物理像素（3x3）。

#### 如何在图片的加载上应用

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
