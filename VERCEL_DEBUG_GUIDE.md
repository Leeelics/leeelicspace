# Vercel部署调试指南

## 🔍 当前修复总结

### ✅ 已修复的问题
1. **URL解析错误** - 服务器端需要完整URL
2. **数据存储问题** - 内存存储→文件存储
3. **错误日志** - 添加了详细的错误信息

### 🔧 关键修复

#### 1. URL构造修复
```typescript
// 在服务器端渲染时，需要构建完整的URL
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
               (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
```

#### 2. 数据存储修复
- **问题**：内存存储在Vercel无状态环境中失效
- **解决方案**：文件存储（`tmp/posts.json`）
- **路径**：`/tmp` 目录在Vercel中可写

#### 3. 新增健康检查端点
```
GET /api/health
```

## 🚀 部署步骤

### 1. 环境变量配置
在Vercel控制台设置以下环境变量：
```
# 可选 - 如果有自定义域名
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 生产环境标记
NODE_ENV=production
```

### 2. 部署后检查
部署完成后，依次检查：

#### ✅ 健康检查
```
https://your-app.vercel.app/api/health
```
应该返回：
```json
{
  "status": "healthy",
  "environment": {
    "node_env": "production",
    "vercel_url": "your-app.vercel.app"
  },
  "storage": {
    "type": "file-based",
    "writable": true,
    "post_count": 4
  }
}
```

#### ✅ API端点测试
```
https://your-app.vercel.app/api/posts?page=1&per_page=2
```

#### ✅ 首页加载
确保文章列表正常显示

## 🐛 常见问题排查

### 问题1: "Failed to fetch data"
**排查步骤：**
1. 检查 `/api/health` 是否可访问
2. 查看Vercel Functions日志
3. 检查环境变量是否正确设置

### 问题2: 数据不持久化
**原因：** 使用了内存存储
**解决：** 确保使用文件存储（已修复）

### 问题3: 构建失败
**检查：**
- TypeScript编译错误
- 依赖包版本冲突
- 内存使用超限

## 📊 监控和日志

### Vercel日志查看
1. 登录Vercel控制台
2. 选择你的项目
3. 点击"Functions"标签
4. 查看实时日志

### 添加更多日志
在API路由中添加：
```typescript
console.log('[API] Request details:', {
  url: request.url,
  method: request.method,
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV
});
```

## 🔄 数据备份策略

由于使用文件存储，建议：
1. 定期导出文章数据
2. 考虑升级到数据库存储（如Vercel Postgres）
3. 使用Git LFS存储数据文件

## 🚀 长期优化建议

### 1. 升级数据库存储
考虑使用：
- Vercel KV（Redis）
- Vercel Postgres
- PlanetScale
- Supabase

### 2. 添加缓存
- API响应缓存
- CDN缓存
- Redis缓存

### 3. 监控工具
- Sentry错误监控
- Vercel Analytics
- 自定义监控指标

## 📞 获取帮助

如果问题仍然存在：
1. 检查Vercel Functions日志
2. 使用健康检查端点诊断
3. 在GitHub Issues中报告具体问题
4. 提供完整的错误日志和环境信息