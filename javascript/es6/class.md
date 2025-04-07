# calss

## 私有属性实现

```js
// 闭包实现
class Person {
  constructor(name) {
    let name;
    this.getName = function () {
      return name;
    };
    this.setName = function (newName) {
      name = newName;
    };
  }
}
```
