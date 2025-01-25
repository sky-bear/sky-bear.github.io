# typescript

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## 环境搭建

## 八个 JS 中见过的类型

- **布尔类型**

  类型为布尔类型的变量的值只能是 true 或 false

  ```js
  let bool: boolean = false;
  bool = true;
  bool = 123; // error 不能将类型"123"分配给类型"boolean"
  ```

  当然了，赋给 bool 的值也可以是一个计算之后结果是布尔值的表达式

  ```js
  let bool: boolean = !!0;
  console.log(bool); // false
  ```

- **数值类型**

  TypeScript 和 JavaScript 一样，所有数字都是浮点数，所以只有一个`number`类型，而没有`int`或者`float`类型

  ```js
  let num: number;
  num = 123;
  num = "123"; // error 不能将类型"123"分配给类型"number"
  num = 0b1111011; //  二进制的123
  num = 0o173; // 八进制的123
  num = 0x7b; // 十六进制的123
  ```

- **字符串**

  字符串类型中你可以使用单引号和双引号包裹内容，但是可能你使用的 tslint 规则会对引号进行检测，使用单引号还是双引号可以在 tslint 规则里配置。你还可以使用 ES6 语法——模板字符串，拼接变量和字符串更为方便。

  ```js
  let str: string = "Lison";
  str = "Li";
  const first = "Lison";
  const last = "Li";
  str = `${first} ${last}`;
  console.log(str); // 打印结果为:Lison Li
  ```

  **_字符串字面量类型_**, 即把一个字符串字面量作为一种类型

  ```tsx
  let method： 'get' | 'post'
  // 此时method 只能为get或者post
  ```

- **数组**

  ```tsx
  let list1: number[] = [1, 2, 3];
  let list2: Array<number> = [1, 2, 3];
  let list3: ReadonlyArray<number> = [1];
  ```

  第一种形式通过`number[]`的形式来指定这个类型元素均为 number 类型的数组类型，这种写法是推荐的写法，当然你也可以使用第二种写法。注意，这两种写法中的`number`指定的是数组元素的类型，你也可以在这里将数组的元素指定为任意类型。如果你要指定一个数组里的元素既可以是数值也可以是字符串，那么你可以使用这种方式：`number|string[]`，这种方式我们在后面学习联合类型的时候会讲到。

  当你使用第二种形式定义时，tslint 可能会警告让你使用第一种形式定义，如果你就是想用第二种形式，可以通过在 tslint.json 的 rules 中加入`"array-type": [false]`关闭 tslint 对这条的检测。

- **null 和 undefined**

  null 和 undefined 有一些共同特点，所以我们放在一起讲。说它们有共同特点，是因为在 JavaScript 中，undefined 和 null 是两个基本数据类型。在 TypeScript 中，这两者都有各自的类型即 undefined 和 null，也就是说它们既是实际的值，也是类型，来看实际例子：

  ```typescript
  let u: undefined = undefined; // 这里可能会报一个tslint的错误：Unnecessary initialization to 'undefined'，就是不能给一个值赋undefined，但我们知道这是可以的，所以如果你的代码规范想让这种代码合理化，可以配置tslint，将"no-unnecessary-initializer"设为false即可
  let n: null = null;
  ```

  默认情况下 undefined 和 null 可以赋值给任意类型的值，也就是说你可以把 undefined 赋值给 void 类型，也可以赋值给 number 类型。当你在 tsconfig.json 的"compilerOptions"里设置了`"strictNullChecks": true`时，那必须严格对待。undefined 和 null 将只能赋值给它们自身和 void 类型，void 类型我们后面会学习。

- **object**

  ```tsx
  let obj: object;
  obj = { name: "Lison" };
  obj = 123; // error 不能将类型“123”分配给类型“obj
  ```

  额外类型检测

  ```tsx
  interface Config {
    width?: number;
    [propName: string]: any;
  }
  ```

## TypeScript 中引入的新类型

- **元组**

  元组可以看做是数组的拓展，它表示已知元素数量和类型的数组。确切地说，是已知数组中每一个位置上的元素的类型，来看例子：

  ```typescript
  let tuple: [string, number, boolean];
  tuple = ["a", 2, false];
  tuple = [2, "a", false]; // error 不能将类型“number”分配给类型“string”。 不能将类型“string”分配给类型“number”。
  tuple = ["a", 2]; // error Property '2' is missing in type '[string, number]' but required in type '[string, number, boolean]'
  ```

  可以看到，上面我们定义了一个元组 tuple，它包含三个元素，且每个元素的类型是固定的。当我们为 tuple 赋值时：**各个位置上的元素类型都要对应，元素个数也要一致。**

  这个赋给元组的值有三个元素，是比我们定义的元组类型元素个数多的：

  - 在 2.6 及之前版本中，超出规定个数的元素称作**越界元素**，但是只要越界元素的类型是定义的类型中的一种即可。比如我们定义的类型有两种：string 和 number，越界的元素是 string 类型，属于联合类型 `string | number`，所以没问题，联合类型的概念我们后面会讲到。
  - 在 2.6 之后的版本，去掉了这个**越界元素是联合类型的子类型即可**的条件，要求元组赋值必须类型和个数都对应。

  在 2.6 之后的版本，[string, number]元组类型的声明效果上可以看做等同于下面的声明：

  ```typescript
  interface Tuple extends Array<number | string> {
    0: string;
    1: number;
    length: 2;
  }
  ```

  上面这个声明中，我们定义接口`Tuple`，它继承数组类型，并且数组元素的类型是 `number 和 string` 构成的联合类型，这样接口`Tuple` 就拥有了数组类型所有的特性。并且我们明确指定索引为 0 的值为`string`类型，索引为 1 的值为`number`类型，同时我们指定 `length` 属性的类型字面量为 2，这样当我们再指定一个类型为这个接口`Tuple`的时候，这个值必须是数组，而且如果元素个数超过 2 个时，它的 length 就不是 2 是大于 2 的数了，就不满足这个接口定义了，所以就会报错；当然，如果元素个数不够 2 个也会报错，因为索引为 0 或 1 的值缺失

  如果你想要和 2.6 及之前版本一样的元组特性，那你可以这样定义接口：

  ```typescript
  interface Tuple extends Array<number | string> {
    0: string;
    1: number;
  }
  ```

  也就是去掉接口中定义的`length: 2`，这样`Tuple`接口的`length`就是从`Array`继承过来的`number`类型，而不用必须是`2`了。

- **枚举**

  `enum`类型是对 JavaScript 标准数据类型的一个补充。 像 C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

  ```ts
  enum Color {
    Red,
    Green,
    Blue,
  }
  let c: Color = Color.Green;
  ```

  默认情况下，从`0`开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从 `1`开始编号,其他字段默认递增索引

  ```ts
  enum Color {
    Red = 1,
    Green,
    Blue,
  }
  let c: Color = Color.Green;
  console.log(Color.red); // 1
  console.log(Color["Green"]); // 2
  ```

  或者，全部都采用手动赋值：

  ```ts
  enum Color {
    Red = 1,
    Green = 2,
    Blue = 4,
  }
  let cc: Color = Color.Green;
  let ccc: number = Color.Green;
  // 报错
  let cccc: Color = Color[1]; // 不能将类型“string”分配给类型“Color”
  ```

  枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为 2，但是不确定它映射到 Color 里的哪个名字，我们可以查找相应的名字：

  ```ts
  enum Color {
    Red = 1,
    Green,
    Blue,
  }
  let colorName: string = Color[2];

  console.log(colorName); // 显示'Green'因为上面代码里它的值是2
  ```

  **数字枚举**在定义值的时候，可以使用计算值和常量。但是要注意，如果某个字段使用了计算值或常量，那么该字段后面紧接着的字段必须设置初始值，这里不能使用默认的递增值了，来看例子：

  ```typescript
  const getValue = () => {
    return 0;
  };
  enum ErrorIndex {
    a = getValue(),
    b, // error 枚举成员必须具有初始化的值
    c,
  }
  enum RightIndex {
    a = getValue(),
    b = 1,
    c,
  }
  const Start = 1;
  enum Index {
    a = Start,
    b, // error 枚举成员必须具有初始化的值
    c,
  }
  ```

  **反向映射** 我们定义一个枚举值的时候，可以通过 Enum[‘key’]或者 Enum.key 的形式获取到对应的值 value。TypeScript 还支持反向映射，但是反向映射只支持数字枚举，字符串枚举是不支持的。

  ```tsx
  enum Status {
    Success = 200,
    NotFound = 404,
    Error = 500,
  }
  console.log(Status["Success"]); // 200
  console.log(Status[200]); // 'Success'
  console.log(Status[Status["Success"]]); // 'Success'
  ```

  上面这段代码编译后

  ```tsx
  {
      200: "Success",
      404: "NotFound",
      500: "Error",
      Error: 500,
      NotFound: 404,
      Success: 200
  }
  ```

  **字符串枚举**字符串枚举值要求每个字段的值都必须是字符串字面量，或者是该枚举值中另一个字符串枚举成员

  ```tsx
  enum Message {
    Error = "Sorry, error",
    Success = "Hoho, success",
  }
  console.log(Message.Error); // 'Sorry, error'
  ```

  再来看我们使用枚举值中其他枚举成员的例子：

  ```typescript
  enum Message {
    Error = "error message",
    ServerError = Error,
    ClientError = Error,
  }
  console.log(Message.Error); // 'error message'
  console.log(Message.ServerError); // 'error message'
  ```

  注意，这里的其他枚举成员指的是同一个枚举值中的枚举成员，因为字符串枚举不能使用常量或者计算值，所以也不能使用其他枚举值中的成员。

  **异构枚举**

  简单来说异构枚举就是枚举值中成员值既有数字类型又有字符串类型，如下：

  ```typescript
  enum Result {
    Faild = 0,
    Success = "Success",
  }
  ```

- **Any 任意类型**

  ```tsx
  let value: any;
  value = 123;
  value = "abc";
  value = false;
  const array: any[] = [1, "a", true];
  ```

- **void**

  void 和 any 相反，any 是表示任意类型，而 void 是表示没有任意类型，就是什么类型都不是，这在我们定义函数，函数没有返回值时会用到：

  ```tsx
  const consoleText = (text: string): void => {
    console.log(text);
  };
  ```

- **never**

  never 类型指那些永不存在的值的类型，它是那些总会抛出异常或根本不会有返回值的函数表达式的返回值类型，当变量被永不为真的类型保护（后面章节会详细介绍）所约束时，该变量也是 never 类型。

  这个类型比较难理解，我们先来看几个例子：

  ```typescript
  const errorFunc = (message: string): never => {
    throw new Error(message);
  };
  ```

  这个 errorFunc 函数总是会抛出异常，所以它的返回值类型是 never，用来表明它的返回值是永不存在的。

  ```typescript
  const infiniteFunc = (): never => {
    while (true) {}
  };
  ```

  `infiniteFunc`也是根本不会有返回值的函数，它和之前讲 void 类型时的`consoleText`函数不同，`consoleText`函数没有返回值，是我们在定义函数的时候没有给它返回值，而`infiniteFunc`是死循环是根本不会返回值的，所以它们二者还是有区别的。

  never 类型是任何类型的子类型，所以它可以赋值给任何类型；而没有类型是 never 的子类型，所以除了它自身没有任何类型可以赋值给 never 类型，any 类型也不能赋值给 never 类型。我们来看例子：

  ```typescript
  let neverVariable = (() => {
    while (true) {}
  })();
  neverVariable = 123; // error 不能将类型"number"分配给类型"never"
  ```

  上面例子我们定义了一个立即执行函数，也就是`"let neverVariable = "`右边的内容。右边的函数体内是一个死循环，所以这个函数调用后的返回值类型为 never，所以赋值之后 neverVariable 的类型是 never 类型，当我们给 neverVariable 赋值 123 时，就会报错，因为除它自身外任何类型都不能赋值给 never 类型。

- **交叉类型**

  交叉类型就是取多个类型的并集，使用 `&` 符号定义，被&符链接的多个类型构成一个交叉类型，表示这个类型同时具备这几个连接起来的类型的特点，来看例子：

  ```typescript
  const merge = <T, U>(arg1: T, arg2: U): T & U => {
    let res = <T & U>{}; // 这里指定返回值的类型兼备T和U两个类型变量代表的类型的特点
    res = Object.assign(arg1, arg2); // 这里使用Object.assign方法，返回一个合并后的对象；
    // 关于该方法，请在例子下面补充中学习
    return res;
  };
  const info1 = {
    name: "lison",
  };
  const info2 = {
    age: 18,
  };
  const lisonInfo = merge(info1, info2);

  console.log(lisonInfo.address); // error 类型“{ name: string; } & { age: number; }”上不存在属性“address”
  ```

  > 补充阅读：Object.assign 方法可以合并多个对象，将多个对象的属性添加到一个对象中并返回，有一点要注意的是，如果属性值是对象或者数组这种保存的是内存引用的引用类型，会保持这个引用，也就是如果在 Object.assign 返回的的对象中修改某个对象属性值，原来用来合并的对象也会受到影响。

  可以看到，传入的两个参数分别是带有属性 name 和 age 的两个对象，所以它俩的交叉类型要求返回的对象既有 name 属性又有 age 属性。

- **联合类型**

  联合类型在前面课时中几次提到，现在我们来看一下。联合类型实际是几个类型的结合，但是和交叉类型不同，联合类型是要求只要符合联合类型中任意一种类型即可，它使用 `|` 符号定义。当我们的程序具有多样性，元素类型不唯一时，即使用联合类型。

  ```typescript
  const getLength = (content: string | number): number => {
    if (typeof content === "string") return content.length;
    else return content.toString().length;
  };
  console.log(getLength("abc")); // 3
  console.log(getLength(123)); // 3
  ```

## 类型断言

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过*类型断言*这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript 会假设你，程序员，已经进行了必须的检查。

类型断言有两种形式。 其一是“尖括号”语法：

```ts
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

另一个为`as`语法：

```ts
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在 TypeScript 里使用 JSX 时，只有 `as`语法断言是被允许的。

## 接口定义

- **基本用法**

  ```tsx
  const getFullName = ({ firstName: string, lastName: string }) => {
    return `${firstName} ${lastName}`;
  };

  // 使用接口
  interface Info {
    firstName: string;
    lastName: string;
  }
  const getFullName = ({ firstName, lastName }: Info) =>
    `${firstName} ${lastName}`;
  ```

  意在定义接口的时候，你不要把它理解为是在定义一个对象，而要理解为{}括号包裹的是一个代码块，里面是一条条声明语句，只不过声明的不是变量的值而是类型。声明也不用等号赋值，而是冒号指定类型。每条声明之前用换行分隔即可，或者也可以使用分号或者逗号，都是可以的。

- **可选属性**

  ```tsx
  const getVegetables = ({ color, type }) => {
    return `A ${color ? color + " " : ""}${type}`;
  };
  ```

  我们可以看到这个函数中根据传入对象中的 color 和 type 来进行描述返回一句话，color 是可选的，所以我们可以给接口设置可选属性，在属性名后面加个?即可：

  ```tsx
  interface Vegetables {
    color?: string;
    type: string;
  }
  ```

  > 这里可能 tslint 会报一个警告，告诉我们接口应该以大写的 i 开头，如果你想关闭这条规则，可以在 tslint.json 的 rules 里添加"interface-name": [true, “never-prefix”]来关闭。

- **可选属性检查**

  - **使用类型断言**

    ```tsx
    interface Config {
      width?: number;
    }
    ```

  - **添加索引签名**

    ```tsx
    interface Config {
      [propName: string]: any;
    }
    ```

- **只读属性**

  ```typescript
  interface Role {
    readonly 0: string;
    readonly 1: string;
  }
  ```

  这里我们定义了一个角色字典，有 0 和 1 两种角色 id。下面我们定义一个实际的角色  数据，然后来试图修改一下它的值：

  ```typescript
  const role: Role = {
    0: "super_admin",
    1: "admin",
  };
  role[1] = "super_admin"; // Cannot assign to '0' because it is a read-only property
  ```

- **函数类型**

  ```tsx
  interface AddFunc {
    (num1: number, num2: number): number;
  }
  ```

  这里我们定义了一个 AddFunc 结构，这个结构要求实现这个结构的值，必须包含一个和结构里定义的函数一样参数、一样返回值的方法，或者这个值就是符合这个函数要求的函数。我们管花括号里包着的内容为调用签名，它由带有参数类型的参数列表和返回值类型组成。来看下如何使用：

  ```tsx
  const add: AddFunc = (n1, n2) => n1 + n2;
  const join: AddFunc = (n1, n2) => `${n1} ${n2}`; // 不能将类型'string'分配给类型'number'
  add("a", 2); // 类型'string'的参数不能赋给类型'number'的参数
  ```

  上面我们定义的 add 函数接收两个数值类型的参数，返回的结果也是数值类型，所以没有问题。而 join 函数参数类型没错，但是返回的是字符串，所以会报错。而当我们调用 add 函数时，传入的参数如果和接口定义的类型不一致，也会报错。

- **索引类型**

  ```tsx
  interface RoleDic {
    [id: number]: string;
  }
  const role1: RoleDic = {
    0: "super_admin",
    1: "admin",
  };
  const role2: RoleDic = {
    s: "super_admin", // error 不能将类型"{ s: string; a: string; }"分配给类型"RoleDic"。
    a: "admin",
  };
  const role3: RoleDic = ["super_admin", "admin"];
  ```

  上面的例子中 role3 定义了一个数组，索引为数值类型，值为字符串类型。

  你也可以给索引设置`readonly`，从而防止索引返回值被修改。

  ```typescript
  interface RoleDic {
    readonly [id: number]: string;
  }
  const role: RoleDic = {
    0: "super_admin",
  };
  role[0] = "admin"; // error 类型"RoleDic"中的索引签名仅允许读取
  ```

  这里有的点需要注意，你可以设置索引类型为 number。但是这样如果你将属性名设置为字符串类型，则会报错；但是如果你设置索引类型为字符串类型，那么即便你的属性名设置的是数值类型，也没问题。因为
  JS 在访问属性值的时候，如果属性名是数值类型，会先将数值类型转为字符串，然后再去访问。

  ```tsx
  const obj = {
    123: "a", // 这里定义一个数值类型的123这个属性
    "123": "b", // 这里在定义一个字符串类型的123这个属性，这里会报错：标识符“"123"”重复。
  };
  console.log(obj); // { '123': 'b' }
  ```

  如果数值类型的属性名不会转为字符串类型，那么这里数值 123 和字符串 123 是不同的两个值，则最后对象 obj 应该同时有这两个属性；但是实际打印出来的 obj 只有一个属性，属性名为字符串"123"，而且值为"b"，说明数值类型属性名 123 被覆盖掉了，就是因为它被转为了字符串类型属性名"123"；又因为一个对象中多个相同属性名的属性，定义在后面的会覆盖前面的，所以结果就是 obj 只保留了后面定义的属性值。

- **继承接口**

  接口可以继承，这和类(类的相关知识，我们会在后面全面详细的学习)一样，这提高了接口的可复用性。来看一个场景：

  我们定义一个`Vegetables`接口，它会对`color`属性进行限制。再定义两个接口，一个为`Tomato`，一个为`Carrot`，这两个类都需要对`color`进行限制，而各自又有各自独有的属性限制，我们可以这样定义：

  ```typescript
  interface Vegetables {
    color: string;
  }
  interface Tomato {
    color: string;
    radius: number;
  }
  interface Carrot {
    color: string;
    length: number;
  }
  ```

  三个接口中都有对`color`的定义，但是这样写很繁琐，所以我们可以用继承来改写：

  ```typescript
  interface Vegetables {
    color: string;
  }
  interface Tomato extends Vegetables {
    radius: number;
  }
  interface Carrot extends Vegetables {
    length: number;
  }
  const tomato: Tomato = {
    radius: 1.2, // error  Property 'color' is missing in type '{ radius: number; }'
  };
  const carrot: Carrot = {
    color: "orange",
    length: 20,
  };
  ```

  上面定义的 `tomato` 变量因为缺少了从`Vegetables`接口继承来的 `color` 属性，从而报错。

  一个接口可以被多个接口继承，同样，一个接口也可以继承多个接口，多个接口用逗号隔开。比如我们再定义一个`Food`接口，`Tomato` 也可以继承 `Food`：

  ```typescript
  interface Vegetables {
    color: string;
  }
  interface Food {
    type: string;
  }
  interface Tomato extends Food, Vegetables {
    radius: number;
  }

  const tomato: Tomato = {
    type: "vegetables",
    color: "red",
    radius: 1.2,
  }; // 在定义tomato变量时将继承过来的color和type属性同时声明
  ```

- **混合类型接口**

  ```js
  // javascript
  let countUp = () => {
    return ++countUp.count;
  };
  countUp.count = 0;
  console.log(countUp()); // 1
  console.log(countUp()); // 2
  ```

  我们可以使用混合类型接口来指定上面例子中 `countUp` 的类型：

  ```typescript
  interface Counter {
    (): void; // 这里定义Counter这个结构必须包含一个函数，函数的要求是无参数，返回值为void，即无返回值
    count: number; // 而且这个结构还必须包含一个名为count、值的类型为number类型的属性
  }
  const getCounter = (): Counter => {
    // 这里定义一个函数用来返回这个计数器
    const c = () => {
      // 定义一个函数，逻辑和前面例子的一样
      c.count++;
    };
    c.count = 0; // 再给这个函数添加一个count属性初始值为0
    return c; // 最后返回这个函数对象
  };
  const counter: Counter = getCounter(); // 通过getCounter函数得到这个计数器
  counter();
  console.log(counter.count); // 1
  counter();
  console.log(counter.count); // 2
  ```

  上面的例子中，`getCounter`函数返回值类型为`Counter`，它是一个函数，无返回值，即返回值类型为`void`，它还包含一个属性`count`，属性返回值类型为`number`。

## 函数类型

- 为函数定义类型

  ```tsx
  function add(arg1: number, arg2: number): number {
    return x + y;
  }
  // 或者
  const add = (arg1: number, arg2: number): number => {
    return x + y;
  };
  ```

- **完整函数类型**

  一个函数的定义包括函数名、参数、逻辑和返回值。我们为一个函数定义类型时，完整的定义应该包括参数类型和返回值类型。上面的例子中，我们都是在定义函数的指定参数类型和返回值类型。接下来我们看下，如何定义一个完整的函数类型，以及用这个函数类型来规定一个函数定义时参数和返回值需要符合的类型。先来看例子然后再进行解释：

  ```typescript
  let add: (x: number, y: number) => number;
  add = (arg1: number, arg2: number): number => arg1 + arg2;
  add = (arg1: string, arg2: string): string => arg1 + arg2; // error
  ```

  上面这个例子中，我们首先定义了一个变量 add，给它指定了函数类型，也就是`(x: number, y: number) => number`，这个函数类型包含参数和返回值的类型。然后我们给 add 赋了一个实际的函数，这个函数参数类型和返回类型都和函数类型中定义的一致，所以可以赋值。后面我们又给它赋了一个新函数，而这个函数的参数类型和返回值类型都是 string 类型，这时就会报如下错误：

  ```shell
  不能将类型"(arg1: string, arg2: string) => string"分配给类型"(x: number, y: number) => number"。
    参数"arg1"和"x" 的类型不兼容。
      不能将类型"number"分配给类型"string"。
  ```

- **使用接口定义函数类型**

  ```tsx
  interface Add {
    (x: number, y: number): number;
  }
  let add: Add = (arg1: string, arg2: string): string => arg1 + arg2; // error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“Add”
  ```

- **使用类型别名**

  ```tsx
  type Add = (x: number, y: number) => number;
  let add: Add = (arg1: string, arg2: string): string => arg1 + arg2; // error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“Add”

  let add: Add = (arg1, arg2) => arg1 + arg2;
  ```

- 参数

  - 可选参数

    ```tsx
    type Add = (x?: number, y: number) => number; // error 必选参数不能位于可选参数后。
    type Add = (x: number, y?: number) => number;
    ```

  - 默认参数

    ```tsx
    type Params = (x: number, y?: number) => number;
    let par2: Params = (n1: number, n2: number = 2) => {
      return n1 + n2;
    };
    ```

  - 剩余参数

    ```tsx
    type Params = (x: number, y?: number) => number;
    const handleData = (arg1: number, ...args: number[]): void => {};
    ```

## 泛型

> 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性

- **简单使用**

  ```tsx
  const getArray = <T,>(value: T, times: number = 5): T[] => {
    return new Array(times).fill(value);
  };
  ```

  我们在定义函数之前，使用<>符号定义了一个泛型变量 T，这个 T 在这次函数定义中就代表某一种类型，它可以是基础类型，也可以是联合类型等高级类型。定义了泛型变量之后，你在函数中任何需要指定类型的地方使用 T 都代表这一种类型。比如当我们传入 value 的类型为数值类型，那么返回的数组类型 T[]就表示 number[]

- **泛型变量**

  当我们使用泛型的时候，你必须在处理类型涉及到泛型的数据的时候，把这个数据当做任意类型来处理。这就意味着不是所有类型都能做的操作不能做，不是所有类型都能调用的方法不能调用

  ```tsx
  const getLength = <T,>(param: T): number => {
    return param.length; // error 类型“T”上不存在属性“length”
  };
  ```

  当我们获取一个类型为泛型的变量 param 的 length 属性值时，如果 param 的类型为数组 Array 或字符串 string
  类型是没问题的，它们有 length 属性。但是如果此时传入的 param 是数值 number 类型，那这里就会有问题了

  这里的`T`并不是固定的，你可以写为`A`、`B`或者其他名字，而且还可以在一个函数中定义多个泛型变量。我们来看个复杂点的例子：

  ```typescript
  const getArray = <T, U>(param1: T, param2: U, times: number): [T, U][] => {
    return new Array(times).fill([param1, param2]);
  };
  getArray(1, "a", 3).forEach((item) => {
    console.log(item[0].length); // error 类型“number”上不存在属性“length”
    console.log(item[1].toFixed(2)); // error 属性“toFixed”在类型“string”上不存在
  });
  ```

  这个例子中，我们定义了两个泛型变量`T`和`U`。第一个参数的类型为 T，第二个参数的类型为 U，最后函数返回一个二维数组，函数返回类型我们指定是一个元素类型为`[T, U]`的数组。所以当我们调用函数，最后遍历结果时，遍历到的每个元素都是一个第一个元素是数值类型、第二个元素是字符串类型的数组。

- **泛型函数类型**

  ```js
  const getArr: <T>(arg: T, times: number) => T[] = (arg, times) => {
    return new Array(times).fill(arg);
  };

  const getArr_1 = <T>(arg: T, times: number): T[] => {
    return new Array(times).fill(arg);
  };

  // 此处使用类型别名
  // type GetArr = <T>(arg: T, times: number) => T[]
  // 使用接口
  interface GetArr {
    <T>(arg: T, times: number): T[];
  }

  const getArr_2: GetArr = (arg, times) => {
    return new Array(times).fill(arg);
  };

  const getArr_3: GetArr = <T>(arg: T, times: number): T[] => {
    return new Array(times).fill(arg);
  };
  ```

  当然了，我们也可以使用接口的形式来定义泛型函数类型：

  你还可以把接口中泛型变量提升到接口最外层，这样接口中所有属性和方法都能使用这个泛型变量了。我们先来看怎么用：

  ```typescript
  interface GetArray<T> {
    (arg: T, times: number): T[];
    tag: T;
  }
  const getArray: GetArray<number> = <T>(arg: T, times: number): T[] => {
    // error 不能将类型“{ <T>(arg: T, times: number): T[]; tag: string; }”分配给类型“GetArray<number>”。
    // 属性“tag”的类型不兼容。
    return new Array(times).fill(arg);
  };
  getArray.tag = "a"; // 不能将类型“"a"”分配给类型“number”
  getArray("a", 1); // 不能将类型“"a"”分配给类型“number”
  ```

  上面例子中将泛型变量定义在接口最外层，所以不仅函数的类型中可以使用 T，在属性 tag 的定义中也可以使用。但在使用接口的时候，要在接口名后面明确传入一个类型，也就是这里的`GetArray<number>`，那么后面的 arg 和 tag 的类型都得是 number 类型。当然了，如果你还是希望 T 可以是任何类型，你可以把`GetArray<number>`换成`GetArray<any>`。

- **泛型约束**

  当我们定义一个对象，想要对只能访问对象上存在的属性做要求时，该怎么办？先来看下这个需求是什么样子：

  ```typescript
  const getProps = (object, propName) => {
    return object[propName];
  };
  const obj = { a: "aa", b: "bb" };
  getProps(obj, "c"); // undefined
  ```

  当我们访问这个对象的’c’属性时，这个属性是没有的。这里我们需要用到索引类型`keyof`结合泛型来实现对这个问题的检查。索引类型在高级类型一节会详细讲解，这里你只要知道这个例子就可以了：

  ```typescript
  const getProp = <T, K extends keyof T>(object: T, propName: K) => {
    return object[propName];
  };
  const obj = { a: "aa", b: "bb" };
  getProp(obj, "c"); // 类型“"c"”的参数不能赋给类型“"a" | "b"”的参数
  ```

  这里我们使用让`K`来继承索引类型`keyof T`，你可以理解为`keyof T`相当于一个由泛型变量 T 的属性名构成的联合类型，在这里 K 就被约束为了只能是"a"或"b"，所以当我们传入字符串"c"想要获取对象*obj*的属性"c"时就会报错。

## TS 中的类

- **基础使用**

  ```tsx
  class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    getPosition() {
      return `(${this.x}, ${this.y})`;
    }
  }
  const point = new Point(1, 2);
  ```

  同样你也可以使用继承来复用一些特性：

  ```typescript
  class Parent {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
  }
  class Child extends Parent {
    constructor(name: string) {
      super(name);
    }
  }
  ```

- **修饰符**

  - **public**

    public 表示公共的，用来指定在创建实例后可以通过实例访问的，也就是类定义的外部可以访问的属性和方法。默认是 public，但是 TSLint 可能会要求你必须用修饰符来表明这个属性或方法是什么类型的。

    ```tsx
    class Point {
      public x: number;
      public y: number;
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
      }
      public getPosition() {
        return `(${this.x}, ${this.y})`;
      }
    }
    ```

  - **private**

    private 修饰符表示私有的，它修饰的属性在类的定义外面是没法访问的：

    ```tsx
    class Parent {
      private age: number;
      constructor(age: number) {
        this.age = age;
      }
    }
    const p = new Parent(18);
    console.log(p); // { age: 18 }
    console.log(p.age); // error 属性“age”为私有属性，只能在类“Parent”中访问
    console.log(Parent.age); // error 类型“typeof ParentA”上不存在属性“age”
    class Child extends Parent {
      constructor(age: number) {
        super(age);
        console.log(super.age); // 通过 "super" 关键字只能访问基类的公共方法和受保护方法
      }
    }
    ```

    这里你可以看到，age 属性使用 private 修饰符修饰，说明他是私有属性，我们打印创建的实例对象 p，发现他是有属性 age 的，但是当试图访问 p 的 age 属性时，编译器会报错，告诉我们私有属性只能在类 Parent 中访问。

    这里我们需要特别说下 super.age 这里的报错，我们在之前学习 ES6 的类的时候，讲过在不同类型的方法里 super 作为对象代表着不同的含义，这里在 constructor 中访问 super，这的 super 相当于父类本身，这里我们看到使用 private 修饰的属性，在子类中是没法访问的。

  - **protected**

    protected 修饰符是受保护修饰符，和 private 有些相似，但有一点不同，protected 修饰的成员在继承该类的子类中可以访问，我们再来看下上面那个例子，把父类 Parent 的 age 属性的修饰符 private 替换为 protected：

    ```tsx
    class Parent {
      protected age: number;
      constructor(age: number) {
        this.age = age;
      }
      protected getAge() {
        return this.age;
      }
    }
    const p = new Parent(18);
    console.log(p.age); // error 属性“age”为私有属性，只能在类“ParentA”中访问
    console.log(Parent.age); // error 类型“typeof ParentA”上不存在属性“age”
    class Child extends Parent {
      constructor(age: number) {
        super(age);
        console.log(super.age); // undefined
        console.log(super.getAge());
      }
    }
    new Child(18);
    ```

    protected 还能用来修饰 constructor 构造函数，加了 protected 修饰符之后，这个类就不能再用来创建实例，只能被子类继承，这个需求我们在讲 ES6 的类的时候讲过，需要用 new.target 来自行判断，而 TS 则只需用 protected 修饰符即可：

    ```tsx
    class Parent {
      protected constructor() {
        //
      }
    }
    const p = new Parent(); // error 类“Parent”的构造函数是受保护的，仅可在类声明中访问
    class Child extends Parent {
      constructor() {
        super();
      }
    }
    const c = new Child();
    ```

  - **readonly**

    在类里可以使用`readonly`关键字将属性设置为只读。

    ```typescript
    class UserInfo {
      readonly name: string;
      constructor(name: string) {
        this.name = name;
      }
    }
    const user = new UserInfo("Lison");
    user.name = "haha"; // error Cannot assign to 'name' because it is a read-only property
    ```

    设置为只读的属性，实例只能读取这个属性值，但不能修改。

  > 还有一些懒得写。。。。。

## 类型推论

- **基本推论**

  ```js
  let name = "lison";
  name = 123; // error 不能将类型“123”分配给类型“string”
  ```

- **多类型联合**

  当我们定义一个数组或元组这种包含多个元素的值的时候，多个元素可以有不同的类型，这种时候 TypeScript 会将多个类型合并起来，组成一个联合类型，来看例子：

  ```typescript
  let arr = [1, "a"];
  arr = ["b", 2, false]; // error 不能将类型“false”分配给类型“string | number”
  ```

  可以看到，此时的 arr 的元素被推断为`string | number`，也就是元素可以是 string 类型也可以是 number 类型，除此两种类型外的类型是不可以的。再来看个例子：

  ```typescript
  let value = Math.random() * 10 > 5 ? "abc" : 123;
  value = false; // error 不能将类型“false”分配给类型“string | number”
  ```

  这里我们给 value 赋值为一个三元操作符表达式，`Math.random() * 10`的值为 0-10 的随机数。这里判断，如果这个随机值大于 5，则赋给 value 的值为字符串’abc’，否则为数值 123，所以最后编译器推断出的类型为联合类型`string | number`，当给它再赋值为 false 的时候就会报错。

  > 根据`=`符号右边值的类型，推断左侧值的类型

- **上下文类型**

  类型则相反，它是根据左侧的类型推断右侧的一些类型，先来看例子：

  ```typescript
  window.onmousedown = function (mouseEvent) {
    console.log(mouseEvent.a); // error 类型“MouseEvent”上不存在属性“a”
  };
  ```

  我们可以看到，表达式左侧是 window.onmousedown(鼠标按下时发生事件)，因此 TypeScript 会推断赋值表达式右侧函数的参数是事件对象，因为左侧是 mousedown 事件，所以 TypeScript 推断 mouseEvent 的类型是 MouseEvent。在回调函数中使用 mouseEvent 的时候，你可以访问鼠标事件对象的所有属性和方法，当访问不存在属性的时候，就会报错。

## 类型保护

- 场景分析

  ```tsx
  const valueList = [123, "abc"];
  const getRandomValue = () => {
    const number = Math.random() * 10; // 这里取一个[0, 10)范围内的随机值
    if (number < 5)
      return valueList[0]; // 如果随机数小于5则返回valueList里的第一个值，也就是123
    else return valueList[1]; // 否则返回"abc"
  };
  const item = getRandomValue();
  if (item.length) {
    // error 类型“number”上不存在属性“length”
    console.log(item.length); // error 类型“number”上不存在属性“length”
  } else {
    console.log(item.toFixed()); // error 类型“string”上不存在属性“toFixed”
  }
  ```

  上面这个例子中，getRandomValue 函数返回的元素是不固定的，有时返回数值类型，有时返回字符串类型。我们使用这个函数生成一个值 item，然后接下来的逻辑是通过是否有 length 属性来判断是字符串类型，如果没有 length 属性则为数值类型。在 js 中，这段逻辑是没问题的，但是在 TS 中，因为 TS 在编译阶段是无法知道 item 的类型的，所以当我们在 if 判断逻辑中访问 item 的 length 属性的时候就会报错，因为如果 item 为 number 类型的话是没有 length 属性的。

  - 使用类型断言来解决

    ```tsx
    if ((<string>item).length) {
      console.log((<string>item).length);
    } else {
      console.log((<number>item).toFixed());
    }
    ```

- **自定义类型保护**

  ```tsx
  const valueList = [123, "abc"];
  const getRandomValue = () => {
    const value = Math.random() * 10; // 这里取一个[0, 10)范围内的随机值
    if (value < 5) {
      return valueList[0];
    } else {
      return valueList[1];
    } // 否则返回"abc"
  };
  function isString(value: number | string): value is string {
    return typeof value === "string";
  }
  const item = getRandomValue();
  if (isString(item)) {
    console.log(item.length); // 此时item是string类型
  } else {
    console.log(item.toFixed()); // 此时item是number类型
  }
  ```

  我们看到，首先定义一个函数，函数的参数 value 就是要判断的值，在这个例子中 value 的类型可以为 number 或 string，函数的返回值类型是一个结构为 value is type 的类型谓语，value 的命名无所谓，但是谓语中的 value 名必须和参数名一致。而函数里的逻辑则用来返回一个布尔值，如果返回为 true，则表示传入的值类型为 is 后面的 type。

  使用类型保护后，if 的判断逻辑和代码块都无需再对类型做指定工作，不仅如此，既然 item 是 string 类型，则 else 的逻辑中，item 一定是联合类型两个类型中另外一个，也就是 number 类型。

- **typeof 类型保护**

  但是这样定义一个函数来用于判断类型是字符串类型，难免有些复杂，因为在 JavaScript 中，只需要在 if 的判断逻辑地方使用 typeof 关键字即可判断一个值的类型。所以在 TS 中，如果是基本类型，而不是复杂的类型判断，你可以直接使用 typeof 来做类型保护：

  ```typescript
  if (typeof item === "string") {
    console.log(item.length);
  } else {
    console.log(item.toFixed());
  }
  ```

  这样直接写也是可以的，效果和自定义类型保护一样。但是在 TS 中，对 typeof 的处理还有些特殊要求：

  - 只能使用`=`和`!`两种形式来比较
  - type 只能是`number`、`string`、`boolean`和`symbol`四种类型

  第一点要求我们必须使用这两种形式来做比较，比如你使用`(typeof item).includes(‘string’)`也能做判断，但是不行的。

  第二点要求我们要比较的类型只能是这四种，但是我们知道，在 JS 中，`typeof xxx`的结果还有`object`、`function`和 `undefined` 。但是在 TS 中，只会把对前面四种类型的 typeof 比较识别为类型保护，你可以使用`typeof {} === ‘object’`，但是这里它只是一条普通的 js 语句，不具有类型保护具有的效果。我们可以来看例子：

  ```typescript
  const valueList = [{}, () => {}];
  const getRandomValue = () => {
    const number = Math.random() * 10;
    if (number < 5) {
      return valueList[0];
    } else {
      return valueList[1];
    }
  };
  const res = getRandomValue();
  if (typeof res === "object") {
    console.log(res.toString());
  } else {
    console.log(ress()); // error 无法调用类型缺少调用签名的表达式。类型“{}”没有兼容的调用签名
  }
  ```

- **instanceof 类型保护**

## 显示复制断言

> 补充`null`和`undefined`的知识
>
> **(1) 严格模式下 null 和 undefined 赋值给其它类型值**
>
> 当我们在 tsconfig.json 中将 strictNullChecks 设为 true 后，就不能再将 undefined 和 null 赋值给除它们自身和 void 之外的任意类型值了，但有时我们确实需要给一个其它类型的值设置初始值为空，然后再进行赋值，这时我们可以自己使用联合类型来实现 null 或 undefined 赋值给其它类型：
>
> ```typescript
> let str = "lison";
> str = null; // error 不能将类型“null”分配给类型“string”
> let strNull: string | null = "lison"; // 这里你可以简单理解为，string | null即表示既可以是string类型也可以是null类型
> strNull = null; // right
> strNull = undefined; // error 不能将类型“undefined”分配给类型“string | null”
> ```
>
> 注意，TS 会将 undefined 和 null 区别对待，这和 JS 的本意也是一致的，所以在 TS 中，`string|undefined`、`string|null`和`string|undefined|null`是三种不同的类型。
>
> **(2) 可选参数和可选属性**
>
> 如果开启了 strictNullChecks，可选参数会被自动加上`|undefined`，来看例子：
>
> ```typescript
> const sum = (x: number, y?: number) => {
>   return x + (y || 0);
> };
> sum(1, 2); // 3
> sum(1); // 1
> sum(1, undefined); // 1
> sum(1, null); // error Argument of type 'null' is not assignable to parameter of type 'number | undefined'
> ```
>
> 可以根据错误信息看出，这里的参数 y 作为可选参数，它的类型就不仅是 number 类型了，它可以是 undefined，所以它的类型是联合类型`number | undefined`。
>
> TS 对可选属性和对可选参数的处理一样，可选属性的类型也会被自动加上`|undefined`。
>
> ```tsx
> interface PositionInterface {
>   x: number;
>   b?: number;
> }
> const position: PositionInterface = {
>   x: 12,
> };
> position.b = "abc"; // error
> position.b = undefined; // right
> position.b = null; // error
> ```

- **显示赋值断言**

  接下来我们来看显式赋值断言。当我们开启 strictNullChecks 时，有些情况下编译器是无法在我们声明一些变量前知道一个值是否是 null 的，所以我们需要使用类型断言手动指明该值不为 null。这可能不好理解，接下来我们就来看一个编译器无法推断出一个值是否是 null 的例子：

  ```typescript
  function getSplicedStr(num: number | null): string {
    function getRes(prefix: string) {
      // 这里在函数getSplicedStr里定义一个函数getRes，我们最后调用getSplicedStr返回的值实际是getRes运行后的返回值
      return prefix + num.toFixed().toString(); // 这里使用参数num，num的类型为number或null，在运行前编译器是无法知道在运行时num参数的实际类型的，所以这里会报错，因为num参数可能为null
    }
    num = num || 0.1; // 但是这里进行了赋值，如果num为null则会将0.1赋给num，所以实际调用getRes的时候，getRes里的num拿到的始终不为null
    return getRes("lison");
  }
  ```

  这个例子中，因为有嵌套函数，而编译器无法去除嵌套函数的 null（除非是立即调用的函数表达式），所以我们需要使用显式赋值断言，写法就是在不为 null 的值后面加个`!`。来看上面的例子该怎么改：

  ```typescript
  function getSplicedStr(num: number | null): string {
    function getLength(prefix: string) {
      return prefix + num!.toFixed().toString();
    }
    num = num || 0.1;
    return getLength("lison");
  }
  ```

  这样编译器就知道了，num 不为 null，即便 getSplicedStr 函数在调用的时候传进来的参数是 null，在 getLength 函数中的 num 也不会是 null。

## 类型别名和字面量类型

- **类型别名**

  类型别名就是给一种类型起个别的名字，之后只要使用这个类型的地方，都可以用这个名字作为类型代替，但是它只是起了一个名字，并不是创建了一个新类型。这种感觉就像 JS 中对象的赋值，你可以把一个对象赋给一个变量，使用这个对象的地方都可以用这个变量代替，但你并不是创建了一个新对象，而是通过引用来使用这个对象。

  我们来看下怎么定义类型别名，使用 `type` 关键字：

  ```typescript
  type TypeString = string;
  let str: TypeString;
  str = 123; // error Type '123' is not assignable to type 'string'
  ```

  类型别名也可以使用泛型，来看例子：

  ```typescript
  type PositionType<T> = { x: T; y: T };
  const position1: PositionType<number> = {
    x: 1,
    y: -1,
  };
  const position2: PositionType<string> = {
    x: "right",
    y: "top",
  };
  ```

  使用类型别名时也可以在属性中引用自己：

  ```typescript
  type Child<T> = {
    current: T;
    child?: Child<T>;
  };
  let ccc: Child<string> = {
    current: "first",
    child: {
      // error
      current: "second",
      child: {
        current: "third",
        child: "test", // 这个地方不符合type，造成最外层child处报错
      },
    },
  };
  ```

  但是要注意，只可以在对象属性中引用类型别名自己，不能直接使用，比如下面这样是不对的：

  ```typescript
  type Child = Child[]; // error 类型别名“Child”循环引用自身
  ```

  另外要注意，因为类型别名只是为其它类型起了个新名字来引用这个类型，所以当它为接口起别名时，不能使用 `extends` 和 `implements` 。

  接口和类型别名有时可以起到同样作用，比如下面这个例子：

  ```typescript
  type Alias = {
    num: number;
  };
  interface Interface {
    num: number;
  }
  let _alias: Alias = {
    num: 123,
  };
  let _interface: Interface = {
    num: 321,
  };
  _alias = _interface;
  ```

  可以看到用类型别名和接口都可以定义一个只包含 num 属性的对象类型，而且类型是兼容的。那么什么时候用类型别名，什么时候用接口呢？可以通过两点来选择：

  - 当你定义的类型要用于拓展，即使用 implements 等修饰符时，用接口。
  - 当无法通过接口，并且需要使用联合类型或元组类型，用类型别名。

- **字面量类型**

  - **字符串字面量类型**

    字符串字面量类型其实就是字符串常量，与字符串类型不同的是它是具体的值。

    ```tsx
    type Name = "Lison" | "get" | "post"; // 可以是多个
    const name1: Name = "test"; // error 不能将类型“"test"”分配给类型“"Lison"”
    const name2: Name = "Lison";
    ```

  - **数字字面量类型**

    ```typescript
    type Age = 18;
    interface Info {
      name: string;
      age: Age;
    }
    const info: Info = {
      name: "Lison",
      age: 28, // error 不能将类型“28”分配给类型“18”
    };
    ```

    这里补充一个比较经典的逻辑错误，来看例子：

    ```typescript
    function getValue(index: number) {
      if (index !== 0 || index !== 1) {
        // error This condition will always return 'true' since the types '0' and '1' have no overlap
        // ...
      }
    }
    ```

    这个例子中，在判断逻辑处使用了 `||` 符，当 index !== 0 不成立时，说明 index 就是 0，则不应该再判断 index 是否不等于 1；而如果 index !== 0 成立，那后面的判断也不会再执行；所以这个地方会报错。

## 可辨识联合类型

我们可以把单例类型、联合类型、类型保护和类型别名这几种类型进行合并，来创建一个叫做**可辨识联合**的高级类型，它也可称作**标签联合**或**代数数据类型**。

> 所谓单例类型，你可以理解为符合[单例模式](https://zh.wikipedia.org/wiki/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F)的数据类型，比如枚举成员类型，字面量类型。

可辨识联合要求具有两个要素：

- 具有普通的单例类型属性（这个要作为辨识的特征，也是重要因素）。
- 一个类型别名，包含了那些类型的联合（即把几个类型封装为联合类型，并起一个别名）。

来看例子：

```typescript
interface Square {
  kind: "square"; // 这个就是具有辨识性的属性
  size: number;
}
interface Rectangle {
  kind: "rectangle"; // 这个就是具有辨识性的属性
  height: number;
  width: number;
}
interface Circle {
  kind: "circle"; // 这个就是具有辨识性的属性
  radius: number;
}
type Shape = Square | Rectangle | Circle; // 这里使用三个接口组成一个联合类型，并赋给一个别名Shape，组成了一个可辨识联合。
function getArea(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}
```

上面这个例子中，我们的 Shape 即可辨识联合，它是三个接口的联合，而这三个接口都有一个 kind 属性，且每个接口的 kind 属性值都不相同，能够起到标识作用。

- **使用 never 类型**

  我们在学习基本类型时学习过，当函数返回一个错误或者不可能有返回值的时候，返回值类型为 never。所以我们可以给 switch 添加一个 default 流程，当前面的 case 都不符合的时候，会执行 default 后的逻辑：

  ```typescript
  function assertNever(value: never): never {
    throw new Error("Unexpected object: " + value);
  }
  function getArea(s: Shape) {
    switch (s.kind) {
      case "square":
        return s.size * s.size;
      case "rectangle":
        return s.height * s.width;
      case "circle":
        return Math.PI * s.radius ** 2;
      default:
        return assertNever(s); // error 类型“Triangle”的参数不能赋给类型“never”的参数
    }
  }
  ```

  采用这种方式，需要定义一个额外的 asserNever 函数，但是这种方式不仅能够在编译阶段提示我们遗漏了判断条件，而且在运行时也会报错。

## [关键词使用](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)

- **Parameters**: 获取函数的参数类型

  > `Parameters<typeof 函数名称>`

  ```ts
  function test(a: string, b: number) {
    return {
      a,
      b,
    };
  }

  type testtype = Parameters<typeof test>;
  // type testtype = [a: string, b: number]

  // 获取的是 类型值
  type testtype1 = Parameters<typeof test>[1];
  // type testtype1 = number
  ```

  ::: tip

  ```ts
  // 实现
  // 1. 首先用infer
  // 2. 然后用extends约束， 在这里理解为判断
  // 3. 三目运算
  // 先检测， 符合返回 infer P， 不符合返回 never
  type ParamType<T> = T extends (arg: infer P) => any ? P : T;
  ```

  :::

- **ReturnType**: 获取函数的返回值关键词

  > `ReturnType<typeof 函数>`

  ```ts
  interface typeb {
    name: string;
    age: number;
  }
  let person: typeb = {
    name: "xiaoming",
    age: 12,
  };

  function test(person: typeb) {
    return person;
  }

  type testtype2 = ReturnType<typeof test>;
  // type testtype2 = typeb
  ```

  ::: tip

  ```ts
  type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
  ```

  :::

- **keyof**获取一个对象的所有 key 值

```ts
type Obj = { a: string; b: string };
type Foo = keyof obj;
// type Foo = 'a' | 'b';
```

- **in**可以遍历枚举类型

```ts
type Keys = "a" | "b" | "c";
type Obj = {
  [T in Keys]: string;
};
// in 遍历 Keys，并为每个值赋予 string 类型

// type Obj = {
//     a: string,
//     b: string,
//     c: string
// }
```

- **`Partial<T>`** 将类型的属性变成可选

  ```ts
  type Partial<T> = {
    [P in keyof T]?: T[P];
  };
  ```

  但是当前指支持处理一层，如果多层就要自己处理，则可以递归处理

  ```ts
  type DeepPartial<T> = {
    // 如果是 object，则递归类型
    [U in keyof T]?: T[U] extends object ? DeepPartial<T[U]> : T[U];
  };
  ```

- **Required**将类型的属性变成必选

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

- **Pick**从某个类型中挑出一些属性出来

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
interface UserInfo {
  id: string;
  name: string;
}
type NewUserInfo = Pick<UserInfo, "name">; // {name: string;}
```

- **Record** 可以获得根据 K 中所有可能值来设置 key 以及 value 的类型

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

- **`Mutable<T>`** 将类型的属性变成可修改

```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
```

- **Readonly** 类型的属性变成只读

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

- **ReturnType**用来得到一个函数的返回值类型

```ts
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
```

- **infer**
  infer 关键字用于在条件类型（Conditional Types）中推断（infer）类型的组成部分。它通常与泛型和高级类型操作一起使用，以便从复杂类型中提取信息。infer 可以让你定义新的类型，这些类型基于现有类型的结构

## 符号

- **！**:非空断言
  > 告诉编辑器某个变量不会是 null 或者 undefined
- **?**

```js
const orderId = response?.result?.data?.orderId || "";
```

obj?.prop // 对象属性
obj?.[expr] // 对象属性
arr?.[index] // 获取数据中 index 下标对应的值
func?.(...args) // 函数或对象方法的调用

## interface 和 type 的区别

- 扩展方式

  - Interface：支持通过关键字 extends 来继承其他接口
    ```ts
    interface Animal {
      name: string;
    }
    interface Bear extends Animal {
      honey: boolean;
    }
    ```
  - Type Alias：可以通过交叉类型（&）来实现类似的扩展效果。
    ```ts
    type Animal = {
      name: string;
    };
    type Bear = Animal & {
      honey: boolean;
    };
    ```

- 合并

  - Interface：在同一作用域内可以多次声明同一个接口，并且会自动合并为一个单一的接口
    ```ts
    interface Box {
      height: number;
    }
    interface Box {
      width: number;
    }
    // 结果是 {height: number; width: number;}
    ```
  - Type Alias：不允许重复定义相同的类型别名，这样做会导致编译错误

- 基本类型与原始值的别名

  - Interface：只能用于定义对象的形状，不能用来给基本类型或其他非对象类型创建别名。
  - Type Alias：不仅可以用来定义对象结构，还可以用来为基本类型、联合类型、元组等创建别名。

- 实现类
  - Interface：可以用作类的实现目标
    ```ts
    interface Point {
      x: number;
      y: number;
    }
    class SomePoint implements Point {
      x: number;
      y: number;
    }
    ```
  - Type Alias：不能直接用作类的实现目标。
- type 可以派生新类型， interface 不好处理
  ```ts
  interface Shape {}
  interface Quare {}
  type size = Shape | Quare;
  ```

## `extends` 和 `implements` 的区别

- `extends` 关键字用于表示类与类之间的关系，表示一个类继承另一个类，继承意味着子类可以继承父类的属性和方法，并且可以添加自己的属性和方法。
- `implements` 关键字用于表示类与接口之间的关系，表示一个类实现一个或多个接口，实现意味着类必须实现接口中定义的所有属性和方法，否则会导致编译错误。【抽象约束】

## 资料引用

<a href="https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html" target="_blank"  style="display: block"> Typescript 官网</a>

## 工具

<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html" target="_blank"  style="display: block"> 类型操作工具</a>

<a href="https://github.com/type-challenges/type-challenges" target="_blank"  style="display: block"> 类型扩展练习</a>

<a href="https://www.typescriptlang.org/docs/handbook/decorators.html#handbook-content" target="_blank"  style="display: block"> 装饰器</a>
<a href="https://jkchao.github.io/typescript-book-chinese/#why" target="_blank"  style="display: block"> 深入理解 TypeScript</a>

<a href="https://github.com/react-hook-form/react-hook-form" target="_blank"  style="display: block">react-hook-form </a>

<a href="https://zod.dev/README_ZH" target="_blank"  style="display: block">zod </a>
