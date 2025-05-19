# http 缓存和本地缓存

<script setup>
import Image from "../components/Image/index.vue"
</script>

## 资源缓存

用于将静态资源按照我们所期望的规则存储在本地，用户访问网页时如果相关资源未发生改变，则可以直接从本地拿取资源渲染网页。所以资源缓存的策略其实就是用于确定资源是否已经发生了更新

<br />
资源缓存用于缓存静态资源，上面已经提到。良好的缓存策略可以减少资源重复加载进而提高网页的整体加载速度。
通常浏览器缓存策略分为两种：强缓存和协商缓存，当然还包括 service worker。

- 浏览器在资源加载时，根据请求头中的 expires 和 cache-control 值来判断是否命中强缓存，命中则直接从本地缓存中读取资源，这一过程不需请求服务器；
- 如果未命中强缓存，浏览器则会发送请求到服务器，服务器通过 last-modified 和 etag 值来验证资源是否命中协商缓存，若命中，则服务器会将这个请求返回，但是不会返回这个资源的数据，浏览器接收到该请求响应后依然从本地缓存中读取资源；
- 若强缓存和策略缓存都未命中，那么浏览器将请求服务器获得资源并加载。

强缓存和策略缓存如果命中，都是直接从客户端缓存加载对应资源。但不同点是：强缓存自比较开始至缓存命中不会请求服务端，而策略缓存的是否使用本地缓存这一决定是需要服务端参与的，换言之策略缓存需要请求服务端来完成的。

### 强缓存

强缓存通过 `Expires` 和 `Cache-Control` 响应头实现

#### Expires

中文释义为：到期，表示缓存的过期时间。expire 是 HTTP 1.0 提出的，它描述的是一个绝对时间，该时间由服务端返回。因为 expire 值是一个固定时间，因此会受本地时间的影响，如果在缓存期间我们修改了本地时间，可能会导致缓存失效。
通常表示如下：
Expires: Wed, 11 May 2018 07:20:00 GMT

#### Cache-Control

中文释义为：缓存控制。cache-control 是 HTTP 1.1 提出的，它描述的是一个相对时间，该相对时间由服务端返回。
表示如下：
Cache-Control: max-age=315360000
该属性还包括访问性及缓存方式设置，列举如下：

- no-cache 存储在本地缓存取中，只是在与服务器进行新鲜度再验证之前，缓存无法使用。
- no-store 不缓存资源到本地
- public 可被所有用户缓存，多用户进行共享，包括终端或 CDN 等中间代理服务器
- private 仅能被浏览器客户端缓存，属于私有缓存，不允许中间代理服务器缓存相关资源
  缓存与使用缓存流程说明如下：
  <br />
  协商缓存

```js
const lastModified = stat.mtime.toUTCString();
const fileEtag = etag(stat);
res.setHeader("Cache-Control", "public, max-age=0");
res.setHeader("Last-Modified", lastModified);
res.setHeader("ETag", fileEtag);

// 根据请求头判断缓存是否是最新的
console.log("🚀 ~ file: server.js:36 ~ req.headers:", req.headers);
isFresh = fresh(req.headers, {
  etag: fileEtag,
  "last-modified": lastModified,
});
```

强缓存

```js
// 使用强缓存 Cache-Control 优先级高于Expires
res.setHeader("Cache-Control", "public, max-age=5");
res.setHeader("Expires", new Date(Date.now() + 100 * 1000).toGMTString());
```

:::warning
Cache-Control 的优先级比 Expires 高！
:::

<Image  src="/browser/images/cache-1.png" />

### 协商缓存

浏览器加载资源时，若强缓存未命中，将发送资源请求至服务器。若协商缓存命中，请求响应返回 304 状态码。
协商缓存主要使用到两对请求响应头字段，分别是：

- Last-Modified 和 If-Modified-Since
- Etag 和 If-None-Match

只有协商缓存 才会在判断后添加是否要返回 304 状态

```js
res.writeHead(304, "Not Modified");
```

#### Last-Modified 与 If-Modified-Since

Last-Modified 由上一次请求的响应头返回，且该值会在本次请求中，通过请求头 If-Modified-Since 传递给服务端，服务端通过 If-Modified-Since 与资源的修改时间进行对比，若在此日期后资源有更新，则将新的资源发送给客户端。
不过，通过文件的修改时间来判断资源是否更新是不明智的，因为很多时候文件更新时间变了，但文件内容未发生更改。
这样一来，就出现了 ETag 与 If-None-Match。

#### ETag 与 If-None-Match

不同于 Last-Modified，Etag 通过计算文件指纹，与请求传递过来的 If-None-Match 进行对比，若值不等，则将新的资源发送给客户端。
值得一提的是，通常为了减轻服务器压力，并不会完整计算文件 hash 值作为 Etag，并且有些时候 Etag 的表现会退化为 Last-Modified （当指纹计算为文件更新时间时）。那为什么我们通常还是要选用 Etag 呢？原因有一下几点：

- 文件也许会发生周期性的更改，但内容并无变化，这时我们希望客户端认为这个文件是未变的；
- 文件修改频繁，比如在秒以内的时间进行修改，由于 If-Modified-Since 能读取到的时间精度为 s，因此这种场景下 If-Modified-Since 无法正常使用；
- 某些服务器不能精确获得文件的最后修改时间。

:::warning
ETag 的优先级比 Last-Modified 更高！
:::

<Image  src="/browser/images/cache-2.png" />

#### 状态码

- 200：强缓存 Expires / Cache-Control 失效时，返回新资源文件
- 200（from disk cache）Expires / Cache-Control 两者都存在且有效，Cache-Control 优先 Expires 时，浏览器从本地获取资源成功。
- 200（from memory cache）
- 304（Not Modified）协商缓存 Last-modified / Etag 有效，则服务端返回该状态码。

<Image  src="/other/performance/images/cache.png" />

#### 如何使用

缓存启用的顺序可列举如下：

1. Cache-Control —— 请求服务器之前
2. Expires —— 请求服务器之前
3. If-None-Match (Etag) —— 请求服务器
4. If-Modified-Since (Last-Modified) —— 请求服务器
   需要注意的是协商缓存需要配合强缓存使用，如果不启用强缓存那么协商缓存就失去了意义。大部分 web 服务器都默认开启了协商缓存，而且是同时启用（Last-Modified、If-Modified-Since）和（ETag、If-None-Match）。但当我们的系统选用分布式部署时，则需要注意以下问题：

- 分布式系统里多台机器间文件的 Last-Modified 必须保持完全一致，否则在请求负载均衡到不同机器时，会导致比对失败的情况；
- 分布式系统尽量关闭掉 ETag，因为每台机器生成的 ETag 都不同。

经常变更的资源采用协商缓存，不经常变更的资源采用强缓存。， 如果要做更精细化的缓存策略就要使用策略缓存

#### service worker

PWA 就是借助 service worker， 在前端实现对应资源， 以此将应用本地化

可以使用 `workbox`

#### 静态资源优化方案与思考

- 配置超长时间的本地缓存 —— 节省带宽，提高性能
- 采用内容摘要作为缓存更新依据 —— 精确的缓存控制
- 静态资源 CDN 部署 —— 优化网络请求
- 更资源发布路径实现非覆盖式发布 —— 平滑升级

#### 充分利用浏览器缓存机制

- 对于某些不需要缓存的资源，可以使用 Cache-control: no-store ，表示该资源不需要缓存
- 对于频繁变动的资源（比如经常需要刷新的首页，资讯论坛新闻类），可以使用 Cache-Control: no-cache 并配合 ETag 使用，表示该资源已被缓存，但是每次都会发送请求询问资源是否更新。
- 对于代码文件来说，通常使用 Cache-Control: max-age=31536000 并配合策略缓存使用，然后对文件进行指纹处理，一旦文件名变动就会立刻下载新的文件。
- 静态资源文件通过 Service Worker 进行缓存控制和离线化加载

## 数据缓存

用于将常使用数据存储在本地，例如用户登录态信息、不常变动且不涉及数据安全问题的数据等。数据缓存的方案有很多，例如：cookie、localstorage、indexedDB 等

> cookie，localStorage，sessionStorage，indexDB

| 特征         | cookie                                     | loaclStorage             | sessionStorage | indexDB                  |
| ------------ | ------------------------------------------ | ------------------------ | -------------- | ------------------------ |
| 数据生命周期 | 一般由服务器生成，可以设置过期时间         | 除非被清理，否则一直存在 | 页面关闭就清理 | 除非被清理，否则一直存在 |
| 存储大小     | 单个 4K                                    | 5M                       | 5M             | 无限                     |
| 与服务端通信 | 每次都会携带在 header 中，对于请求性能影响 | 不参与                   | 不参与         | 不参与                   |
| 域名         | 只受主域名控制                             | 受域名控制               | 受域名控制     |                          |

### cookie

cookie 实际是一小段文本信息。客户端请求服务端，如果服务器需要记录该用户的登录状态，就需要使用在响应时向客户端返回一个 cookie。客户端浏览器会将 cookie 保存。客户端再次请求该网站时，会携带 cookie 一同提交到服务端。此时服务端检查该 cookie 来确定用户登录状态。服务器还可以根据需要修改 cookie 内容。
cookie 包含以下属性：

- Expires ：cookie 过期时间，绝对时间；
- Max-Age：cookie 失效时间，相对时间；
- Domain：指定 cookie 可以送达的主机名。
- Path：指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部
- Secure：一个带有安全属性的 cookie 只有在请求使用 SSL 和 HTTPS 协议的时候才会被发送到服务器。
- HttpOnly: 设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 经由 Document.cookie 属性、XMLHttpRequest 和 Request APIs 进行访问，以防范跨站脚本攻击（XSS）。

```js
if (req.url === "/read") {
  // 读取 cookieconsole.log(req.headers.cookie);
  res.end(req.headers.cookie);
} else if (req.url === "/write") {
  // 设置 cookie
  res.setHeader("Set-Cookie", [
    "name=heyi; domain=heyi.com; path=/write; httpOnly=true",
    `age=28; Expires=${new Date(Date.now() + 1000 * 10).toGMTString()}`,
    `address=${encodeURIComponent("合一")}; max-age=10`,
  ]);
  res.end("Write ok");
} else {
  res.end("Not Found");
}
```
