/**
 * 接口监控SDK扩展
 */
class APIMonitor {
  constructor(monitorInstance) {
    this.monitor = monitorInstance;
    this.initFetchInterceptor();
    this.initXHRInterceptor();
  }

  // 拦截原生fetch
  initFetchInterceptor() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const [input, init] = args;
      const url = typeof input === 'string' ? input : input.url;
      const method = (init?.method || 'GET').toUpperCase();

      try {
        const response = await originalFetch(...args);
        const endTime = Date.now();

        this.monitor.report('API_METRICS', {
          type: 'FETCH',
          url,
          method,
          status: response.status,
          duration: endTime - startTime,
          success: response.ok,
          timestamp: Date.now()
        });

        return response;
      } catch (error) {
        this.monitor.report('API_ERROR', {
          type: 'FETCH',
          url,
          method,
          error: error.message,
          stack: error.stack,
          timestamp: Date.now()
        });
        throw error;
      }
    };
  }

  // 拦截XMLHttpRequest
  initXHRInterceptor() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
      this._apiMonitorData = {
        method: method.toUpperCase(),
        url,
        startTime: Date.now()
      };
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
      const xhr = this;
      const { method, url, startTime } = this._apiMonitorData;

      // 监听完成事件
      const onReadyStateChange = () => {
        if (xhr.readyState === 4) {
          const endTime = Date.now();
          
          if (xhr.status >= 200 && xhr.status < 400) {
            this.monitor.report('API_METRICS', {
              type: 'XHR',
              url,
              method,
              status: xhr.status,
              duration: endTime - startTime,
              success: true,
              timestamp: Date.now()
            });
          } else {
            this.monitor.report('API_ERROR', {
              type: 'XHR',
              url,
              method,
              status: xhr.status,
              error: xhr.statusText,
              timestamp: Date.now()
            });
          }
        }
      };

      xhr.addEventListener('readystatechange', onReadyStateChange);
      return originalSend.apply(this, arguments);
    };
  }
}

// 使用示例
// const monitor = new FrontendMonitor({...});
// const apiMonitor = new APIMonitor(monitor);