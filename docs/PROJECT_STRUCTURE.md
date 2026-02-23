# 项目结构详解

> 本文档详细介绍 leeelicspace 博客项目的工程结构，帮助新开发者快速理解项目组织方式。

## 项目概览

**项目名称**: leeelicspace  
**项目类型**: 现代化个人博客系统  
**技术栈**: Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui  
**架构特点**: 前后端一体化、国际化(i18n)、完善的测试体系

---

## 根目录结构

```
leeelicspace/
├── .claude/                    # Claude IDE 配置（可忽略）
├── .gitignore                  # Git 忽略规则
├── AGENTS.md                   # AI 助手开发指南
├── README.md                   # 项目介绍文档
├── biome.json                  # 代码规范配置（Biome）
├── components.json             # shadcn/ui 配置文件
├── next.config.ts              # Next.js 配置文件
├── package.json                # 项目依赖和脚本
├── playwright.config.ts        # E2E 测试配置
├── postcss.config.mjs          # PostCSS 配置
├── proxy.ts                    # 代理配置（已弃用）
├── tailwind.config.js          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
├── vitest.config.ts            # 单元测试配置
│
├── app/                        # Next.js App Router 主目录
├── components/                 # React 组件目录
├── docs/                       # 项目文档
├── i18n/                       # 国际化配置
├── lib/                        # 工具函数库
├── messages/                   # 翻译文件
├── public/                     # 静态资源
├── scripts/                    # 实用脚本
├── services/                   # API 服务封装
├── tests/                      # 测试目录
└── types/                      # TypeScript 类型定义
```

---

## 详细目录说明

### 1. 配置文件详解

#### `biome.json`
- **作用**: 代码规范配置，替代 ESLint + Prettier
- **关键配置**:
  - 缩进: 2 空格
  - 引号: 双引号
  - 分号: 强制使用
  - 自动组织 imports
  - 集成 Next.js 和 React 推荐规则

#### `components.json`
- **作用**: shadcn/ui 组件库配置文件
- **内容**: 组件导入路径、TypeScript 配置、Tailwind 配置引用

#### `next.config.ts`
- **作用**: Next.js 核心配置
- **关键功能**:
  - Webpack 构建配置
  - 图片域名白名单
  - 安全响应头（CSP、CORS）
  - 国际化路由配置

#### `package.json`
- **作用**: 项目元数据和依赖管理
- **关键脚本**:
  - `dev`: 开发服务器（端口 3002）
  - `build`: 生产构建
  - `lint`: 代码检查（Biome）
  - `test`: 单元测试（Vitest）
  - `test:e2e`: E2E 测试（Playwright）

#### `tsconfig.json`
- **作用**: TypeScript 编译配置
- **特点**:
  - Strict 模式启用
  - 路径别名: `@/*` 映射到根目录
  - 支持 React JSX

#### `vitest.config.ts`
- **作用**: 单元测试配置
- **配置项**:
  - 测试环境: jsdom
  - Setup 文件: `tests/setup.ts`
  - 覆盖率: v8 provider
  - 排除: `tests/e2e`（E2E 测试独立运行）

#### `playwright.config.ts`
- **作用**: E2E 测试配置
- **配置项**:
  - 测试目录: `tests/e2e`
  - 基础 URL: http://localhost:3002
  - 浏览器: Chromium
  - 截图: 失败时自动截图

---

### 2. `app/` 目录 - 应用核心

Next.js App Router 架构目录。

```
app/
├── ThemeProvider.tsx           # 主题上下文 Provider
├── globals.css                 # 全局 CSS 样式 + CSS 变量
├── icon.svg                    # 网站图标
│
├── api/                        # API 路由（后端接口）
│   ├── data.ts                 # 数据层抽象（KV/内存存储）
│   ├── health/
│   │   └── route.ts            # 健康检查端点
│   ├── posts/
│   │   ├── route.ts            # 文章列表 CRUD
│   │   ├── route.test.ts       # 文章 API 单元测试
│   │   └── [postId]/
│   │       └── route.ts        # 单篇文章操作
│   ├── rss/
│   │   └── route.ts            # RSS 订阅生成
│   ├── tags/
│   │   └── route.ts            # 标签列表
│   └── welcome/
│       └── route.ts            # 欢迎 API
│
└── [locale]/                   # 国际化路由（zh/en）
    ├── layout.tsx              # 根布局（导航、页脚）
    ├── page.tsx                # 首页
    │
    ├── about/
    │   └── page.tsx            # 关于页面
    ├── posts/
    │   └── [postId]/
    │       └── page.tsx        # 文章详情页
    ├── projects/
    │   └── page.tsx            # 项目展示页
    ├── tools/
    │   └── media-card/
    │       └── page.tsx        # 图文排版工具
    │
    └── dashboard/              # 管理后台
        ├── layout.tsx          # 后台布局
        ├── page.tsx            # 后台首页
        ├── channels/
        │   └── page.tsx        # 渠道配置
        ├── create/
        │   └── page.tsx        # 创建文章
        ├── login/
        │   └── page.tsx        # 登录页
        ├── posts/
        │   └── page.tsx        # 文章管理
        ├── settings/
        │   └── page.tsx        # 网站设置
        ├── test-login/
        │   └── page.tsx        # 测试登录
        └── write/
            ├── page.tsx        # 写作编辑器
            └── [id]/
                └── page.tsx    # 编辑文章
```

#### 关键文件说明

**`[locale]/layout.tsx`**
- 根布局组件
- 包含全局导航栏、页脚
- 集成 Radix Themes、next-intl
- 支持亮色/暗色主题切换

**`[locale]/page.tsx`**
- 首页组件
- 显示文章列表
- 支持标签筛选、搜索
- 分页展示

**`api/posts/route.ts`**
- 文章列表 API
- 支持 GET（查询）、POST（创建）
- 集成 Zod 验证、限流、认证

**`api/data.ts`**
- 数据层抽象
- 自动检测环境（开发用内存，生产用 Vercel KV）
- 提供统一的 PostStore 接口

---

### 3. `components/` 目录 - 组件层

React 组件目录，按功能分层。

```
components/
├── ArticleOutline.tsx          # 文章目录大纲
├── AuthGuard.tsx               # 认证守卫组件
├── DataErrorDisplay.tsx        # 数据错误展示
├── ErrorBoundary.tsx           # 错误边界
├── LanguageSwitcher.tsx        # 语言切换器
├── MarkdownContent.tsx         # Markdown 渲染
├── MarkdownWithOutline.tsx     # Markdown + 目录
├── ThemeToggle.tsx             # 主题切换按钮
│
├── dashboard/                  # 后台相关组件
│   ├── Editor.tsx              # Markdown 编辑器
│   ├── PlatformPreview.tsx     # 多平台预览
│   ├── PublishModal.tsx        # 发布弹窗
│   └── previews/               # 各平台预览组件
│       ├── BlogPreview.tsx
│       ├── JikePreview.tsx
│       ├── WechatPreview.tsx
│       ├── XPreview.tsx
│       └── XiaohongshuPreview.tsx
│
├── tools/                      # 工具组件
│   └── MediaCardCreator.tsx    # 图文排版工具
│
└── ui/                         # shadcn/ui 组件
    ├── avatar.tsx              # 头像组件
    ├── badge.test.tsx          # Badge 单元测试
    ├── badge.tsx               # 徽章组件
    ├── button.test.tsx         # Button 单元测试
    ├── button.tsx              # 按钮组件
    ├── card.tsx                # 卡片组件
    ├── input.tsx               # 输入框组件
    └── separator.tsx           # 分隔线组件
```

#### 组件设计原则

1. **同目录测试**: UI 组件旁边放置 `.test.tsx` 文件
2. **分层明确**: 
   - 通用组件 → `components/`
   - UI 组件 → `components/ui/`
   - 业务组件 → `components/dashboard/`
3. **Props 优先**: 组件通过 props 接收数据，保持纯粹

---

### 4. `lib/` 目录 - 工具库

纯工具函数，不依赖 React。

```
lib/
├── auth.ts                     # 认证工具
├── edge-config.ts              # Vercel Edge Config
├── errors.ts                   # 错误类和响应处理
├── kv-storage.ts               # Vercel KV 存储封装
├── logger.ts                   # 日志工具
├── rate-limit.ts               # 限流工具
├── storage.ts                  # 存储接口定义
├── swr-config.ts               # SWR 配置
├── url-helper.ts               # URL 构建工具
├── utils.ts                    # 通用工具（cn 函数等）
└── validation.ts               # Zod 验证模式
```

#### 关键模块说明

**`auth.ts`**
- API_SECRET 验证
- 支持 Header 和 Query 传递
- 强密码检查（16+ 字符）

**`errors.ts`**
- 自定义错误类（ValidationError、UnauthorizedError）
- 统一错误响应格式
- 错误日志记录

**`rate-limit.ts`**
- 基于 IP 的限流
- 读操作：100 次/分钟
- 写操作：10 次/分钟
- 分级限制（读/写/认证）

**`validation.ts`**
- Zod 验证模式定义
- 文章创建、更新、分页参数验证
- 类型安全的解析结果

**`utils.ts`**
- `cn()` 函数：合并 Tailwind 类名
- 其他通用工具函数

---

### 5. `tests/` 目录 - 测试体系

完整的测试基础设施。

```
tests/
├── e2e/                        # E2E 测试（Playwright）
│   ├── admin.spec.ts           # 后台管理测试
│   ├── api.spec.ts             # API 接口测试
│   ├── home.spec.ts            # 首页测试
│   ├── layout.spec.ts          # 响应式、性能、无障碍测试
│   ├── pages.spec.ts           # 静态页面测试
│   ├── posts.spec.ts           # 文章详情测试
│   ├── ui-screenshots.spec.ts  # UI 截图测试
│   ├── screenshots/            # 截图输出目录（gitignore）
│   └── ui-review/              # UI 审查截图（gitignore）
│
├── fixtures/                   # 测试数据
│   └── posts.ts                # 文章测试数据
│
├── mocks/                      # MSW Mock
│   └── handlers.ts             # API Mock 处理器
│
├── setup.ts                    # Vitest 初始化配置
└── test-utils.tsx              # 自定义 render 工具
```

#### 测试策略

1. **单元测试**: 
   - API 路由: `app/api/**/route.test.ts`
   - UI 组件: `components/ui/*.test.tsx`
   
2. **E2E 测试**:
   - 用户流程测试
   - 按功能拆分到不同文件

3. **Mock 数据**:
   - `fixtures/` 存放测试数据
   - `mocks/` 存放 MSW 处理器

---

### 6. `docs/` 目录 - 项目文档

```
docs/
├── README.md                   # 文档目录说明
├── SECURITY_ROADMAP.md         # 安全路线图
├── TESTING_RULES.md            # 测试规范
├── UI_UX_REVIEW.md             # UI/UX 审查记录
├── VERSIONING_RULES.md         # 版本管理规范
└── design-optimization.md      # 设计优化方案
```

#### 文档说明

- **TESTING_RULES.md**: 测试文件命名、目录结构规范
- **VERSIONING_RULES.md**: Minor-bump-only 版本策略
- **AGENTS.md**: AI 助手开发指南（根目录）

---

### 7. `i18n/` + `messages/` - 国际化

```
i18n/
└── request.ts                  # next-intl 请求配置

messages/
├── en.json                     # 英文翻译
└── zh.json                     # 中文翻译
```

#### 国际化实现

- **库**: next-intl
- **路由**: `[locale]` 动态路由
- **语言**: 中文(zh)、英文(en)
- **回退**: 未翻译的键使用默认值

---

### 8. `types/` 目录 - 类型定义

```
types/
└── index.ts                    # 全局 TypeScript 类型
```

#### 核心类型

- `Post`: 文章数据模型
- `Platform`: 发布平台枚举
- `PublishStatus`: 发布状态
- `ChannelConfig`: 渠道配置

---

### 9. `services/` 目录 - API 服务

```
services/
└── api.ts                      # 前端 API 调用封装
```

#### 功能

- 封装 fetch 调用
- 统一的错误处理
- 类型安全的请求/响应

---

### 10. `scripts/` 目录 - 实用脚本

```
scripts/
├── migrate-to-kv.js            # 数据迁移到 KV
├── repairPostIds.js            # 修复文章 ID
├── setup-edge-config.js        # 设置 Edge Config
├── test-edge-config.js         # 测试 Edge Config
└── test-kv-storage.js          # 测试 KV 连接
```

---

### 11. `public/` 目录 - 静态资源

```
public/
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

存放静态图片、字体等资源，可直接通过根路径访问。

---

## 架构流程图

### 请求处理流程

```
用户请求
    ↓
中间件 (i18n 路由)
    ↓
页面组件 ([locale]/page.tsx)
    ↓
    ├→ 服务端获取数据 (fetch)
    │       ↓
    │   API Route (app/api/*/route.ts)
    │       ↓
    │   数据层 (lib/kv-storage.ts)
    │       ↓
    │   Vercel KV / 内存存储
    │
    ↓
渲染页面 (React Server Component)
    ↓
返回 HTML
```

### 数据流

```
Dashboard (Client Component)
    ↓
SWR / useSWR (数据获取)
    ↓
services/api.ts (封装 fetch)
    ↓
API Route (app/api/posts/route.ts)
    ↓
lib/validation.ts (Zod 验证)
    ↓
lib/auth.ts (认证检查)
    ↓
lib/rate-limit.ts (限流检查)
    ↓
lib/kv-storage.ts (存储层)
    ↓
Vercel KV (生产) / 内存 (开发)
```

---

## 开发工作流

### 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器 (localhost:3002)

# 代码质量
npm run lint             # 代码检查
npm run format           # 自动格式化

# 测试
npm run test             # 单元测试 (Vitest)
npm run test:ui          # 单元测试 UI 模式
npm run test:e2e         # E2E 测试 (Playwright)
npm run test:all         # 运行所有测试

# 构建
npm run build            # 生产构建
```

### 代码规范

1. **TypeScript**: Strict 模式，无 `any`
2. **组件**: 同目录测试文件 (`*.test.tsx`)
3. **API**: Zod 验证 + 错误类处理
4. **样式**: Tailwind + shadcn/ui 组件
5. **提交**: Conventional Commits 规范

### 添加新功能流程

1. **API 端点**:
   ```
   app/api/new-feature/route.ts
   app/api/new-feature/route.test.ts
   ```

2. **页面**:
   ```
   app/[locale]/new-page/page.tsx
   ```

3. **组件**:
   ```
   components/NewComponent.tsx
   components/NewComponent.test.tsx  # 如果是 UI 组件
   ```

4. **类型**:
   ```
   types/index.ts  # 添加新类型
   ```

---

## 关键设计决策

### 1. 前后端一体化
- 使用 Next.js API Routes
- 无需独立后端服务
- 部署更简单

### 2. 存储策略
- **开发**: 内存存储（重启丢失，自动填充示例数据）
- **生产**: Vercel KV（Redis，持久化）
- 通过 `lib/data.ts` 自动切换

### 3. 认证方案
- 简单 API_SECRET 机制
- 仅用于管理后台写操作
- 无需复杂的 JWT/Session

### 4. 国际化
- next-intl 库
- 文件式翻译（JSON）
- URL 路径语言标识（/zh/, /en/）

### 5. 测试策略
- 单元测试：Vitest + Testing Library
- E2E 测试：Playwright
- 覆盖率：v8 provider

---

## 扩展建议

### 添加新 API 端点

```typescript
// app/api/new-resource/route.ts
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // 1. 限流检查
  // 2. 参数验证
  // 3. 业务逻辑
  // 4. 返回响应
}
```

### 添加新页面

```typescript
// app/[locale]/new-page/page.tsx
export default async function NewPage() {
  const t = await getTranslations();
  return <div>{t("newPage.title")}</div>;
}
```

### 添加新组件

```typescript
// components/NewComponent.tsx
interface Props {
  title: string;
}

export const NewComponent: React.FC<Props> = ({ title }) => {
  return <div>{title}</div>;
};
```

---

## 注意事项

1. **不要提交敏感信息**: `.env.local` 在 .gitignore 中
2. **不要提交测试截图**: `tests/e2e/screenshots/` 在 .gitignore 中
3. **保持测试通过**: 提交前运行 `npm run test:all`
4. **遵循代码规范**: 提交前运行 `npm run lint`

---

## 相关文档

- [AGENTS.md](../AGENTS.md) - AI 助手开发指南
- [TESTING_RULES.md](./TESTING_RULES.md) - 测试规范
- [VERSIONING_RULES.md](./VERSIONING_RULES.md) - 版本管理
- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)

---

*最后更新: 2026-02-23*
