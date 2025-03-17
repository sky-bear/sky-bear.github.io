# SSE(Server-Sent Events)

## 定义
SSE(Server-Sent Events), 直译就是使用服务器发送事件, 是一种允许服务器向浏览器推送信息的技术。SSE 是基于 HTTP 协议的, 可以通过 HTTP 请求来建立连接, 然后服务器可以通过 HTTP 响应来向客户端推送信息。我们常见的 http 交互方式是客户端发起请求，服务端响应，然后一次请求完毕,但是SSE可以一直保持连接, 持续向客户端输出数据。

##   使用场景
由于是单项的数据输出【服务端 => 客户端】, 所以适合用于需要服务器主动推送的场景, 比如股票行情、新闻推送、实时消息,AI 场景等。

## 优点
1. 服务器可以主动推送数据到客户端, 不需要客户端不断的轮询请求。
2. 服务器和客户端之间的连接是长连接, 可以减少连接的建立和关闭的开销。


## EventSource

EventSource 是 HTML5 中定义的一个接口, 用于接收服务器推送的事件。它是一个基于 HTTP 的协议, 可以通过 HTTP 请求来建立连接, 然后服务器可以通过 HTTP 响应来向客户端推送信息。




具体使用就不说了, 可以参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource)


## microsoft/fetch-event-source
由于EventSource只支持get请求, 所以微软开源了一个库[microsoft/fetch-event-source](https://github.com/microsoft/fetch-event-source)来支持post请求, 以及支持自定义请求头等。



本质上是使用fetch, 设置请求头中的accept为`text/event-stream`

```js
export function fetchEventSource(input, _a) {
    var { signal: inputSignal, headers: inputHeaders, onopen: inputOnOpen, onmessage, onclose, onerror, openWhenHidden, fetch: inputFetch } = _a, rest = __rest(_a, ["signal", "headers", "onopen", "onmessage", "onclose", "onerror", "openWhenHidden", "fetch"]);
    return new Promise((resolve, reject) => {
        const headers = Object.assign({}, inputHeaders);
        // 设置请求头
        if (!headers.accept) {
            headers.accept = EventStreamContentType;
        }
        let curRequestController;
        function onVisibilityChange() {
            curRequestController.abort();
            if (!document.hidden) {
                create();
            }
        }
        // 是否页面不可见时, 继续请求
        if (!openWhenHidden) {
            document.addEventListener('visibilitychange', onVisibilityChange);
        }
        let retryInterval = DefaultRetryInterval;
        let retryTimer = 0;
        function dispose() {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.clearTimeout(retryTimer);
            curRequestController.abort();
        }
        // 添加事件外部事件调用中止
        inputSignal === null || inputSignal === void 0 ? void 0 : inputSignal.addEventListener('abort', () => {
            dispose();
            resolve();
        });
        const fetch = inputFetch !== null && inputFetch !== void 0 ? inputFetch : window.fetch;
        const onopen = inputOnOpen !== null && inputOnOpen !== void 0 ? inputOnOpen : defaultOnOpen;
        async function create() {
            var _a;
            curRequestController = new AbortController();
            try {
                const response = await fetch(input, Object.assign(Object.assign({}, rest), { headers, signal: curRequestController.signal }));
                await onopen(response);
                await getBytes(response.body, getLines(getMessages(id => {
                    if (id) {
                        headers[LastEventId] = id;
                    }
                    else {
                        delete headers[LastEventId];
                    }
                }, retry => {
                    retryInterval = retry;
                }, onmessage)));
                onclose === null || onclose === void 0 ? void 0 : onclose();
                dispose();
                resolve();
            }
            catch (err) {
                if (!curRequestController.signal.aborted) {
                    try {
                        const interval = (_a = onerror === null || onerror === void 0 ? void 0 : onerror(err)) !== null && _a !== void 0 ? _a : retryInterval;
                        window.clearTimeout(retryTimer);
                        retryTimer = window.setTimeout(create, interval);
                    }
                    catch (innerErr) {
                        dispose();
                        reject(innerErr);
                    }
                }
            }
        }
        create();
    });
}
```