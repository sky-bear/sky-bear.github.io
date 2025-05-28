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
"abc".length; // 3
```

## 面向对象编程

### 构造函数 new

- 判断当前是否使用 new 创建

  - 构造函数内部使用严格模式：函数内部的 this 不能指向全局对象，默认等于 undefined，导致不加 new 调用会报错（JavaScript 不允许对 undefined 添加属性）
  - 构造函数内部判断是否使用 new 命令，如果发现没有使用，则直接返回一个实例对象。

    ```js
    function Fubar(foo, bar) {
      if (!(this instanceof Fubar)) {
        return new Fubar(foo, bar);
      }

      this._foo = foo;
      this._bar = bar;
    }
    ```

- new 原理
  ```js
  function _new(/* 构造函数 */ constructor, /* 构造函数参数 */ params) {
    // 将 arguments 对象转为数组
    var args = [].slice.call(arguments);
    // 取出构造函数
    var constructor = args.shift();
    // 创建一个空对象，继承构造函数的 prototype 属性
    var context = Object.create(constructor.prototype);
    // 执行构造函数
    var result = constructor.apply(context, args);
    // 如果返回结果是对象，就直接返回，否则返回 context 对象
    return typeof result === "object" && result != null ? result : context;
  }
  ```
- new.target: 函数内部可以使用 new.target 属性。如果当前函数是 new 命令调用，new.target 指向当前函数，否则为 undefined

```js
function f() {
  console.log(new.target === f);
}

f(); // false
new f(); // true
```

### this

- 涵义：简单说，this 就是属性或方法“当前”所在的对象， 调用的对象不同， this 指向也不同
- 实质：JavaScript 语言之所以有 this 的设计，跟内存里面的数据结构有关系
  ```js
  var obj = { foo: 5 };
  ```
  上面的代码将一个对象赋值给变量 obj。JavaScript 引擎会先在内存里面，生成一个对象{ foo: 5 }，然后把这个对象的内存地址赋值给变量 obj。也就是说，变量 obj 是一个地址（reference）。后面如果要读取 obj.foo，引擎先从 obj 拿到内存地址，然后再从该地址读出原始的对象，返回它的 foo 属性。
  ```js
  {
    foo: {
        [[value]]: 5
        [[writable]]: true
        [[enumerable]]: true
        [[configurable]]: true
      }
    }
  ```
  此时如果 value 的值是一个对象， 那么它同 obj 一样， value 的值是一个对象的地址， 函数也是对象<br />
  由于函数是一个单独的值，所以它可以在不同的环境（上下文）执行。
  由于函数可以在不同的运行环境执行，所以需要有一种机制，能够在函数体内部获得当前的运行环境（context）。所以，this 就出现了，它的设计目的就是在**函数体内部，指代函数当前的运行环境**
- 绑定 this 的方法
  参数为 null 或 undefined， 或者空会被忽略
  - call
  - apply
    - 找出数组最大值
      ```js
      var a = [10, 2, 4, 15, 9];
      Math.max.apply(null, a); // 15
      ```
    - 将数组的空元素变为`undefined`
      ```js
      Array.apply(null, ["a", , "b"]);
      // [ 'a', undefined, 'b' ]
      ```
  - bind
  - 箭头函数

### 对象的继承

- 概述
  - prototype： JavaScript 继承机制的设计思想就是，原型对象的所有属性和方法，都能被实例对象共享。原型对象的作用，就是定义所有实例对象共享的属性和方法。这也是它被称为原型对象的原因，而实例对象可以视作从原型对象衍生出来的子对象
  - 原型链： JavaScript 规定，所有对象都有自己的原型对象（prototype），原型对象也是对象，所以它也有自己的原型。 因此，就会形成一个“原型链”（prototype chain）：对象到原型，再到原型的原型...
    - 原型链的尽头就是 null
  - constructor ：prototype 对象有一个 constructor 属性，默认指向 prototype 对象所在的构造函数
- instanceof:instanceof 运算符返回一个布尔值，表示对象是否为某个构造函数的实例.只能用于对象，不适用原始类型的值。
  instanceof 运算符的左边是实例对象，右边是构造函数。它会检查右边构造函数的原型对象（prototype），是否在左边对象的原型链上
  <br/>

```js
var obj = Object.create(null);
typeof obj; // "object"
obj instanceof Object; // false
```

这是唯一的 instanceof 运算符判断会失真的情况（一个对象的原型是 null）。

- 构造函数的继承
  - 子类中调用父类构造函数
    ```js
    function Sub(value) {
      Super.call(this);
      this.prop = value;
    }
    ```
  - 让子类的原型指向父类的原型
    ```js
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.prototype.method = "...";
    ```

### 模块

模块是实现特定功能的一组属性和方法的封装。

### Object 对象的相关方法

- `Object.getPrototypeOf`方法返回参数对象的原型。这是获取原型对象的标准方法
- `Object.setPrototypeOf`方法为参数对象设置原型，返回该参数对象。它接受两个参数，第一个是现有对象，第二个是原型对象。
- `Object.create()`方法接受一个对象作为参数，然后以它为原型，返回一个实例对象。该实例完全继承原型对象的属性

  ```js
  if (typeof Object.create !== "function") {
    Object.create = function (obj) {
      function F() {}
      F.prototype = obj;
      return new F();
    };
  }
  ```

  - `Object.create(null);`返回原型为 null 的对象
  - 动态继承了原型。在原型上添加或修改任何方法，会立刻反映在新对象之上。

    ```js
    var obj1 = { p: 1 };
    var obj2 = Object.create(obj1);

    obj1.p = 2;
    obj2.p; // 2
    ```

    obj1 的修改会自动反映在 obj2 上。这是因为 obj2 的原型对象是 obj1，它拿到的一切属性和方法，实际上是继承自 obj1。也就是说，obj1 是 obj2 的“原型”

  - `Object.create()`方法还可以接受第二个参数。该参数是一个属性描述对象，它所描述的对象属性，会添加到实例对象，作为该对象自身的属性
  - `isPrototypeOf`用来判断该对象是否为参数对象的原型

  ```js
  var o1 = {};
  var o2 = Object.create(o1);
  var o3 = Object.create(o2);

  o2.isPrototypeOf(o3); // true
  o1.isPrototypeOf(o3); // true
  ```

  - `__proto__`:指向当前对象的原型对象，即构造函数的 prototype 属性
  - in 运算符返回一个布尔值,表示一个对象是否具有某个属性。它不区分该属性是对象自身的属性，还是继承的属性。

## 异步操作

### 概述

- 单线程模型：JavaScript 只在一个线程上运行，不代表 JavaScript 引擎只有一个线程
- 同步任务和异步任务
  - 同步任务：同步任务是那些没有被引擎挂起、在主线程上排队执行的任务
  - 异步任务：异步任务是那些被引擎放在一边，不进入主线程、而进入任务队列的任务

### 定时器

- setTimeout/clearTimeout
- setInterval/clearInterval
- setTimeout(f, 0)
  - 改变代码执行顺序
  - 将任务放到浏览器最早可得的空闲时段执行，所以那些计算量大、耗时长的任务，常常会被放到几个小部分，分别放到 setTimeout(f, 0)里面执行。

## DOM

### 概述

文档对象模型

- 节点类型
  - Document：整个文档树的顶层节点
  - DocumentType：doctype 标签（比如`<!DOCTYPE html>`）
  - Element：网页的各种 HTML 标签（比如`<body>、<a>`等）
  - Attr：网页元素的属性（比如 class="right"）
  - Text：标签之间或标签包含的文本
  - Comment：注释
  - DocumentFragment：文档的片段
- 节点树
  - `nextSibling`: 返回紧跟在当前节点后面的第一个同级节点。如果当前节点后面没有同级节点，则返回 null
  - `previousSibling`:返回当前节点前面的、距离最近的一个同级节点。如果当前节点前面没有同级节点，则返回 null

### NodeList 和 HTMLCollection

- NodeList： 包含所有节点
- HTMLCollection：只能包含元素节点（element）
  HTMLCollection 实例都是动态集合，节点的变化会实时反映在集合中

### CSS

- style
  - setAttribute
    ```js
    div.setAttribute(
      "style",
      "background-color:red;" + "border:1px solid black;"
    );
    ```
  - getAttribute
  - removeAttribute
- CSSStyleDeclaration

  ```js
  var divStyle = document.querySelector("div").style;
  divStyle.backgroundColor = "red"; // 需要改成驼峰命名法
  divStyle.border = "1px solid black";
  ```

  - cssText

  ```js
  var divStyle = document.querySelector("div").style;
  // 添加
  divStyle.cssText =
    "background-color: red;" +
    "border: 1px solid black;" +
    "height: 100px;" +
    "width: 100px;";
  // 清空
  divStyle.cssText = "";
  ```

- window.getComputedStyle

### Mutation Observer

- 概述：用来监视 DOM 变动。DOM 的任何变动，比如节点的增减、属性的变动、文本内容的变动，这个 API 都可以得到通知
  - 它等待所有脚本任务完成后，才会运行（即异步触发方式）
  - 它把 DOM 变动记录封装成一个数组进行处理，而不是一条条个别处理 DOM 变动。
  - 它既可以观察 DOM 的所有类型变动，也可以指定只观察某一类变动

## 事件

### EventTarget

DOM 节点的事件操作（监听和触发），都定义在 EventTarget 接口。所有节点对象都部署了这个接口，其他一些需要事件通信的浏览器内置对象（比如，XMLHttpRequest、AudioNode、AudioContext）也部署了这个接口

- `addEventListener`
- `removeEventListener`
- `dispatchEvent`
  触发一个事件

  ```js
  para.addEventListener("click", hello, false);
  var event = new Event("click");
  para.dispatchEvent(event);
  ```

### 事件模型

- 监听函数

  - on: 只会在冒泡阶段触发

  ```js
   // 正确
    <body onload="doSomething()">

    // 错误
    <body onload="doSomething">


  ```

  - setAttribute

  ```js
  el.setAttribute("onclick", "doSomething()");
  // 等同于 这种方式同一个事件只能定义一个监听函数
  // <Element onclick="doSomething()">
  ```

  - addEventListener: 可以定义多个监听函数

- this: 监听函数内部的 this 指向触发事件的那个元素节点
- 事件传播：捕获阶段、目标阶段、冒泡阶段
- 事件代理
  由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方法叫做事件的代理
  - `stopPropagation`方法只会阻止事件的传播, 不会阻止该节点的其他事件监听函数
  - `stopImmediatePropagation`方法阻止同一个事件的其他监听函数被调用，不管监听函数定义在当前节点还是定义在父节点

### Event 对象

浏览器原生提供一个 Event 对象，所有的事件都是这个对象的实例，或者说继承了 Event.prototype 对象。

```js
event = new Event(type, options);
```

`Event.target`属性返回原始触发事件的那个节点，即事件最初发生的节点

### 鼠标事件

- 点击事件
  - click：按下鼠标（通常是左键，也可以是中间滚轮按钮或右键），然后释放鼠标按钮。
    click 事件可以看成是两个事件组成的：用户在同一个位置先触发 mousedown，再触发 mouseup。因此，触发顺序是，mousedown 首先触发，mouseup 接着触发，click 最后触发。
  - dblclick：在同一个元素上双击鼠标按钮。
  - mousedown：按下鼠标按钮。
  - mouseup：释放鼠标按钮。
  - contextmenu：按下鼠标右键，或者按下带有控制键的鼠标按钮。
- 移动事件
  - mousemove：鼠标在一个元素上面移动时触发。
  - mouseenter: 鼠标进入一个元素时触发。进入子节点不会触发这个事件
  - mouseover：鼠标进入一个节点时触发，进入子节点会再一次触发这个事件。
  - mouseout：鼠标离开一个节点时触发，在父元素内部离开一个子元素时会触发这个事件。
  - mouseleave：鼠标离开一个节点时触发，在父元素内部离开一个子元素时不会触发这个事件

### 键盘事件

### 进度事件

进度事件用来描述资源加载的进度，主要由 AJAX 请求、`<img>、<audio>、<video>、<style>、<link>`等外部资源的加载触发，继承了 ProgressEvent 接口。它主要包含以下几种事件。

- abort：外部资源中止加载时（比如用户取消）触发。如果发生错误导致中止，不会触发该事件。
- error：由于错误导致外部资源无法加载时触发。
- load：外部资源加载成功时触发。
- loadstart：外部资源开始加载时触发。
- loadend：外部资源停止加载时触发，发生顺序排在 error、abort、load 等事件的后面。
- progress：外部资源加载过程中不断触发。
- timeout：加载超时时触发。

### 表单事件

- input 事件当`<input>、<select>、<textarea>`的值发生变化时触发。对于复选框（`<input type=checkbox>`）或单选框（`<input type=radio>`），用户改变选项时，也会触发这个事件。另外，对于打开 contenteditable 属性的元素，只要值发生变化，也会触发 input 事件。

```md
会连续触发
```

- change
  激活单选框（radio）或复选框（checkbox）时触发。
  用户提交时触发。比如，从下列列表（select）完成选择，在日期或文件输入框完成选择。
  当文本框或`<textarea>`元素的值发生改变，并且丧失焦点时触发。

### 拖拉事件
-  设置可拖拉`draggable="true"`

## 资料引用

<a href="https://wangdoc.com/javascript/" target="_blank"  style="display: block">ES5 教程</a>
