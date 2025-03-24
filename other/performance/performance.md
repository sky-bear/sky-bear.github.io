# 性能优化

## 网页渲染过程

> URL(统一资源定位符)
>
> - scheme：协议，例如 http、https、ftp 等
> - host：主机名， 例如`www`就是一个主机名
> - domain：域名，例如`www.baidu.com`就是一个域名
> - port：端口号，http 默认 80
> - path：路径
> - query：查询字符串，以键值对形式出现
> - fragment：文档/资源的名称，用于定位到某个具体的资源

### DNS 解析

DNS（域名系统）解析是将域名转换为 IP 地址的过程， DNS 通过域名查找 IP 地址， 或逆向从 IP 地址反查域名， DNS 就是一个网络服务商，我们的域名解析就是 DNS 上的一条数据

浏览器如何通过域名查询 IP

- 浏览器缓存: 浏览器会缓存 DNS 记录一段时间，这个时间就是 DNS 缓存时间（TTL 值），一般来说，DNS 的缓存时间比较短，大部分情况下，DNS 查询都会在浏览器缓存中找到结果。
- 操作系统缓存: 浏览器会查询操作系统中的 DNS 缓存，如果操作系统中有缓存，那么浏览器就会直接使用操作系统的 DNS 缓存。
- 路由器缓存: 浏览器会查询路由器的 DNS 缓存，如果路由器中有缓存，那么浏览器就会直接使用路由器的 DNS 缓存。
- ISP(互联网服务提供商) DNS 缓存: 浏览器会查询 ISP 的 DNS 缓存，如果 ISP 有缓存，那么浏览器就会直接使用 ISP 的 DNS 缓存。
- 根服务器

### 发起 TCP 请求

TCP 提供可靠的链接， 链接是需要通过 3 次握手来建立， 关闭需要 4 次挥手关闭连接

#### TCP 三次握手

> 所谓的三次握手就是指建立连接时，客户端和服务器总共发送 3 个报文

1. 客户端发送 SYN 数据包到服务器端，客户端进入 SYN_SENT 状态，等待服务器确认
2. 服务器端收到 SYN 数据包，确认客户端的 SYN，同时自己也发送一个 SYN 包，即 SYN+ACK 数据包，此时服务器进入 SYN_RECV 状态
3. 客户端收到服务器的 SYN+ACK 数据包，向服务器发送确认包 ACK，此包发送完毕，客户端和服务器进入 ESTABLISHED 状态，完成三次握手

#### TCP 四次挥手

> 四次挥手之指 TCP 连接的断开需要客户端和服务器总共发送 4 个报文

1. 客户端向服务器发送 FIN 数据包，表示客户端已经没有数据要发送给服务器了，此时客户端进入 FIN_WAIT_1 状态
2. 服务器收到客户端的 FIN 数据包，向客户端发送 ACK 数据包，表示已经收到客户端的 FIN 数据包，此时服务器进入 CLOSE_WAIT 状态，但是服务器如果发送数据给客户端，客户端依然可以接收
3. 服务器向客户端发送 FIN 数据包，表示服务器已经没有数据要发送给客户端了，此时服务器进入 LAST_ACK 状态
4. 客户端收到服务器的 FIN 数据包，向服务器发送 ACK 数据包，表示已经收到服务器的 FIN 数据包，此时客户端进入 TIME_WAIT 状态，等待 2MSL 时间后，客户端进入 CLOSED 状态，服务器收到客户端的 ACK 数据包后，进入 CLOSED 状态

### 发送 HTTP 请求

> HTTP（超文本传输协议）是一个用于传输超媒体文档（如 HTML）的应用层协议。它基于 TCP/IP 协议，用于从服务器传输超文本到本地浏览器的传输协议。

- 请求行
  - 请求方式：GET、POST、PUT、DELETE 等
  - HTTP- version 版本
- get 和 post 的区别
  - get 比 post 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息
  - get 请求参数在 url 中，post 请求参数在请求体中
  - get 请求参数有长度限制，post 请求参数没有长度限制
  - get 请求参数会被浏览器缓存，post 请求参数不会被浏览器缓存
  - get 请求参数会被浏览器自动编码，post 请求参数需要手动编码
  - get 请求参数会被浏览器自动缓存，post 请求参数不会被浏览器缓存
  - get 会产生一个 TCP 数据包，post 会产生两个 TCP 数据包（有个预检过程）
- 请求报头
  - Host：请求的主机名
  - User-Agent：浏览器的信息
  - Accept：浏览器能够接收的内容类型
  - Accept-Language：浏览器能够接收的语言
  - Accept-Encoding：浏览器能够接收的内容编码
  - Cookie：浏览器发送给服务器的 Cookie
  - Connection：浏览器与服务器的连接方式
  - Content-Type：请求体的媒体类型
  - cookie
- 请求正文
- HTTP 缓存

  > 强制缓存优先级高于协商缓存

  - 强缓存：浏览器会检查缓存是否过期，如果未过期，则直接使用缓存，否则发送请求到服务器
  - 协商缓存：浏览器会发送请求到服务器，服务器会检查缓存是否过期，如果未过期，则返回 304，否则返回新的资源
  - 缓存策略：Cache-Control、Expires、Last-Modified、ETag

  ::: warning
  **Cache-Control** 客户端缓存

  - 可缓存性

  ```markdown
  - public：HTTP 请求返回时，经过的代理服务器以及客户端都可以对内容进行缓存。
  - private：只有发起请求的浏览器可以进行缓存
  - no-cache：(协商缓存)本地和代理服务器可以缓存，但是每次使用缓存时都要到服务器验证一下，服务器返回可以使用缓存才能生效。
  ```

  - 到期性
    ```markdown
    - max-age=xxx (xxx is numeric) 缓存的内容将在 xxx 秒后失效, 这个选项只在 HTTP 1.1 可用, 并如果和 Last-Modified 一起使用时, 优先级较高
    - s-maxage 在代理服务器使用
    - max-stale = xxx 发起端设置， 即使缓存失效(max-age)，但在 max-stale 仍在在时间内，依然使用。浏览器端一般不用
    ```
  - 重新验证

    ```markdown
    - must-revalidate 浏览器重新发送请求到服务器
    - proxy-revalidate
    ```

  - 其他

  ```markdown
  - no-store 不能存缓存， 每次重新拿
  - no-transform 禁止对内容做修改
  ```

**资源验证**

- Last-Modified 上次修改时间

  ```
  配合If-Modified-Since或者If-Unmodified-Since使用， 通过对比上次修改时间以验证资源是否更新

  收到带Last-Modified这个头，下次浏览器发送request就会带上If-Modified-Since或者If-Unmodified-Since，服务器收到这个request的If-Modified-Since后，通过读取它的值对比资源存在的地方的Last-Modified，服务器就告诉浏览器是否可以使用缓存
  ```

- Etag 数据签名

  ```
  根据文件的内容生成Etag（数据签名，最常用做法是对资源内容进行哈希计算），收到带Etag这个头，下次浏览器发送request就会带上If-Match或者If-Non-Match，服务器收到这个request的上If-Match或者If-Non-Match后，通过读取它的值对比资源存在的地方的Etag，服务器就告诉浏览器是否可以使用缓存。

  ```

  :::
