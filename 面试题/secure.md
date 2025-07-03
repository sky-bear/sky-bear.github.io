# 前端安全防护指南

## 1. 常见安全威胁

### 1.1 XSS (跨站脚本攻击)
- 类型：存储型、反射型、DOM型
- 防护措施：
  - 输入过滤
  - 输出编码
  - 使用CSP(内容安全策略)

### 1.2 CSRF (跨站请求伪造)
- 攻击原理：攻击者诱导用户访问恶意网站，利用用户已登录状态向目标网站发送请求
- 防护措施：
  - CSRF Token：
    - 服务端生成随机Token，包含在表单和Cookie中
    - 提交请求时验证Token是否匹配
    - 示例见`browser/example/csrf-protection.html`
  - SameSite Cookie属性：
    - Strict: 完全禁止第三方Cookie
    - Lax: 允许顶级导航的GET请求
    - None: 必须配合Secure属性使用
  - 同源检测：检查Origin/Referer头部

### 1.3 CORS (跨域资源共享)
- 安全配置
- 预检请求机制

### 1.4 点击劫持
- 攻击原理：攻击者使用透明iframe覆盖在诱骗页面上，诱导用户点击
- 防护措施：
  - X-Frame-Options HTTP头：
    - DENY: 完全禁止嵌入
    - SAMEORIGIN: 只允许同源嵌入
    - ALLOW-FROM uri: 允许指定来源嵌入
  - CSP frame-ancestors指令：
    - 'none': 禁止所有嵌入
    - 'self': 只允许同源嵌入
    - 示例见`browser/example/clickjacking-protection.html`

## 2. 安全最佳实践

### 2.1 输入验证
- 客户端验证
- 服务端验证

### 2.2 安全传输
- HTTPS强制
- HSTS头

### 2.3 会话管理
- 安全的Cookie设置
- JWT安全

## 3. 安全工具推荐
- CSP生成器
- 安全扫描工具