# AGENTS.md - leeelicspace 个人博客

> 本文件用于指导 AI 助手理解和协助开发该项目

## 项目概述

**leeelicspace** 是一个使用 Next.js 16 构建的现代化个人博客系统，采用前后端一体化架构，部署在 Vercel 平台上。

### 基本信息

| 属性 | 值 |
|------|-----|
| 项目名称 | leeelicspace |
| 类型 | 个人博客 |
| 技术栈 | Next.js 16 + TypeScript + Tailwind CSS v4 |
| 数据库 | Vercel KV (Redis) |
| 部署平台 | Vercel |
| 代码规范 | Biome |

## 技术架构

### 核心技术

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS v4 + Catppuccin 主题
- **运行时**: React 19 + React Compiler
- **存储**: Vercel KV (生产) / 内存 (开发)

### 项目结构

```
leeelicspace/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── posts/         # 文章 CRUD API
│   │   ├── tags/          # 标签 API
│   │   ├── rss/           # RSS 订阅
│   │   └── data.ts        # 数据层抽象
│   ├── dashboard/         # 管理后台
│   │   ├── page.tsx       # 仪表板
│   │   ├── login/         # 登录页
│   │   ├── create/        # 创建文章
│   │   ├── posts/         # 文章管理
│   │   └── settings/      # 网站设置
│   ├── posts/[postId]/    # 文章详情页
│   ├── projects/          # 项目展示页
│   ├── page.tsx           # 首页
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ArticleOutline.tsx # 文章目录
│   ├── AuthGuard.tsx      # 权限守卫
│   ├── DataErrorDisplay.tsx # 错误展示
│   ├── MarkdownContent.tsx  # Markdown 渲染
│   └── MarkdownWithOutline.tsx
├── lib/                   # 工具库
│   ├── kv-storage.ts      # Vercel KV 封装
│   ├── auth.ts            # 认证工具
│   └── url-helper.ts      # URL 工具
├── types/                 # TypeScript 类型
├── docs/                  # 项目文档
└── scripts/               # 实用脚本
```

## 开发指南

### 环境要求

- Node.js 18+
- npm 9+
- Vercel 账号 (用于 KV 存储)

### 环境变量

创建 `.env.local` 文件：

```bash
# 必需
API_SECRET=your-admin-secret-here

# Vercel KV (生产环境)
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...

# 可选
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format

# KV 存储测试
npm run test:kv
npm run migrate:kv

# E2E 测试（Playwright）
npx playwright test
npx playwright test --ui          # UI 模式
npx playwright test --reporter=list
```

### 认证方式

管理后台使用简单 secret 认证：
- Header: `X-API-Secret: your-secret`
- Query: `?secret=your-secret`
- 默认 secret: `admin-secret` (开发环境)

## 数据模型

### Post (文章)

```typescript
interface Post {
  id: string;           // 8位短哈希 ID
  title: string;        // 标题
  content: string;      // Markdown 内容
  tags: string[];       // 标签数组
  created_at: string;   // ISO 8601 时间
  updated_at: string;   // ISO 8601 时间
}
```

### API 端点

| 端点 | 方法 | 功能 | 认证 |
|------|------|------|------|
| `/api/posts` | GET | 获取文章列表 | 否 |
| `/api/posts` | POST | 创建文章 | 是 |
| `/api/posts/[id]` | GET | 获取单篇文章 | 否 |
| `/api/posts/[id]` | PUT | 更新文章 | 是 |
| `/api/posts/[id]` | DELETE | 删除文章 | 是 |
| `/api/tags` | GET | 获取所有标签 | 否 |
| `/api/rss` | GET | RSS 订阅 | 否 |

## 存储层

### 开发环境 (内存存储)

- 数据存储在内存中，重启后丢失
- 自动创建示例文章数据
- 适合本地开发和测试

### 生产环境 (Vercel KV)

- 使用 Redis 协议
- 数据持久化
- 自动扩展
- 低延迟访问

### 存储接口

```typescript
class PostStore {
  async getAllPosts(): Promise<Post[]>
  async getPostById(id: string): Promise<Post | null>
  async createPost(postData): Promise<Post>
  async updatePost(id, updateData): Promise<Post | null>
  async deletePost(id): Promise<boolean>
  async getAllTags(): Promise<string[]>
  async getSortedPosts(): Promise<Post[]>
}
```

## 主题系统

支持亮色/暗色双主题，使用 Catppuccin 配色方案：

- **亮色**: 默认 Tailwind 配色
- **暗色**: Catppuccin Mocha 配色

主题切换通过 `ThemeProvider` 和 CSS 变量实现。

## 开发注意事项

### 1. 页面渲染模式

- 首页 (`page.tsx`): `export const dynamic = "force-dynamic"`
- 文章详情: 动态路由，支持 ISR
- 管理后台: 客户端组件 ('use client')

### 2. 数据获取

```typescript
// 服务端组件中使用
const response = await fetch(buildApiUrl('/api/posts'));
const data = await response.json();
```

### 3. 认证检查

```typescript
import { isAuthenticated } from '@/lib/auth';

if (!isAuthenticated(request)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 4. 错误处理

所有 API 路由包含详细的错误日志：
- 错误消息
- 堆栈跟踪
- 环境信息
- 时间戳

## 部署

### Vercel 部署

1. 连接 GitHub 仓库
2. 配置环境变量
3. 启用 Vercel KV
4. 自动部署

### 部署前检查清单

- [ ] 环境变量已配置
- [ ] Vercel KV 已连接
- [ ] `npm run build` 本地成功
- [ ] 无 TypeScript 错误
- [ ] Biome 检查通过

## 扩展建议

### 高优先级

1. **真实数据库**: 迁移到 PostgreSQL 或 MongoDB
2. **JWT 认证**: 替换简单 secret 认证
3. **图片上传**: 集成 Cloudinary 或 AWS S3
4. **富文本编辑器**: 集成 TipTap 或 Slate

### 中优先级

5. **评论系统**: 集成 Giscus 或自建
6. **访问统计**: 集成 Vercel Analytics 或 Plausible
7. **全文搜索**: 集成 Algolia 或 Meilisearch
8. **文章草稿**: 支持草稿/发布状态

### 低优先级

9. **多语言支持**: i18n 国际化
10. **邮件订阅**: 集成 Resend 或 Mailgun
11. **社交媒体分享**: Open Graph 优化
12. **PWA 支持**: Service Worker + Manifest

## 已知问题

1. **统计面板数据**: 当前为硬编码示例数据，未连接真实统计
2. **管理员密码**: 明文存储在 localStorage，安全性较低
3. **图片存储**: 不支持图片上传，需使用外部图床
4. **文章备份**: 无自动备份机制

## AI Skills

本地安装的 AI Skills 路径（用于代码审查和优化）：

```
~/.claude/skills/
├── react-best-practices/     # Vercel React 最佳实践（57条规则）
├── web-design-guidelines/    # Web 界面设计规范
├── composition-patterns/     # React 组合模式
└── react-native-skills/      # React Native 开发技能
```

### Skill 使用场景

| Skill | 用途 | 触发条件 |
|-------|------|---------|
| react-best-practices | React/Next.js 性能优化 | 组件开发、代码审查、性能优化 |
| web-design-guidelines | UI/UX 设计规范审查 | 样式调整、可访问性检查 |
| composition-patterns | 组件架构设计 | 复杂组件重构、props 设计 |

## 端到端测试 (E2E)

使用 **Playwright** 进行端到端测试。

### 测试配置

- **测试目录**: `e2e/`
- **配置文件**: `playwright.config.ts`
- **浏览器**: Chromium
- **测试数量**: 20 个测试用例

### 测试覆盖

| 测试类别 | 数量 | 说明 |
|---------|------|------|
| 首页功能 | 3 | 加载、导航、文章链接 |
| 页面测试 | 3 | 文章详情、关于、项目 |
| API 接口 | 6 | CRUD、RSS、Health Check |
| 管理后台 | 2 | 登录流程、认证检查 |
| 响应式布局 | 2 | 移动端 (375px)、平板 (768px) |
| 性能测试 | 2 | 加载时间、性能指标 |
| 无障碍测试 | 2 | 标题结构、表单标签 |

### 运行测试

```bash
# 运行所有测试
npx playwright test

# 运行特定测试文件
npx playwright test e2e/blog.spec.ts

# UI 模式（交互式调试）
npx playwright test --ui

# 生成报告
npx playwright test --reporter=html
```

### 测试截图

测试运行时会自动截图保存到 `e2e/screenshots/`:
- `homepage.png` - 桌面端首页
- `mobile-homepage.png` - 移动端首页
- `tablet-homepage.png` - 平板端首页
- `login.png` - 登录页面
- `dashboard.png` - 管理后台
- `post-detail.png` - 文章详情页

**注意**: 截图和测试报告已添加到 `.gitignore`，不会被提交到仓库。

## 参考文档

- [Next.js 16 文档](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [Catppuccin 主题](https://catppuccin.com/)
- [Biome 配置](https://biomejs.dev/guides/getting-started/)
- [Playwright 文档](https://playwright.dev/docs/intro)

---

*最后更新: 2026-02-21*
