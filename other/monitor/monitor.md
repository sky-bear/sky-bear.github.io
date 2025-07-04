# 前端监控

## 前端监控的作用
- 提前预警，预防线上问题
- 用户行为分析
  - 基于监控的数据，进行性能优化
  - 基于监控的数据，进行产品优化
  - 基于监控的数据，进行用户行为分析
  - 基于监控的数据，进行产品迭代
- 性能监控
  - 基于监控的数据，进行性能优化
- 稳定性监控 
  - 基于监控的数据，发现问题  找到问题 解决问题



## 具体指标

- 性能
  - FP
  - FCP
  - FMP
  - LCP
  - FID
  - 接口请求时间
    - axios fetch
- 异常
  - js异常
  - 资源加载异常
  - 组件异常(vue, react)
- 行为
  - 客户端信息（浏览器，操作系统，设备信息）
  - 页面停留时间
  - 页面访问量
  - 页面访问路径
  - 用户操作记录




## 监控系统实现方案

### 1. 性能监控实现
```javascript
// 使用Performance API获取关键指标
const perfData = window.performance.timing;
const metrics = {
    FP: performance.getEntriesByName('first-paint')[0].startTime,
    FCP: performance.getEntriesByName('first-contentful-paint')[0].startTime,
    LCP: new Promise(resolve => {
        new PerformanceObserver(entryList => {
            const entries = entryList.getEntries();
            resolve(entries[entries.length-1]);
        }).observe({type: 'largest-contentful-paint', buffered: true});
    })
};
```

### 2. 异常监控实现
```javascript
// 全局错误捕获
window.addEventListener('error', (event) => {
    reportError({
        type: 'JS_ERROR',
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// 未处理的Promise rejection
window.addEventListener('unhandledrejection', (event) => {
    reportError({
        type: 'PROMISE_REJECTION',
        reason: event.reason
    });
});
```

### 3. 行为监控实现
```javascript
// 用户行为追踪
class BehaviorTracker {
    constructor() {
        this.sessionId = generateUUID();
        this.trackPageView();
        this.trackUserActions();
    }
    
    trackPageView() {
        const pageInfo = {
            url: location.href,
            referrer: document.referrer,
            loadTime: performance.now()
        };
        reportAnalytics('PAGE_VIEW', pageInfo);
    }
}
```

### 4. 监控系统架构
1. 数据采集层：浏览器端SDK
2. 数据传输层：WebSocket/Beacon API
3. 数据存储层：时序数据库(如InfluxDB)
4. 数据分析层：大数据处理平台
5. 可视化层：Grafana/自研看板

### 5. 框架特定监控

#### Vue错误监控
```javascript
// main.js
Vue.config.errorHandler = (err, vm, info) => {
  monitor.report('VUE_ERROR', {
    error: err.stack,
    component: vm.$options.name,
    lifecycleHook: info
  });
};

// 组件内错误边界
Vue.component('ErrorBoundary', {
  template: '<slot></slot>',
  errorCaptured(err, vm, info) {
    monitor.report('VUE_ERROR_BOUNDARY', {
      error: err.stack,
      component: vm.$options.name,
      info: info
    });
    return false; // 阻止错误继续向上传播
  }
});
```

#### React错误监控
```javascript
// Error Boundary组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    monitor.report('REACT_ERROR', {
      error: error.stack,
      componentStack: info.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children; 
  }
}

// 使用
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### 6. 接口行为监控

#### 请求拦截实现
```javascript
// 拦截原生fetch
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const startTime = Date.now();
  try {
    const response = await originalFetch.apply(this, args);
    const endTime = Date.now();
    
    // 记录请求指标
    monitor.report('API_REQUEST', {
      url: args[0],
      method: args[1]?.method || 'GET',
      status: response.status,
      duration: endTime - startTime,
      requestSize: JSON.stringify(args[1]?.body)?.length || 0,
      responseSize: response.headers.get('content-length')
    });
    
    return response;
  } catch (error) {
    monitor.report('API_ERROR', {
      url: args[0],
      method: args[1]?.method || 'GET',
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// 拦截axios示例
axios.interceptors.request.use(config => {
  config.metadata = { startTime: Date.now() };
  return config;
});

axios.interceptors.response.use(
  response => {
    const duration = Date.now() - response.config.metadata.startTime;
    monitor.report('API_REQUEST', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      duration,
      requestSize: JSON.stringify(response.config.data)?.length || 0,
      responseSize: JSON.stringify(response.data)?.length || 0
    });
    return response;
  },
  error => {
    if (error.config) {
      monitor.report('API_ERROR', {
        url: error.config.url,
        method: error.config.method,
        status: error.response?.status,
        error: error.message,
        stack: error.stack
      });
    }
    return Promise.reject(error);
  }
);
```

#### 监控指标
1. 成功率监控
2. 响应时间监控
3. 请求/响应大小监控
4. 错误率监控
5. 慢请求分析

### 7. 注意事项
1. 采样率控制避免数据过载
2. 敏感数据脱敏处理
3. 监控数据分环境隔离
4. 合理的监控告警阈值
5. 框架特定错误的上下文收集
6. 接口监控避免影响正常请求流程
