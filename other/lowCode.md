# 低代码

## 架构

- 样式隔离： iframe, div
  iframe:
  - 是存粹的物理隔离
  - 样式和脚本无法共享,需要考虑内外通信的问题
    div:
  - 是逻辑隔离，内外样式可能相互影响
  - 样式和脚本可以共享， 不需要单独通信
- 是否使用第三方库
- 数据模型

## 数据模型

### 中间页面数据模型

```js
const data = {
  title:"",
  url:""，  // 是否要考虑版本
  status: 0, // 0:未发布 1:已发布 2:已下线
  createTime: "", // 创建时间
  updateTime: "", // 更新时间
  author: "", // 作者
  version: "", // 版本
  desc: "", // 描述
  style: {
    backgroundColor: "", // 背景颜色
  }, // 顶层样式
  components:[
    {
      name:"", // 名称
      componentName:"Text", // 组件名称 组件句柄
      configName:"TextConfig", // 配置名称
      settings:{
        content:"标题文本"，// 配置内容
        style:{
          fontSize: "12px", // 驼峰， 可以直接使用
        },
      }
    }
  ]
}
```

### 组件数据模型
```js
const dat = [
  {
    name: "Text",
    icon: "",
    limit: 1, // 限制数量
    componentName:"" // 组件名称
  }
]
```