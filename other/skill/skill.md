# 技巧

## html

### 伪类换行 after

使用 after 进行换行, 这里`content` 属性中的 `\A` 被解析为换行符,`white-space: pre;` 告诉浏览器保留空白字符和换行符,如果不设置 `white-space`，`\A` 不会被渲染为换行

```html
<h2>
  <span class="primary">Tip, tricks, best practices</span>
  <span>of front-end development</span>
</h2>
```

```css
.primary::after {
  content: "\A";
  white-space: pre;
}
```

## css

### 伪类组合选择器

```css
header a:hover,
nav a:hover,
footer a:hover {
  text-decoration: underline;
}
```

```css
:is(header, nav, footer) a:hover {
  text-decoration: underline;
}
```

### 自定义光标样式

```css
.demo__cursor {
  /* Custom cursor */
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewport="0 0 48 48" style="fill:black;font-size:24px"><text y="50%">🚀</text></svg>')
      16 0, auto;
  /* Center the content */
  align-items: center;
  display: flex;
  justify-content: center;
  /* Size */
  height: 16rem;
  width: 16rem;
  /* Misc */
  border: 1px solid rgba(0, 0, 0, 0.2);
}
```

```html
<div class="demo__cursor"></div>
```


## js
#### 数组追加
```js
var array1 = [12 , "foo" , {name "Joe"} , -2458];
var array2 = ["Doe" , 555 , 100];
Array.prototype.push.apply(array1, array2);
/* array1 值为  [12 , "foo" , {name "Joe"} , -2458 , "Doe" , 555 , 100] */
```