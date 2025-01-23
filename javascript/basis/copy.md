# javascript 的深浅复制

## 数据类型

javascript 的数据类型分为基本数据类型合引用数据类型。

基本数据类型：

- Number
- String
- Boolean
- Undefined
- Null
- Symbol(ES6 新增)

基本数据类型存放在栈中， 引用数据类型存放堆在， 但是在栈中有一个指针指向在堆内存的地址

## 深浅复制

`javascript`的复制分为深拷贝和浅拷贝。

对于基本数据类型来说，没有什么深浅复制， 复制的时候直接复制在栈中的数据，但是对于引用数据而言， 分为深浅复制， **浅复制**指的是只复制了存放在栈中的引用地址， 此时复制的变量依然存放在栈中，但是和原来的变量依然指向同一个堆中的对象， 因此， 改变任何一个变量，都会受到影响， **深复制**指的是复制存放在堆中的对象， 在栈中添加一个地址指向新复制的对象， 此时的两个变量分别指向不同的对象，任何操作都不会影响到另一对象。

```JS
// 基本数据类型
let a = 1;
let b = a;
b = 3;
console.log(a, b); // 1 3

// 引用数据类型
// 浅复制
const obj_1 = { a: 1 };
const obj_2 = obj_1;
obj_2.a = 2;
console.log(obj_1, obj_2); // {a: 2} {a: 2}

// 深复制
const obj_3 = JSON.parse(JSON.stringify(obj_1));
obj_3.a = 3;
console.log(obj_1, obj_3); // {a: 2} {a: 3}
```

## 对象浅拷贝

- 扩展运算符`...` ES6 提供的方法

  ```js
  const obj_4 = { a: 1, b: { c: 1 } };
  const obj_5 = { ...obj_4 };
  obj_4.a = 2;
  obj_4.b.c = 2;
  console.log(obj_4, obj_5);
  // {a: 2,b: {c: 2}}   {a: 1,b: {c: 2}}
  ```

  我们可以看出扩展运算符指复制了第一层的对象， 如果对象包含其他的对象作为自己的属性值的话， 依然保持共享引用

- `Object.assign()` `（Object.assign(target, scource ....) ）`

  接受任意数量的源对象，将源对象自身的并且可枚举的属性合到目标对象， 因此我们使用一个空对象就可以实现复制

  ```js
  const obj_6 = { a: 1, b: { c: 1 } };
  const obj_7 = Object.assign({}, obj_6);
  obj_6.a = 2;
  obj_6.b.c = 2;
  console.log(obj_6, obj_7);
  // {a: 2,b: {c: 2}}   {a: 1,b: {c: 2}}
  ```

## 对象的深拷贝

- `JSON.parse()`

  ```js
  const obj_8 = { a: 1, b: { c: 1 } };
  const obj_9 = JSON.parse(JSON.stringify(obj_8));
  obj_8.a = 2;
  obj_8.b.c = 2;
  console.log(obj_8, obj_9);
  // {a: 2,b: {c: 2}}   {a: 1,b: {c: 1}}
  ```

  利用`JSON.stringify`将某个值序列化为一个字符串值,在用`JSON.parse`将字符串值转换为对象，但是使用此方法有很大的缺点：

  - `JSON.stringify`在序列化的时候对某些数据处理不够友善

    - undefined 的值，Symbol,函数或者 XML 值会被忽略

    - 如果你的数组当中含有 undefined 值，函数或 XML 值，该数组中的这些值将会被当成 null

      ```JS
      const fn = () => console.log(1);
      const obj_10 = { a: undefined, b: fn, c: [undefined, fn],f: Symbol()};
      console.log(JSON.stringify(obj_10));
      {"c":[null,null]}
      ```

    - 正则对象会转成空对象

      ```js
      JSON.stringify(/foo/); // "{}"
      ```

    - 忽略对象的不可遍历属性

    - 如果对象中有引用对象则会报错（后续有介绍）

- 递归(循环引用报错)

  ```js
  function deepClone(data) {
    const basicData = [
      "[object String]",
      "[object Number]",
      "[object Boolean]",
      "[object Undefined]",
      "[object Null]"
    ];
    if (basicData.includes(Object.prototype.toString.call(data))) return data;
    let result;
    if (Object.prototype.toString.call(data) === "[object Array]") {
      result = [];
      data.forEach(item => {
        result.push(deepClone(item));
      });
      return result;
    }
    if (Object.prototype.toString.call(data) === "[object Object]") {
      result = {};
      Object.entries(data).forEach(([key, value]) => {
        result[key] = deepClone(value);
      });
      return result;
    }
  }
  ```

## 对象的循环引用

- 父级引用

  ```js
  const obj_11 = { a: 1 };
  obj_11.b = obj_11;
  console.log(JSON.stringify(obj_11));
  //  Converting circular structure to JSON
  console.log(deepClone(obj_11));
  // Maximum call stack size exceeded
  ```

### 解决循环递归爆栈(依然不能复制)

用循环遍历一棵树，需要借助一个栈，当栈为空时就遍历完了，栈里面存储下一个需要拷贝的节点首先我们往栈里放入种子数据，key用来存储放哪一个父元素的那一个子元素拷贝对象然后遍历当前节点下的子元素，如果是对象就放到栈里，否则直接拷贝 只能解决爆栈，但是依然无法解决循环引用

```js
function deepCloneObj(x) {
    let num = 1;
    const root = {};
    const loopList = [
        {
            parent: root,
            key: undefined,
            data: x
        }
    ];
    while (loopList.length) {
        num += 1;
        console.log(num);
        const node = loopList.pop();
        const parent = node.parent;
        const key = node.key;
        const data = node.data;

        // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent;
        if (typeof key !== "undefined") {
            parent[key] = {};
            res = parent;
        }
        Object.keys(data).forEach(key => {
            if (
                Object.prototype.toString.call(data[key]) === "[object Object]"
            ) {
                loopList.push({
                    parent: res,
                    key,
                    data: data[key]
                });
            } else {
                res[key] = data[key];
            }
        });
    }
    return root;
}
  // 不会报错
```

### 解决循环引用的深复制

```js
function cloneForce(x) {
    const uniqueList = []; // 用来去重

    let root = {};

    // 循环数组
    const loopList = [
        {
            parent: root,
            key: undefined,
            data: x
        }
    ];

    while (loopList.length) {
        // 深度优先
        const node = loopList.pop();
        const parent = node.parent;
        const key = node.key;
        const data = node.data;

        // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent;
        if (typeof key !== "undefined") {
            res = parent[key] = {};
        }
        // 数据已经存在
        let uniqueData = find(uniqueList, data);
        if (uniqueData) {
            parent[key] = uniqueData.target;
            continue; // 中断本次循环
        }

        // 数据不存在
        // 保存源数据，在拷贝数据中对应的引用
        uniqueList.push({
            source: data,
            target: res
        });

        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                if (typeof data[k] === "object") {
                    // 下一次循环
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k]
                    });
                } else {
                    res[k] = data[k];
                }
            }
        }
    }

    return root;
}

function find(arr, item) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].source === item) {
            return arr[i];
        }
    }
    return null;
}
```



## 本文参考:

[有意思的 JSON.parse(),JSON.string()](https://juejin.im/post/5be5b9f8518825512f58ba0e#heading-4)

[深拷贝的终极探索](<https://juejin.im/post/5bc1ae9be51d450e8b140b0c#heading-4>)

