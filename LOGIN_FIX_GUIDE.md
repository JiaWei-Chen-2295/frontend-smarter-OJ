# 登录态无法保存 - 解决方案

## 问题原因
部署到生产环境后，Cookie 无法正确保存，导致登录态丢失。

## 解决步骤

### 1. ✅ 前端配置（已完成）
- `withCredentials: true` 已在 `src/api.ts` 中配置
- 环境变量已正确设置为 `/api`

### 2. ✅ Nginx 配置（已修复）
更新后的配置已添加 Cookie 传递：
```nginx
location /api {
    proxy_pass http://127.0.0.1:18081;
    
    # Cookie 传递配置（重要）
    proxy_set_header Cookie $http_cookie;
    proxy_pass_header Set-Cookie;
    
    # 其他配置...
}
```

**部署步骤：**
1. 在宝塔面板中打开站点配置
2. 替换为 `baota-nginx.conf` 的内容
3. 保存并重载 Nginx

### 3. ⚠️ 后端配置（需要检查）

后端需要正确设置 Cookie 属性。检查后端代码中的 Cookie 设置：

#### Spring Boot 示例（如果使用）：
```java
// 在后端的配置类或拦截器中
Cookie cookie = new Cookie("SESSION", sessionId);
cookie.setPath("/");
cookie.setHttpOnly(true);
// 重要：使用反向代理后，不需要设置 SameSite=None
// cookie.setSecure(true); // 只在 HTTPS 时设置
```

#### 或在 `application.yml` 中配置：
```yaml
server:
  servlet:
    session:
      cookie:
        path: /
        http-only: true
        # 同域访问，不需要特殊的 SameSite 设置
        same-site: lax
```

### 4. 🔍 验证步骤

部署后，使用浏览器开发者工具检查：

1. **打开开发者工具 (F12) → Application/应用 → Cookies**
2. 登录后查看是否有 Cookie 被设置
3. **检查 Cookie 属性：**
   - `Domain`: 应该是 `106.14.31.134`
   - `Path`: 应该是 `/`
   - `HttpOnly`: 建议为 `true`
   - `SameSite`: `Lax` 或 `Strict`（同域不需要 `None`）

4. **查看网络请求 (Network)**
   - 登录请求的响应头应该包含 `Set-Cookie`
   - 后续请求的请求头应该包含 `Cookie`

### 5. 🐛 调试技巧

如果问题仍然存在：

#### 检查 1: Cookie 是否被设置
```bash
# 在服务器上查看 Nginx 日志
tail -f /www/wwwlogs/106.14.31.134.log
```

#### 检查 2: 后端日志
查看后端应用的日志，确认 Session 是否创建成功

#### 检查 3: 浏览器控制台
```javascript
// 在浏览器控制台执行
document.cookie
```

### 6. 常见问题

**Q: Cookie 设置了但下次请求没有携带？**
- 检查 Cookie 的 `Path` 属性是否为 `/`
- 检查 Cookie 的 `Domain` 是否正确

**Q: 登录成功但刷新页面就退出？**
- 检查前端是否正确发送 `withCredentials: true`
- 检查后端的 CORS 配置是否允许 credentials

**Q: 开发环境正常，生产环境不行？**
- 确认 Nginx 配置已正确应用
- 确认后端的 Cookie 设置适配了生产环境

## 快速检查清单

- [x] 前端 `withCredentials: true` ✅
- [x] Nginx Cookie 传递配置 ✅
- [ ] 后端 Cookie 设置正确 ⚠️（需要检查）
- [ ] 浏览器能看到 Cookie 被设置 ⚠️（需要验证）
- [ ] 后续请求携带 Cookie ⚠️（需要验证）

## 需要帮助？

如果以上步骤都完成但问题仍然存在，请提供：
1. 浏览器开发者工具的 Cookie 截图
2. 登录接口的请求/响应头截图
3. 后端的 Cookie 相关配置代码
