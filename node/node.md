# Node

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

### Events 模块

### Stream 模块

### HTTP 模块

## 网络详解

### OSI & TCP/IP 模型设计

#### OSI 七层模型

osi 七层模型是国际标准化组织（ISO）制定的一个用于计算机或通信系统间互联的标准体系。它将网络通信过程分为七个层次，每一层都有特定的功能和协议。OSI 模型的设计目的是为了提供一个通用的网络通信框架，使得不同厂商和不同技术的网络设备可以相互通信。

##### 应用层

- 功能是直接向用户提供服务，完成用户希望在网络上完成的各种工作
- 文件服务、目录服务、文件传输服务（FTP）、远程登录服务（Telnet）、电子邮件服务（E-mail）、打印服务、安全服务、网络管理服务、数据库服务、DNS 服务 etc
- 在应用层交互的数据单元称为报文
- 主要能力
  - 用户接口：应用层是用户与网络，以及应用程序与网络间的直接接口，使得用户能够与网络进行交互式联系
  - 实现各种服务：该层具有的各种应用程序可以完成和实现用户请求的各种服务

##### 表示层

- 对来自应用层的命令和数据进行解释，对各种语法赋予相应的含义，并按照一定的格式传送给会话层。其主要功能是“处理用户信息的表示问题，如编码、数据格式转换和加密解密”
- 主要能力
  - 数据格式处理：协商和建立数据交换的格式，解决各应用程序之间在数据格式表示上的差异
  - 数据的编码：处理字符集和数字的转换。例如由于用户程序中的数据类型（整型或实型、有符号或无符号等）、用户标识等都可以有不同的表示方式，因此，在设备之间需要具有在不同字符集或格式之间转换的功能
  - 压缩和解压缩：为了减少数据的传输量，这一层还负责数据的压缩与恢复
  - 数据的加密和解密：可以提高网络的安全性

##### 会话层

- 向两个实体的表示层提供建立和使用连接的方法。将不同实体之间的表示层的连接称为会话。因此会话层的任务就是组织和协调两个会话进程之间的通信，并对数据交换进行管理
- 主要能力
  - 会话管理：允许用户在两个实体设备之间建立、维持和终止会话，并支持它们之间的数据交换。
  - 会话流量控制：提供会话流量控制和交叉会话功能
  - 寻址：使用远程地址建立会话连接。
  - 出错控制：从逻辑上讲会话层主要负责数据交换的建立、保持和终止，但实际的工作却是接收来自传输层的数据，并负责纠正错误。会话控制和远程过程调用均属于这一层的功能。但应注意，此层检查的错误不是通信介质的错误，而是磁盘空间、打印机缺纸等类型的高级错误。

##### 传输层

- 以下三层：数据通信，以上三层：数据处理，是通信子网和资源子网的接口和桥梁，起到承上启下的作用
- 向用户提供可靠的端到端的差错和流量控制，保证报文的正确传输，向高层屏蔽下层数据通信的细节，即向用户透明地传送报文，常见的协议：TCP、UDP
- 主要能力
  - 传输连接管理，在网络层的基础上为高层提供“面向连接”和“面向无接连”的两种服务
  - 处理传输差错。提供可靠的“面向连接”和不太可靠的“面向无连接”的数据传输服务、差错控制和流量控制。在提供“面向连接”服务时，通过这一层传输的数据将由目标设备确认，如果在指定的时间内未收到确认信息，数据将被重发
  - 监控服务质量

##### 网络层
- 负责数据包从源端到目的端的路由选择和转发。IP协议工作在这一层。
- 通过路由选择算法，为报文或分组通过通信子网选择最适当的路径
- 数据链路层的数据在这一层被转换为数据包，然后通过路径选择、分段组合、顺序、进/出路由等控制，将信息从一个网络设备传送到另一个网络设备
- 主要能力
  - 寻址：数据链路层中使用的物理地址（如 MAC 地址）仅解决网络内部的寻址问题。在不同子网之间通信时，为了识别和找到网络中的设备，每一子网中的设备都会被分配一个唯一的地址。由于各子网使用的物理技术可能不同，因此这个地址应当是逻辑地址（如 IP 地址）
  - 交换：规定不同的信息交换方式。常见的交换技术有：线路交换技术和存储转发技术，后者又包括报文交换技术和分组交换技术
  - 路由算法：当源节点和目的节点之间存在多条路径时，本层可以根据路由算法，通过网络为数据分组选择最佳路径，并将信息从最合适的路径由发送端传送到接收端
  - 连接服务：与数据链路层流量控制不同的是，前者控制的是网络相邻节点间的流量，后者控制的是从源节点到目的节点间的流量。其目的在于防止阻塞，并进行差错检测。

##### 数据链路层

数据链路层：（Data Link Layer）

- 负责建立和管理节点间的链路
- 通过各种控制协议，将有差错的物理信道变为无差错的、能可靠传输数据帧的数据链路
- 接受物理层的数据，封装成帧传给上层，接受上层数据解析成比特数据换发给物理层

##### 物理层

- 实现计算机节点之间比特流的透明传送
- 物理层的主要任务描述为确定与传输媒体的接口的一些特性，提供用于建立、保持和断开物理连接的机械的、电气的、功能的和过程的条件，也就是说物理层提供有关同步和比特流在物理媒体上的传输手段。
- 是物理硬件上的底层能力，比如光缆、电缆等设备连接形成组网
- 包括信号的调制及信道复用等

#### TCP/IP协议
<Image  src="/node/images/tcp-ip.png" />

- 应用层
  - 大多数普通与网络相关的程序为了通过网络与其他程序通信所使用的层。这个层的处理过程是应用特有的；数据从网络相关的程序以这种应用内部使用的格式进行传送，然后被编码成标准协议的格式； `HTTP数据`
  - 应用层负责处理特定的应用程序细节。包括Telnet（远程登录）、FTP（文件传输协议）、SMTP（简单邮件传送协议）以及SNMP（简单网络管理协议）等；
- 传输层 `HTTP数据 + TCP首部`
  - 两台主机上的应用程序提供端到端的通信，有2种传输协议：TCP（传输控制协议）和UDP（用户数据报协议）；
- 网络层 `HTTP数据 + TCP首部 + IP首部`
  - 处理分组在网络中的活动，例如分组的选路。网络层协议包括IP协议（网际协议）、ICMP协议（Internet互联网控制报文协议），以及IGMP协议（Internet组管理协议）；
- 网络接口层 `HTTP数据 + TCP首部 + IP首部+ 以太网首部`
  - 也称作数据链路层，包括操作系统中的设备驱动程序和计算机中对应的网络接口卡。一起处理与电缆（或其他任何传输媒介）的物理接口细节；

#### 每层加工

<Image  src="/node/images/tcp-ip-1.png" />



### TCP 和 UDP

#### 区别
 - TCP（Transmission Control Protocol），传输控制协议，是一种可靠、面向字节流的通信协议，把上面应用层交下来的数据看成无结构的字节流来发送，需要20个字节
  <Image  src="/node/images/tcp.png" />
 - UDP（User Datagram Protocol），用户数据包协议，是一个简单的面向数据报的通信协议，只是在其上面加上首部后就交给了下面的网络层，只占用8个字节（64bit）

  <Image  src="/node/images/udp.png" />


#### TCP
- 三次握手
  <Image  src="/node/images/tcp-open.png" />
- 四次挥手
 <Image  src="/node/images/tcp-close.png.png" />

TCP 提供可靠的链接， 链接是需要通过 3 次握手来建立， 关闭需要 4 次挥手关闭连接

#### TCP 三次握手
> `SYN`: synchronize 用于建立连接时同步序列号
> `ACK`: acknowledge 确认收到某个序列号
> `FIN`:  Finish，表示发送端已经没有数据发送
> `seq`: Sequence Number，数据包的序列号
> `ack`: Acknowledgment Number，期望收到的下一个序列号

 所谓的三次握手就是指建立连接时，客户端和服务器总共发送 3 个报文

1.  第一步
  - 客户端发送 SYN=1（同步标志位为1），表示请求建立连接。
  - 随机选择一个初始序列号 seq=x。
  - 状态变为 SYN_SENT
2. 第二步
  - 服务端收到 SYN 后，回应一个 SYN=1 和 ACK=1（确认标志位为1）
  - 服务端也选择一个初始序列号 seq=y，并确认客户端的序号 ack=x+1
  - 状态变为 SYN_RCVD

3. 第三步
  - 客户端发送 ACK=1 给服务端，确认服务端的 seq=y，即 ack=y+1
  - 双方连接建立成功，可以开始通信

```md
Client             Server
  |                   |
  |    SYN=1, seq=x   |
  |------------------>|
  |                   |
  |  SYN=1, ACK=1     |
  |  seq=y, ack=x+1   |
  |<------------------|
  |                   |
  |  ACK=1 seq=x+1 ack=y+1 |
  |------------------>|
  |
  [连接已建立]
```

#### TCP 四次挥手

> 四次挥手之指 TCP 连接的断开需要客户端和服务器总共发送 4 个报文

1. 第一次挥手：
  - 客户端发送 FIN=1（结束标志位为1），表示没有更多数据要发送。
  - 状态变为 FIN-WAIT-1。
2. 第二次挥手：
  - 服务端收到 FIN 后，发送 ACK=1 确认，并确认序号为 ack=x+1。
  - 服务端进入 CLOSE-WAIT 状态；客户端进入 FIN-WAIT-2。
3. 第三次挥手：
  - 服务端处理完剩余数据后，发送自己的 FIN=1。
  - 状态变为 LAST-ACK（服务端）。
4. 第四次挥手：
  - 客户端发送 ACK=1 确认服务端的 FIN，并设置 ack=z+1。
  - 客户端进入 TIME-WAIT 状态，等待 2MSL（Maximum Segment Lifetime）时间后正式关闭连接。

```md
Client             Server
  |                   |
  |  FIN=1 seq=p      |
  |------------------>|
  |                   |
  |   ACK=1 ack=p+1  | 
  |<------------------|
  |                   |
  | FIN=1 ACK=1 seq =q ack=p+1 |
  |<------------------|
  |                   |
  |      ACK=1  ack = q+1 |
  |------------------>|
  |
  [连接已关闭]
```


### HTTP
HTTP 是一个 client-server 协议：请求通过一个实体被发出，实体也就是用户代理。大多数情况下，这个用户代理都是指浏览器，当然它也可能是任何东西，比如一个爬取网页生成维护搜索引擎索引的机器爬虫。
#### 状态码
- 1XX: 100 continue 101 http ->websocket 请求服务器切换更高的协议
- 2XX: 200 ok 204 只有响应头无body 206: partial content HTTP1.1 断点续传、分块下载
- 3XX：301 永久重定向 302 暂时重定向 304 缓存
- 4XX：400 bad request 通用 403 禁止访问 404 无资源 405 method not allowed
- 5XX: 500 服务器错误 501 不支持客户端请求 502 bad gateway 代理服务器异常 503 太多，无法响应

#### http攻击
SQL：
- 通过将恶意的 Sql 查询或添加语句插入到应用的输入参数中
- 处理：对用户的输入进行转义
XSS：（Cross-site scripting）
- 存储型 XSS
  - 注入型脚本永久存储在目标服务器上。当浏览器请求数据时，脚本从服务器上传回并执行。
- 反射型 XSS
  - 当用户点击一个恶意链接，或者提交一个表单，或者进入一个恶意网站时，注入脚本进入被攻击者的网站。Web 服务器将注入脚本，比如一个错误信息，搜索结果等 返回到用户的浏览器上。由于浏览器认为这个响应来自"可信任"的服务器，所以会执行这段脚本。
- 基于 DOM 的 XSS
  - 通过修改原始的客户端代码，受害者浏览器的 DOM 环境改变，导致有效载荷的执行。也就是说，页面本身并没有变化，但由于 DOM 环境被恶意修改，有客户端代码被包含进了页面，并且意外执行。
- 处理：对用户的输入进行转义
CSRF：（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。
- 一个典型的CSRF攻击有着如下的流程：
  - 受害者登录a.com，并保留了登录凭证（Cookie）。
  - 攻击者引诱受害者访问了b.com。
  - b.com 向 a.com 发送了一个请求：a.com/act=xx。浏览器会默认携带a.com的Cookie。
  - a.com接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。
  - a.com以受害者的名义执行了act=xx。
  - 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作。
- 处理：cookie samesite

## 引用

<a href="https://nwy3y7fy8w5.feishu.cn/docx/DAfudQaMDoDo0FxN70gcdZAan5P" target="_blank"  style="display: block">node 基础</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/ECrNdLVbvop7ITxyvTlctaGJnuc" target="_blank"  style="display: block">网络详解</a>
