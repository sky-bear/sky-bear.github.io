/**
 * 基础前端监控SDK示例
 */
class FrontendMonitor {
  constructor(options = {}) {
    this.appId = options.appId || 'default';
    this.reportUrl = options.reportUrl || 'https://api.example.com/monitor';
    this.sessionId = this.generateSessionId();
    this.initPerformanceObserver();
    this.initErrorTracking();
  }

  // 生成会话ID
  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  // 初始化性能监控
  initPerformanceObserver() {
    // LCP监控
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.report('PERFORMANCE', {
        type: 'LCP',
        value: lastEntry.renderTime || lastEntry.loadTime
      });
    }).observe({type: 'largest-contentful-paint', buffered: true});

    // FID监控
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.report('PERFORMANCE', {
          type: 'FID',
          value: entry.processingStart - entry.startTime
        });
      });
    }).observe({type: 'first-input', buffered: true});
  }

  // 初始化错误监控
  initErrorTracking() {
    // JS错误
    window.addEventListener('error', event => {
      this.report('ERROR', {
        type: 'JS_ERROR',
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        position: `${event.lineno}:${event.colno}`
      });
    });

    // 未处理的Promise rejection
    window.addEventListener('unhandledrejection', event => {
      this.report('ERROR', {
        type: 'PROMISE_REJECTION',
        reason: event.reason
      });
    });
  }

  // 数据上报
  report(type, data) {
    const payload = {
      appId: this.appId,
      sessionId: this.sessionId,
      type,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 使用Beacon API上报
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {type: 'application/json'});
      navigator.sendBeacon(this.reportUrl, blob);
    } else {
      // 回退使用fetch
      fetch(this.reportUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'},
        keepalive: true
      });
    }
  }

  // 手动记录自定义事件
  trackEvent(eventName, payload = {}) {
    this.report('CUSTOM_EVENT', {
      eventName,
      ...payload
    });
  }
}

// 使用示例
// const monitor = new FrontendMonitor({
//   appId: 'your-app-id',
//   reportUrl: 'https://your-domain.com/monitor'
// });