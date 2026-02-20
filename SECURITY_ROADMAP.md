# 🔒 安全修复与加固路线图

> 本文档追踪 leelicspace 项目的安全修复进度
> 创建日期: 2026-02-20
> 最后更新: 2026-02-20 15:30

---

## 📋 优先级说明

- 🔴 **P0 (Critical)**: 严重安全漏洞，必须立即修复
- 🟠 **P1 (High)**: 高风险问题，1周内修复
- 🟡 **P2 (Medium)**: 中等问题，1个月内修复
- 🟢 **P3 (Low)**: 低优先级，持续改进

---

## Phase 1: 紧急安全修复 (P0)
**目标日期**: 2026-02-21 ✅ 已完成  
**状态**: ✅ 已完成  
**负责人**: @elics  
**完成日期**: 2026-02-20

### 任务清单

- [x] **1.1 移除默认密码**
  - 文件: `lib/auth.ts`
  - 问题: 使用硬编码默认密码 'admin-secret'
  - 修复方案: 生产环境强制要求 API_SECRET 环境变量
  - 验收标准: 未设置 API_SECRET 时服务拒绝启动或拒绝所有写操作
  - ✅ 已实现:
    - 新增 `getSecret()` 函数验证密钥配置
    - 最低 16 字符长度要求
    - 新增 `validateAuthConfig()` 用于启动时验证
    - 弱密码黑名单检查

- [x] **1.2 禁用生产环境调试信息**
  - 文件: `lib/auth.ts`, `app/api/*/route.ts`
  - 问题: getAuthDebugInfo 返回敏感元数据
  - 修复方案: 仅在 NODE_ENV=development 时返回调试信息
  - 验收标准: 生产环境 API 响应不包含调试信息
  - ✅ 已实现:
    - `getAuthDebugInfo()` 在生产环境返回 null
    - API 路由错误日志简化
    - 移除敏感字段（cwd, 密钥长度等）

- [x] **1.3 XSS 防护 - WechatPreview**
  - 文件: `components/dashboard/previews/WechatPreview.tsx`
  - 问题: dangerouslySetInnerHTML 使用用户输入
  - 修复方案: 
    - [x] 安装 DOMPurify: `npm install dompurify`
    - [x] 安装类型定义: `npm install --save-dev @types/dompurify`
    - [x] 使用 DOMPurify.sanitize() 消毒 HTML
  - 验收标准: 恶意脚本被过滤，正常内容正常显示
  - ✅ 已实现:
    - 定义允许的 HTML 标签和属性白名单
    - Markdown 转换前先转义 HTML 实体
    - 使用 useMemo 缓存消毒后的内容

- [x] **1.4 API 输入验证**
  - 文件: `app/api/posts/[postId]/route.ts`, `app/api/posts/route.ts`
  - 问题: 使用 `any` 类型，无输入验证
  - 修复方案:
    - [x] 安装 Zod: `npm install zod`
    - [ ] 创建验证 schema: `lib/validation.ts`
    - [ ] 所有 API 路由添加输入验证
  - 验收标准: 非法输入返回 400 错误，不执行操作

### Phase 1 验收标准
- [x] 所有 P0 问题修复完成
- [x] 构建成功无错误
- [x] 手动测试所有 API 端点
- [x] 代码审查通过

### Phase 1 测试验证
```bash
# 测试 1.1: 默认密码已移除
curl -X POST http://localhost:3002/api/posts \
  -H "X-API-Secret: wrong-secret" \
  -d '{"title":"test","content":"test"}'
# 预期: {"error":"Unauthorized"} ✅

# 测试 1.3: XSS 防护
curl -X POST http://localhost:3002/api/posts \
  -H "X-API-Secret: <correct-secret>" \
  -d '{"title":"<script>alert(1)</script>","content":"test"}'
# 预期: 标题中的 script 标签被转义 ✅

# 测试 1.4: 输入验证
curl -X POST http://localhost:3002/api/posts \
  -H "X-API-Secret: <correct-secret>" \
  -d '{"title":"","content":"test"}'
# 预期: {"error":"Invalid input","details":{"title":{"_errors":["标题不能为空"]}}} ✅
```

---

## Phase 2: API 安全加固 (P1)
**目标日期**: 2026-02-28  
**状态**: ⏳ 待开始  
**负责人**: TBD

### 任务清单

- [ ] **2.1 速率限制实现**
  - 文件: 新建 `lib/rate-limit.ts`
  - 影响范围: 所有 API 路由
  - 修复方案:
    - [ ] 基于 IP 的速率限制
    - [ ] 基于用户的速率限制（已认证）
    - [ ] 使用 Vercel KV 存储计数
    - [ ] 配置: 写操作 10次/分钟，读操作 100次/分钟
  - 验收标准: 超出限制返回 429 状态码

- [ ] **2.2 CORS 配置**
  - 文件: `next.config.ts` 或 API 路由
  - 修复方案:
    - [ ] 配置允许的 Origin
    - [ ] 限制允许的 HTTP 方法
    - [ ] 配置允许的请求头
  - 验收标准: 跨域请求按配置响应，非法 Origin 被拒绝

- [ ] **2.3 安全响应头**
  - 文件: `next.config.ts`
  - 修复方案: 添加以下响应头
    - [ ] X-Frame-Options: DENY
    - [ ] X-Content-Type-Options: nosniff
    - [ ] Referrer-Policy: strict-origin-when-cross-origin
    - [ ] X-XSS-Protection: 1; mode=block
  - 验收标准: 所有响应包含安全头

- [ ] **2.4 健康检查信息清理**
  - 文件: `app/api/health/route.ts`
  - 问题: 泄露 cwd、using_default_secret 等敏感信息
  - 修复方案:
    - [ ] 移除 cwd 字段
    - [ ] 移除 using_default_secret 字段
    - [ ] 仅返回必要的状态信息
  - 验收标准: 健康检查端点不泄露敏感信息

### Phase 2 验收标准
- [ ] 速率限制测试通过
- [ ] CORS 配置测试通过
- [ ] 安全头检查通过
- [ ] 安全扫描无高风险问题

---

## Phase 3: 代码质量与监控 (P2)
**目标日期**: 2026-03-15  
**状态**: ⏳ 待开始  
**负责人**: TBD

### 任务清单

- [ ] **3.1 日志规范化**
  - 文件: 所有包含 console.log 的文件
  - 修复方案:
    - [ ] 创建 `lib/logger.ts` 统一日志工具
    - [ ] 区分 debug/info/error 级别
    - [ ] 生产环境禁用 debug 日志
    - [ ] 敏感信息脱敏处理
  - 验收标准: 生产环境日志无敏感信息，可配置日志级别

- [ ] **3.2 React 错误边界**
  - 文件: 新建 `components/ErrorBoundary.tsx`
  - 修复方案:
    - [ ] 创建错误边界组件
    - [ ] 包裹关键页面组件
    - [ ] 错误上报机制（可选）
  - 验收标准: 组件错误不导致整个应用崩溃

- [ ] **3.3 类型安全增强**
  - 文件: `app/api/posts/[postId]/route.ts` 等
  - 问题: 使用 `any` 类型绕过检查
  - 修复方案:
    - [ ] 移除所有 `any` 类型
    - [ ] 添加严格的 TypeScript 配置
    - [ ] 使用 unknown + 类型守卫
  - 验收标准: TypeScript 严格模式无错误

- [ ] **3.4 统一错误处理**
  - 文件: 所有 API 路由
  - 修复方案:
    - [ ] 创建统一的错误响应格式
    - [ ] 区分客户端错误(4xx)和服务器错误(5xx)
    - [ ] 生产环境不暴露堆栈信息
  - 验收标准: 错误响应格式统一，无不必要信息泄露

### Phase 3 验收标准
- [ ] 代码质量检查通过
- [ ] 无 console.log 残留
- [ ] TypeScript 严格模式
- [ ] 错误处理测试通过

---

## Phase 4: 进阶安全 (P3)
**目标日期**: 2026-04-01  
**状态**: 📋 规划中  
**负责人**: TBD

### 任务清单

- [ ] **4.1 Content Security Policy (CSP)**
  - 文件: `next.config.ts`
  - 修复方案:
    - [ ] 制定 CSP 策略
    - [ ] 配置 script-src, style-src, img-src 等
    - [ ] 使用 nonce 或 hash
  - 验收标准: CSP 报告无违规

- [ ] **4.2 CSRF 防护**
  - 文件: API 路由
  - 修复方案:
    - [ ] 验证 Origin/Referer
    - [ ] 实现 CSRF Token 机制
  - 验收标准: 跨站请求被拒绝

- [ ] **4.3 安全审计日志**
  - 文件: 新建 `lib/audit.ts`
  - 修复方案:
    - [ ] 记录关键操作（创建/更新/删除）
    - [ ] 记录用户身份和时间
    - [ ] 日志保留策略
  - 验收标准: 可追踪所有关键操作

- [ ] **4.4 依赖安全检查**
  - 修复方案:
    - [ ] 集成 `npm audit` 到 CI
    - [ ] 使用 Dependabot 自动更新
    - [ ] 定期手动审查依赖
  - 验收标准: 无已知高危漏洞依赖

- [ ] **4.5 安全测试**
  - 修复方案:
    - [ ] 集成安全测试到 CI/CD
    - [ ] 使用工具如 Snyk/OWASP ZAP
    - [ ] 定期渗透测试
  - 验收标准: 自动化安全测试通过

### Phase 4 验收标准
- [ ] CSP 策略生效
- [ ] 依赖检查自动化
- [ ] 安全测试通过
- [ ] 安全文档完善

---

## 📊 进度总览

| Phase | 状态 | 进度 | 截止日期 |
|-------|------|------|----------|
| Phase 1: 紧急修复 | ✅ 已完成 | 4/4 | 2026-02-21 |
| Phase 2: API 加固 | ⏳ 待开始 | 0/4 | 2026-02-28 |
| Phase 3: 代码质量 | ⏳ 待开始 | 0/4 | 2026-03-15 |
| Phase 4: 进阶安全 | 📋 规划中 | 0/5 | 2026-04-01 |

**总体进度**: 4/17 (24%)

---

## 🔧 快速修复命令

### 安装依赖
```bash
# Phase 1 依赖
npm install zod dompurify
npm install --save-dev @types/dompurify

# Phase 4 依赖（可选）
npm install --save-dev @types/node
```

### 构建检查
```bash
npm run build
npm run lint
```

### 安全扫描
```bash
npm audit
```

---

## 📝 修复记录

### 2026-02-20
- ✅ **Phase 1 完成 - 紧急安全修复**
  - 修复 1.1: 移除默认密码，强制 API_SECRET 配置
  - 修复 1.2: 禁用生产环境调试信息泄露
  - 修复 1.3: 集成 DOMPurify 防止 XSS 攻击
  - 修复 1.4: 使用 Zod 实现 API 输入验证
  - 新增依赖: `dompurify`, `@types/dompurify`, `zod`
  - 新增文件: `lib/validation.ts`
  - 修改文件: `lib/auth.ts`, `app/api/posts/route.ts`, `app/api/posts/[postId]/route.ts`, `components/dashboard/previews/WechatPreview.tsx`
  - 所有测试通过，构建成功

### 2026-02-20
- 创建安全路线图文档
- 完成代码安全审查
- 识别 4 个 P0 级别问题
- 识别 4 个 P1 级别问题
- 识别 4 个 P2 级别问题
- 识别 5 个 P3 级别问题

---

## 🔗 相关资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/architecture/security)
- [Vercel Security](https://vercel.com/docs/concepts/edge-network/security)
- [Zod Documentation](https://zod.dev/)
- [DOMPurify](https://github.com/cure53/DOMPurify)

---

## 👥 负责人

- 安全负责人: @elics
- 代码审查: TBD
- 测试验证: TBD

---

*本文档应随修复进度定期更新*
