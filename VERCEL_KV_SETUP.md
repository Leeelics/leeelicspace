# Vercel KV 设置指南

## 🚀 快速开始

### 第一步：设置 Vercel KV

1. **登录 Vercel 控制台**
   - 访问 [vercel.com/dashboard](https://vercel.com/dashboard)
   - 选择你的项目

2. **创建 KV 数据库**
   - 点击顶部导航栏的 "Storage"
   - 点击 "Create Database"
   - 选择 "KV"
   - 输入数据库名称（如：blog-kv）
   - 选择区域（建议选择离你用户最近的区域）
   - 点击 "Create"

3. **获取连接信息**
   - 创建完成后，点击数据库名称
   - 点击 ".env.local" 标签页
   - 复制所有环境变量

### 第二步：配置环境变量

1. **在 Vercel 项目设置中添加环境变量**
   ```bash
   KV_URL=your_kv_url
   KV_REST_API_URL=your_kv_rest_api_url
   KV_REST_API_TOKEN=your_kv_rest_api_token
   KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token
   API_SECRET=your-secure-secret-key
   ```

2. **本地开发配置**
   - 复制 `.env.local.example` 为 `.env.local`
   - 填入从 Vercel 获取的值

### 第三步：部署并验证

1. **部署应用**
   ```bash
   git push origin main
   ```

2. **验证部署**
   - 访问 `https://your-app.vercel.app/api/health`
   - 应该看到：`"status": "healthy"` 和 `"writable": true`

## 🔍 故障排除

### 问题1: KV 存储连接失败
**症状**: 健康检查显示 `"connected": false`
**解决**: 
- 检查环境变量是否正确设置
- 确认 KV 数据库已创建并关联到项目
- 检查网络连接

### 问题2: API 返回 401 错误
**症状**: `Failed to fetch data: posts=401, tags=401`
**解决**:
- 确保 `API_SECRET` 环境变量已设置
- 检查 API 请求是否包含正确的认证信息
- 验证认证中间件配置

### 问题3: 数据不持久化
**症状**: 重启后数据消失
**解决**:
- 确认使用的是 Vercel KV 而不是内存存储
- 检查 KV 存储初始化是否成功
- 验证写入操作是否成功

## 📊 监控和调试

### 健康检查端点
```bash
# 基础健康检查
curl https://your-app.vercel.app/api/health

# 详细存储信息
curl https://your-app.vercel.app/api/health | jq '.storage'
```

### 查看日志
1. Vercel 控制台 → 你的项目 → Functions → 查看日志
2. 查找包含 `[KV]` 前缀的日志信息

### 测试 KV 存储
```bash
# 测试写入
curl -X POST https://your-app.vercel.app/api/test-kv \
  -H "Content-Type: application/json" \
  -d '{"action": "write"}'

# 测试读取
curl https://your-app.vercel.app/api/test-kv
```

## 🔧 高级配置

### 性能优化
- 使用 KV 的批量操作减少 API 调用
- 合理设置数据过期时间
- 使用合适的数据结构（Hash、Set、List）

### 安全设置
- 使用强密码作为 `API_SECRET`
- 定期轮换 KV 访问令牌
- 限制 KV 数据库的访问权限

### 备份策略
- 定期导出 KV 数据
- 使用 Vercel 的自动备份功能
- 考虑多区域部署以提高可用性

## 📞 获取帮助

如果仍然遇到问题：
1. 检查 Vercel Functions 日志中的详细错误信息
2. 验证所有环境变量是否正确设置
3. 使用健康检查端点诊断问题
4. 在 GitHub Issues 中报告具体问题，包含完整的错误日志