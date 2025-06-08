# Node 基础

<script setup>
import Image from "../components/Image/index.vue"
</script>

## 基础

Node.js 是异步事件驱动的单线程模型。
由于 Node.js 异步非阻塞的特性，因此适用于 I/O 密集型的应用场景。Node.js 是单线程模型，需要避免 CPU 的耗时操作。

### 版本管理

NVM

```md
https://nvm.uihtm.com/#google_vignette
```

## 事件循环

### 循环图

<Image  src="/node/images/event.png" />
<Image  src="/node/images/event-1.png" />

### 主线程

- 启动入口文件， 运行主函数
- eventLoop: 检查是否需要进入事件循环
  - 检查其他线程里是否还有待处理事项
  - 检查其他任务是否还在进行中（比如计时器、文件读取操作等任务是否完成）
  - 有以上情况，进入事件循环，运行其他任务
    事件循环的过程：沿着从 timers 到 close callbacks 这个流程，走一圈。到 event loop 看是否结束，没结束再走一圈。
- over：所有的事情都完毕，结束

### 事件循环

- **timers: 执行 setTimeout() 和 setInterval()中到期的 callback**
- pending callbacks: 执行延迟到下一个循环迭代的 I/O 回调
- idle, prepare: 仅系统内部使用
- **poll: 检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了 close 事件的 callback，那些关闭的回调会被 close callbacks 阶段执行）**
- **check: 执行 setImmediate()的 callback**
- close callbacks: 执行 close 事件的 callback，例如 socket.on('close')这种

### 核心周期

<Image  src="/node/images/event-2.png" />

## 内存

Node.js 的内存限制是根据系统的物理内存大小动态分配的，并且在不同操作系统下可能会有所不同。在大多数情况下，Node.js 默认的内存限制应该是 1.4 GB（1024 _ 1024 _ 1400 字节）,（64 位系统下约为 1.4 GB，32 位系统下约为 0.7 GB）。但是请注意，这个限制在不同的版本和设置中可能会有所不同。可以调整， 最大为当前值的两倍

## commonjs 解析

文件内的内容被包装成一个函数，并传入五个参数，exports, require, module, **filename, **dirname

```js
// 包装文件内容并返回可执行的函数：
/*
        (function (exports, require, module, __filename, __dirname) {
            file content...
        })
    */
```

- 模块导出的数据存放在 module.exports 对象中。
- exports 是 module.exports 的别名。
- 模块加载过一次后会进行缓存，第二次加载时直接返回上一次的缓存结果。
- Node.js 会检测出当前代码是否存在循环引用，并做相应的处理。

## 常用 API

### commonjs 模块对象

使用 CommonJS 规范的文件模块对象。

#### 特性

1. require：加载文件模块导出的对象。
2. module.exports：存储文件模块导出的对象。
3. \_\_dirname: 当前模块的文件夹路径。
4. \_\_filename: 当前模块的文件路径。
5. exports：模块导出对象，是 module.exports 的别名。
6. require.cache：存储已加载的模块的缓存对象。
7. require.main：主入口文件模块对象。
8. require.resolve：返回模块解析后的文件路径。

### ESM 模块

生效规则

1. 如果文件扩展名为.js。只有最近的 package.json 文件的 type 属性值为 module 时，Node.js 才会认为文件使用的是 ESM 规范的模块，其它情况都会认为采用的是 CommonJS 规范的模块。
2. 无论 type 字段的值如何，.mjs 文件始终被视为 ES 模块，.cjs 文件总是被视为 CommonJS 模块。

引用时不能省略扩展名

#### 特性

1. 直接在内置的模块中导出 API

```js
import { readFile } from "node:fs";
import { URL } from "node:url";
readFile(
  new URL("./foo.txt", import.meta.url),
  { encoding: "utf8" },
  (err, source) => {
    if (err) {
      console.error(err);
    } else {
      console.log(source);
    }
  }
);
```

2. import.meta
   包含 url 和 resolve 属性的对象。
3. import.meta.url
   返回当前文件的 url 路径，以 file://协议开头。

```js
// file:///app/index.mjs
console.log(import.meta.url);
```

4. import.meta.resolve

总结：ESM 和 CommonJS 的区别

1. ESM 没有 require、exports、module.exports。
2. ESM 没有**filename、**dirname。
3. ESM 没有 require.resolve，不过可以使用 import.meta.resolve。
4. ESM 没有 require.cache。

### Modules:node:module API

1. module.builtinModules
   Node.js 提供的所有模块的名称列表。可用于验证模块是否由第三方维护。

```js
const builtin = require("node:module").builtinModules;
```

2. module.createRequire(filename)
   创建 require 函数。filename 参数必须是 URL 对象、URL 字符串，或者是绝对路径。

```js
// sibling-module.js
module.exports = {
  name: "sibling-module",
};
// index.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const siblingModule = require("./sibling-module");
console.log(siblingModule);
```

3. module.isBuiltin(moduleName)
   检测模块是否是内置模块。

```js
const isBuiltin = require("node:module").isBuiltin;
console.log(isBuiltin("node:path")); // true
console.log(isBuiltin("path")); // true
console.log(isBuiltin("wss")); // false
```

### URL 模块

URL 模块提供了一些非常实用的用于解析 URL 的方法

### Query 模块

Query String 模块提供了一些非常实用的用于解析查询字符串的方法。

### path 模块

Path 模块提供了用于处理文件和目录路径的实用程序

path.join()和 path.resolve()的区别
path.join 是用来连接路径片段，并返回规范化后的路径；而 path.resolve 将路径片段解析为绝对路径。

```js
// 例子1
// /bar/foo
console.log(path.join("/bar", "/foo"));
// /foo
console.log(path.resolve("/bar", "/foo"));

// 例子2：假如当前命令执行的目录是/home/myself/node（和代码文件所在的目录没有关系）
// bar/foo/
console.log(path.join("bar/", "foo/"));
// /home/myself/node/bar/foo
console.log(path.resolve("bar/", "foo/"));
```

### OS 模块

### File System 模块

### process 模块

process 对象提供有关当前 Node.js 进程的信息并对其进行控制

- process.env： 属性返回包含用户环境的对象
- process.cwd() 方法返回 Node.js 进程的当前工作目录

### Events 模块

### Stream 模块

### HTTP 模块

## 字符集 Buffer

字符集是一系列字符（文字、标点符号等）的集合。字符集有很多，常见的有 ASCII、Unicode、GBK 等。不同字符集主要的区别在于包含字符个数的不同
Node.js 目前支持的字符编码包括：

- 'ascii'仅支持 7 位 ASCII 数据。如果设置去掉高位的话，这种编码是非常快的。
- 'utf8'多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8 。
- 'utf16le'2 或 4 个字节，小字节序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。
- 'ucs2''utf16le' 的别名。
- 'base64'Base64 编码。Base64，顾名思义，就是包括小写字母 a-z、大写字母 A-Z、数字 0-9、符号"+"、"/"一共 64 个字符的字符集，（另加一个“=”，实际是 65 个字符）。任何符号都可以转换成这个字符集中的字符，这个转换过程就叫做 base64 编码。
- 'latin1'一种把 Buffer 编码成一字节编码的字符串的方式（由 IANA 定义在 RFC1345 第 63 页，用作 Latin-1 补充块与 C0/C1 控制码）。
- 'binary''latin1' 的别名。
- 'hex'将每个字节编码为两个十六进制字符。

Buffer 对象用于表示固定长度的字节序列。Buffer 类是 JavaScript Uint8Array 类的子类，表示一个 8 位无符号整数数组

Base64
首先将字符串（图片等）转换成二进制序列，然后按每 6 个二进制位为一组，分成若干组，如果不足 6 位，则低位补 0。每 6 位组成一个新的字节，高位补 00，构成一个新的二进制序列，最后根据 base64 索引表中的值找到对应的字符

## Crypto

`node:crypto` 模块提供了加密功能，其中包括了用于 OpenSSL 散列、HMAC、加密、解密、签名、以及验证的函数的一整套封装

```js
const crypto = require("crypto");

const input = JSON.stringfy({
  name: "张三",
  expire_time: 15637495894583,
});
const key = "jb0gZyySw1VNv8y1lZBZFVxokeHaNRd5";

// 创建Cipher实例，选择算法为aes-256-cbc，使用密钥
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

// 加密输入数据并转换为十六进制字符串
let encrypted = cipher.update(input, "utf-8", "hex");
encrypted += cipher.final("hex");

console.log("Encrypted:", encrypted);

// 创建Decipher实例，选择算法为aes-256-cbc，使用密钥
const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);

// 解密数据
let decrypted = decipher.update(encrypted, "hex", "utf-8");
decrypted += decipher.final("utf-8");

console.log("Decrypted:", decrypted);
```

## 引用

<a href="https://nwy3y7fy8w5.feishu.cn/docx/DAfudQaMDoDo0FxN70gcdZAan5P" target="_blank"  style="display: block">node 基础</a>
<a href="https://zgi82nbh1j.feishu.cn/docx/UhqjdrKwpoMIauxXLf1cy7ANnSf" target="_blank"  style="display: block">node 基础</a>
