# ES5

## 历史

1995 年，ECMAScript 1.0 发布。

1997 年，ECMAScript 2.0 发布。

1998 年，ECMAScript 2.1 发布（这个版本没有大的变化，主要是修订规范文档）。

1999 年，ECMAScript 3.0 发布，成为 JavaScript 的标准。

## 数据类型

### 数据类型

JavaScript 的数据类型，共有六种。

- 数值（number）：整数和小数（比如 1 和 3.14）
- 字符串（string）：字符组成的文本（比如"Hello World"）
- 布尔值（boolean）：true（真）和 false（假）两个值
- undefined：表示“未定义”或不存在，即声明了变量，但是没有赋值
- null：表示“空”或“无”，即此处的值是空值
- 对象（object）：各种值组成的集合

:::tip

- typeof 运算符(可以用来检查未声明的变量)
- instanceof 运算符
- Object.prototype.toString 方法
  :::

### null undefined 布尔值

```js
Number(null); // 0
5 + null; // 5
```

区别

- null 表示空值，即该处的值是空值。
- undefined 表示“未定义”，即该处目前没有值。

可以转换成布尔值的有

- undefined
- null
- false
- 0
- NaN
- ""或''（空字符串）

### 数值

#### 数值精度

根据国际标准 IEEE 754，JavaScript 浮点数的 64 个二进制位，从最左边开始，是这样组成的。

- 第 1 位：符号位，0 表示正数，1 表示负数
- 第 2 位到第 12 位（共 11 位）：指数部分
- 第 13 位到第 64 位（共 52 位）：小数部分（即有效数字）
  符号位决定了一个数的正负，指数部分决定了数值的大小，小数部分决定了数值的精度。

指数部分一共有 11 个二进制位，因此大小范围就是 0 到 2047。IEEE 754 规定，如果指数部分的值在 0 到 2047 之间（不含两个端点），那么有效数字的第一位默认总是 1，不保存在 64 位浮点数之中。也就是说，有效数字这时总是 1.xx...xx 的形式，其中 xx..xx 的部分保存在 64 位浮点数之中，最长可能为 52 位。因此，JavaScript 提供的有效数字最长为 53 个二进制位。

#### 数值范围

根据标准，64 位浮点数的指数部分的长度是 11 个二进制位，意味着指数部分的最大值是 2047（2 的 11 次方减 1）。也就是说，64 位浮点数的指数部分的值最大为 2047，分出一半表示负数，则 JavaScript 能够表示的数值范围为 21024 到 2-1023（开区间），超出这个范围的数无法表示。

如果一个数大于等于 2 的 1024 次方，那么就会发生“正向溢出”，即 JavaScript 无法表示这么大的数，这时就会返回 Infinity。

#### NaN

- Number 类型
- `NaN`不等于任何值，包括它本身。

#### 全局方法

- parseInt
  - parseInt 方法用于将字符串转为整数（不是字符串的先转字符串）
  - 第二个参数是进制(2 到 36 之间), 超出范围返回 NaN【如果第二个参数是 0、undefined 和 null，则直接忽略】
- parseFloat
  - parseFloat 方法用于将一个字符串转为浮点数。（不是字符串的先转字符串）
  - parseFloat 方法会自动过滤字符串前后的空格。
- isNaN
  - isNaN 方法可以用来判断一个值是否为 NaN。
  - isNaN 只对数值有效，如果传入其他值，会被先转成数值。比如，传入字符串的时候，字符串会被先转成 NaN，所以最后返回 true，这一点要特别小心。
- isFinite

### 字符串

- length
  一个长度是 2 个字节， 基于历史原因会有四个字节符号

```js
"𝌆".length; // 2
```

### 对象

- in
  - in 运算符用于检查对象是否包含某个属性
  - in 运算符的一个问题是，它不能识别哪些属性是对象自身的，哪些属性是继承的
- for...in
  - 它遍历的是对象所有可遍历（enumerable）的属性，会跳过不可遍历的属性。
  - 它不仅遍历对象自身的属性，还遍历继承的属性。
  - 返回的是键名

### 函数

过

### 数组

- 数组的本质是一种特殊的对象
- JavaScript 使用一个 32 位整数，保存数组的元素个数。这意味着，数组成员最多只有 4294967295 个（2^32- 1）
- length 属性的值总是比最大的那个整数键大 1

```js
const arr = ["a", "b"];
arr.length; // 2

arr[2] = "c";
arr.length; // 3

arr[9] = "d";
arr.length; // 10

arr[1000] = "e";
arr.length; // 1001
```

- 清空数组的方法是`length`设置为 0

```js
var a = [];

a["p"] = "abc";
a.length; // 0

a[2.1] = "abc"; // 本质还是对象
a.length; // 0
```

- 数组空位
  - 数组的空位指，数组的某一个位置没有任何值。比如，Array 构造函数返回的数组都是空位。
    ```js
    var a = [1, , 1];
    a.length; // 3
    ```
  - 空位不是 undefined，一个位置的值等于 undefined，依然是有值的。空位是没有任何值，in 运算符可以说明这一点。
  - 空位是没有任何值的，这个位置的值就是 undefined。
  - ES5 对空位的处理，已经很不一致了，大多数情况下会忽略空位。
  - ES6 则是明确将空位转为 undefined。
- 类数组
  - arguments

## 运算符

### 算数运算符

- `+ - *  / ++x --x  x-- x++ % **`
- 加法运算符是在运行时决定，到底是执行相加，还是执行连接. 其他所有所有运算子一律转为数值，再进行相应的数学运算
- 如果是对象,必须先转成原始类型的值, 先调用 `valueOf`,再`toString`
  - 对象的`valueOf`方法总是返回对象自身
  - 对象 obj 转成原始类型的值是`[object Object]`
- 特例: 运算子是一个 Date 对象的实例，那么会优先执行 toString 方法

  ```js
  var obj = new Date();
  obj.valueOf = function () {
    return 1;
  };
  obj.toString = function () {
    return "hello";
  };

  obj + 2; // "hello2"
  ```

### 比较运算符

- 基础
  - `>` 大于运算符
  - `<` 小于运算符
  - `<=` 小于或等于运算符
  - `>=` 大于或等于运算符
  - `==` 相等运算符
  - `===` 严格相等运算符
  - `!=` 不相等运算符
  - `!==` 严格不相等运算符
- 非相等运算符：字符串比较
  - 字符串按照字典顺序
- 非相等运算符：非字符串的比较

  - 原始类型:
    - 如果两个运算子都是原始类型的值，则是先转成数值再比较
    - 任何值（包括 NaN 本身）与 NaN 使用非相等运算符进行比较，返回的都是 false
  - 对象:须先转成原始类型的值, 先调用 `valueOf`,再`toString`, 都是字符串就按照字符串比较, 反之转换

    ```js
    var x = [2];
    x > "11"; // true
    // 等同于 [2].valueOf().toString() > '11'
    // 即 '2' > '11'

    [2] > 11; // false

    x.valueOf = function () {
      return "1";
    };
    x > "11"; // false
    // 等同于 (function () { return '1' })() > '11'
    // 即 '1' > '11'
    ```

- 严格相等运算符
  - 严格相等
    - 如果两个值的类型不同，直接返回`false`
    - 同一类型的原始类型的值（数值、字符串、布尔值）比较时，值相同就返回`true`，值不同就返回`false`
    - 符合类型:比较它们是否指向同一个地址
  - 严格不等:就是严格相等取反
- 相等运算符

  - 原始类型值: 原始类型的值会转换成数值再进行比较。
  - 对象与原始类型值比较:先调用对象的`valueOf()`方法，如果得到原始类型的值，就按照上一小节的规则，互相比较；如果得到的还是对象，则再调用`toString()`方法，得到字符串形式，再进行比较, 字符串再转数值比较
  - `undefined`和`null`只有与自身比较，或者互相比较时，才会返回`true`；与其他类型的值比较时，结果都为`false`

    ```js
    undefined == undefined; // true
    null == null; // true
    undefined == null; // true

    false == null; // false
    false == undefined; // false

    0 == null; // false
    0 == undefined; // false
    ```

### 布尔运算符

- 取反运算符：`!`
  - 只有 6 个取反为 true: `空字符串('') undefined null  0 false NaN`
- 逻辑与：`&&`:如果第一个运算子的布尔值为 true，则返回第二个运算子的值（注意是值，不是布尔值）；如果第一个运算子的布尔值为 false，则直接返回第一个运算子的值，且不再对第二个运算子求值

  ```js
  "t" && ""; // ""
  "t" && "f"; // "f"
  "t" && 1 + 2; // 3
  "" && "f"; // ""
  "" && ""; // ""

  var x = 1;
  1 - 1 && (x += 1); // 0
  x; // 1
  ```

- 逻辑或：`||`:如果第一个运算子的布尔值为 true，则直接返回第一个运算子的值，且不再对第二个运算子求值；如果第一个运算子的布尔值为 false，则返回第二个运算子的值
- 三元运算符：`?:`

## 语法专题

### 数据类型的转换

- 强制转换 :`Number() String() Boolean()`

  - `Number()`

    - 原始值

      - 字符串转为数值, 只要有一个字符无法转成数值，整个字符串就会被转为 NaN

      ```js
      // 数值：转换后还是原来的值
      Number(324); // 324

      // 字符串：如果可以被解析为数值，则转换为相应的数值
      Number("324"); // 324

      // 字符串：如果不可以被解析为数值，返回 NaN
      Number("324abc"); // NaN

      // 空字符串转为0
      Number(""); // 0

      // 布尔值：true 转成 1，false 转成 0
      Number(true); // 1
      Number(false); // 0

      // undefined：转成 NaN
      Number(undefined); // NaN

      // null：转成0
      Number(null); // 0
      ```

    - 对象
      - 调用对象自身的`valueOf`方法。如果返回原始类型的值，则直接对该值使用 Number 函数，不再进行后续步骤
      - 如果`valueOf`方法返回的还是对象，则改为调用对象自身的 toString 方法。如果 toString 方法返回原始类型的值，则对该值使用 Number 函数，不再进行后续步骤
      - 如果 toString 方法返回的还是对象，就报错

  - `String()`

    - 原始类型
      - 数值：转为相应的字符串
      - 字符串：还是原来的字符串
      - 布尔值：true 转为字符串"true"，false 转为字符串"false"
      - undefined：转为字符串"undefined"
      - null：转为字符串"null"
    - 对象
      - 先调用对象自身的 toString 方法。如果返回原始类型的值，则对该值使用 String 函数，不再进行以下步骤。
      - 如果 toString 方法返回的是对象，再调用原对象的 valueOf 方法。如果 valueOf 方法返回原始类型的值，则对该值使用 String 函数，不再进行以下步骤。
      - 如果 valueOf 方法返回的是对象，就报错

  - `Boolean()`

    - 原始类型值
      - 除了以下六个值，其他都是 true
        - undefined
        - null
        - false
        - 0
        - NaN
        - ""（空字符串）
    - 对象:所有对象（包括空对象）的布尔值都是 true

- 自动转换

  - 不同类型的数据相互运算
  - 非布尔值类型的数据求布尔值
  - 非数值类型的值使用一元运算符（即+和-）

- 自动转换为布尔值
  - 布尔运算符`!`后面接一个表达式，会将其转为布尔值
  - 条件运算符`?:`的第一个运算子
  - `if`语句的条件部分

### 错误机制处理

- 基础：
  `Error`：基础,
- 派生

  - `SyntaxError`:对象是解析代码时发生的语法错误 ，解析阶段就可以发现
  - `ReferenceError`:
    - 对象是引用一个不存在的变量时发生的错误
    - 将一个值分配给无法分配的对象，比如对函数的运行结果赋值
  - `RangeError`:象是一个值超出有效范围时发生的错误
  - `TypeError`:对象是变量或参数不是预期类型时发生的错误。比如，对字符串、布尔值、数值等原始类型的值使用 new 命令，就会抛出这种错误，因为 new 命令的参数应该是一个构造函数
  - `URIError`:对象是 URI 相关函数的参数不正确时抛出的错误，主要涉及 encodeURI()、decodeURI()、encodeURIComponent()、decodeURIComponent()、escape()和 unescape()这六个函数
  - `EvalError` :eval 函数没有被正确执行时

- `throw `:手动中断程序执行，抛出一个错误
- `try...catch`: 允许对错误进行处理，选择是否往下执行。
- `finally`:表示不管是否出现错误，都必需在最后运行的语句。

  ```js
  var count = 0;
  function countUp() {
    try {
      return count;
    } finally {
      count++;
    }
  }

  console.log(countUp()); // 0
  console.log(count); // 1
  ```

  `return`语句的执行是排在`finally`代码之前，只是等`finally`代码执行完毕后才返回。

  ```js
  function f() {
    try {
      console.log(0);
      throw "bug";
    } catch (e) {
      console.log(1);
      return true; // 这句原本会延迟到 finally 代码块结束再执行
      console.log(2); // 不会运行
    } finally {
      console.log(3);
      return false; // 这句会覆盖掉前面那句 return
      console.log(4); // 不会运行
    }

    console.log(5); // 不会运行
  }

  var result = f(); // 0 1 3 false
  console.log(result);
  ```

### 编程风格

“编程风格”（programming style）指的是编写代码的样式规则

- 分号：果没有使用分号，大多数情况下，JavaScript 会自动添加。这种语法特性被称为“分号的自动添加”（Automatic Semicolon Insertion，简称 ASI）
  - 不写结尾的分号，可能会导致脚本合并出错
  - 方便压缩

### console

- `console.dir(document.body)`
- `console.time()，console.timeEnd()`

## 标准库

### Object

`Object`对象， `O`大写.可以将任意值转为对象，也可以用来判断一个值是否为对象， 参数是对象直接返回， 原始类型转化， `undefined`和`null`转为空对象

```js
var obj = Object(undefined);
var obj = Object(null);
```

- 构造函数

```js
var o1 = { a: 1 };
var o2 = new Object(o1);
o1 === o2; // true

var obj = new Object(123);
obj instanceof Number; // true
```

虽然用法相似，但是 Object(value)与 new Object(value)两者的语义是不同的，Object(value)表示将 value 转成一个对象，new Object(value)则表示新生成一个对象，它的值是 value。

- 静态方法

  - `Object.keys()`:只返回可枚举属性
  - `Object.getOwnPropertyNames`： 返回一个数组，包含对象自身的所有属性（不管属性名是否可枚举）
  - （1）对象属性模型的相关方法

    - `Object.getOwnPropertyDescriptor()`：获取某个属性的描述对象。
    - `Object.defineProperty()`：通过描述对象，定义某个属性。
    - `Object.defineProperties()`：通过描述对象，定义多个属性。

  - （2）控制对象状态的方法

    - `Object.preventExtensions()`：防止对象扩展。
    - `Object.isExtensible()`：判断对象是否可扩展。
    - `Object.seal()`：禁止对象配置。
    - `Object.isSealed()`：判断一个对象是否可配置。 -` Object.freeze()`：冻结一个对象。
    - `Object.isFrozen()`：判断一个对象是否被冻结。

  - （3）原型链相关方法

    - `Object.create()`：该方法可以指定原型对象和属性，返回一个新的对象。
    - `Object.getPrototypeOf()`：获取对象的 Prototype 对象。

- 实例方法
  - `Object.prototype.valueOf()`：返回当前对象对应的值。
  - `Object.prototype.toString()`：返回当前对象对应的字符串形式。
    - 数值：返回`[object Number]`。
    - 字符串：返回`[object String]`。
    - 布尔值：返回`[object Boolean]`。
    - undefined：返回`[object Undefined]`。
    - null：返回`[object Null]`。
    - 数组：返回`[object Array]`。
    - arguments 对象：返回`[object Arguments]`。
    - 函数：返回`[object Function]`。
    - Error 对象：返回`[object Error]`。
    - Date 对象：返回`[object Date]`。
    - RegExp 对象：返回`[object RegExp]`。
    - 其他对象：返回`[object Object]`。
  - `Object.prototype.toLocaleString()`：返回当前对象对应的本地字符串形式。
  - `Object.prototype.hasOwnProperty()`：判断某个属性是否为当前对象自身的属性，还是继承自原型对象的属性。
  - `Object.prototype.isPrototypeOf()`：判断当前对象是否为另一个对象的原型。
  - `Object.prototype.propertyIsEnumerable()`：判断某个属性是否可枚举。

### 属性描述对象

- 元属性
  - `value`：表示属性值。
  - `writable`：表示属性值是否可改变（即是否可写）。
  - `configurable`：表示属性是否可配置，即是否可修改属性的特性或删除属性。
  - `enumerable`：表示属性是否可遍历，即是否出现在对象的属性枚举中。
    enumerable 为 false 时， 以下三个方法会取不到该属性
    - for..in 循环
    - Object.keys 方法
    - JSON.stringify 方法
  - `get`：表示属性的取值函数（getter），默认为 undefined。
  - `set`：表示属性的存值函数（setter），默认为 undefined。
- `Object.getOwnPropertyDescriptor()`：获取某个属性的描述对象， 只能用于自身属性
- `Object.getOwnPropertyNames`： 返回一个数组，包含对象自身的所有属性（不管属性名是否可枚举）
- `Object.defineProperty()`：通过描述对象，定义某个属性。

### Array

- 构造函数

```js
var arr = new Array(2);
arr.length; // 2
arr; // [ empty x 2 ]
```

`Array()`构造函数有一个很大的缺陷，不同的参数个数会导致不一致的行为。

```js
// 无参数时，返回一个空数组
new Array(); // []

// 单个正整数参数，表示返回的新数组的长度
new Array(1); // [ empty ]
new Array(2); // [ empty x 2 ]

// 非正整数的数值作为参数，会报错
new Array(3.2); // RangeError: Invalid array length
new Array(-3); // RangeError: Invalid array length

// 单个非数值（比如字符串、布尔值、对象等）作为参数，
// 则该参数是返回的新数组的成员
new Array("abc"); // ['abc']
new Array([1]); // [Array[1]]

// 多参数时，所有参数都是返回的新数组的成员
new Array(1, 2); // [1, 2]
new Array("a", "b", "c"); // ['a', 'b', 'c']
```

- 静态方法
  - `Array.isArray`
- 实例方法

  - `valueOf`: 数组的`valueOf`方法返回数组本身
  - `toString`: 返回数组的字符串形式
  - `push`: 在数组的末端添加一个或多个元素，并返回添加新元素后的数组长度
  - `pop`: 用于删除数组的最后一个元素，并返回该元素,该方法会改变原数组
  - `shift`: 用于删除数组的第一个元素，并返回该元素,该方法会改变原数组
  - `unshift`: 在数组的第一个位置添加一个或多个元素，并返回添加新元素后的数组长度
  - `join`: 用于将数组的所有元素连接成一个字符串并返回。如果不提供参数，默认用逗号分隔。如果数组只有一个成员，那么将返回该成员的字符串形式
    如果数组成员是 undefined 或 null 或空位，会被转成空字符串。
    ```js
    [undefined, null].join("#");
    ```
  - `concat`: 用于多个数组的合并。它将新数组的成员，添加到原数组的尾部，然后返回一个新数组，原数组不变。
  - `reverse`
  - `slice`: 用于提取原数组的一部分，返回一个新数组，原数组不变.它的第一个参数为起始位置（从 0 开始，会包括在返回的新数组之中），第二个参数为终止位置（但该位置的元素本身不包括在内）
  - `splice`: 用于删除原数组的一部分成员，并可以在删除的位置添加新的数组成员，返回值是被删除的元素。注意，该方法会改变原数组。
  - `sort`: 对数组成员进行排序，默认是按照字典顺序排序。排序后，原数组将改变。
  - `map`: 对数组的所有成员依次调用一个函数，运行结果组成一个新数组返回。
  - `forEach`
  - `filter`: 用于过滤数组成员，满足条件的成员组成一个新数组返回。
  - `every`: 判断数组的所有成员是否都满足测试函数。它返回一个布尔值。
  - `some`: 判断数组是否存在至少一个成员满足测试函数。它返回一个布尔值。
  - `reduce`: 依次处理数组的每个成员，最终累计为一个值。它的作用是生成一个值。
  - `reduceRight`: 与`reduce`方法类似，也是依次处理数组的每个成员，但是处理顺序相反，是从数组的末尾开始，向前遍历。
  - `indexOf`: 返回给定元素在数组中第一次出现的位置，如果没有出现则返回-1。
  - `lastIndexOf`: 返回给定元素在数组中最后一次出现的位置，如果没有出现则返回-1。

### 包装对象
- `Number、String、Boolean`
所谓“包装对象”，指的是与数值、字符串、布尔值分别相对应的 Number、String、Boolean 三个原生对象。这三个原生对象可以把原始类型的值变成（包装成）对象
<br />
Number、String 和 Boolean 这三个原生对象，如果不作为构造函数调用（即调用时不加 new），而是作为普通函数调用，常常用于将任意类型的值转为数值、字符串和布尔值

```js
var v1 = new Number(123);
var v2 = new String("abc");
var v3 = new Boolean(true);

typeof v1; // "object"
typeof v2; // "object"
typeof v3; // "object"

v1 === 123; // false
v2 === "abc"; // false
v3 === true; // false

// 字符串转为数值
Number("123"); // 123

// 数值转为字符串
String(123); // "123"

// 数值转为布尔值
Boolean(123); // true
```
- 原始类型与实例对象的自动转换
原始类型的值会自动当作包装对象调用，即调用包装对象的属性和方法。这时，JavaScript 引擎会自动将原始类型的值转为包装对象实例，并在使用后立刻销毁实例。
```js
'abc'.length // 3
```


## 资料引用

<a href="https://wangdoc.com/javascript/" target="_blank"  style="display: block">ES5 教程</a>
