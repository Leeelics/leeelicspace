# 我的博客项目文档

## 1. 项目概述

这是一个使用Next.js构建的现代化博客系统，前后端一体化架构，提供完整的博客管理功能。

### 1.1 技术栈

| 分类 | 技术 | 版本 |
| --- | --- | --- |
| 框架 | Next.js | 16+ |
| 语言 | TypeScript | 5+ |
| 样式框架 | Tailwind CSS | 3+ |
| 数据库 | 模拟内存数据库（可扩展） | - |

### 1.2 项目结构

```
├── app/                  # Next.js App Router
│   ├── admin/            # 管理后台页面
│   ├── api/              # API路由
│   ├── posts/            # 博客文章页面
│   └── projects/         # 项目页面
├── components/           # React组件
├── public/               # 静态资源
├── services/             # API服务
└── types/                # TypeScript类型定义
```

## 2. 核心架构

### 2.1 API路由

所有API路由都位于 `app/api/` 目录下，使用Next.js API Routes实现。

#### 2.1.1 主要API端点

| 端点 | 方法 | 功能 | 参数 | 权限 |
| --- | --- | --- | --- | --- |
| `/api/posts` | GET | 获取文章列表 | page, per_page, tag, search | 公开 |
| `/api/posts` | POST | 创建新文章 | title, content, tags, secret | 管理员 |
| `/api/posts/[postId]` | GET | 获取单篇文章 | postId | 公开 |
| `/api/posts/[postId]` | PUT | 更新文章 | postId, title, content, tags, secret | 管理员 |
| `/api/posts/[postId]` | DELETE | 删除文章 | postId, secret | 管理员 |
| `/api/tags` | GET | 获取所有标签 | 无 | 公开 |
| `/api/rss` | GET | 获取RSS订阅 | 无 | 公开 |

### 2.2 数据模型

#### 文章模型

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}
```

### 2.3 权限控制

- 公开接口：无需认证
- 管理员接口：需要在请求中提供 `secret` 参数，值为 `admin-secret`

### 2.4 主要功能

1. **博客前台**：
   - 首页文章列表展示
   - 文章详情页
   - 标签筛选
   - 关键词搜索
   - 分页功能

2. **管理后台**：
   - 文章管理（创建、编辑、删除）
   - 管理员登录
   - 主题设置

## 3. 组件说明

### 3.1 AuthGuard 组件

- **功能**：保护管理后台路由，确保只有管理员可以访问
- **位置**：`components/AuthGuard.tsx`
- **实现原理**：
  - 使用`localStorage`存储登录状态
  - 在组件挂载时检查登录状态
  - 未登录时重定向到登录页面
  - 已登录时渲染子组件

### 3.2 MarkdownWithOutline 组件

- **功能**：渲染Markdown内容，支持GFM（GitHub风格Markdown）
- **位置**：`components/MarkdownWithOutline.tsx`
- **实现原理**：
  - 使用`react-markdown`库渲染Markdown
  - 集成`remark-gfm`插件支持表格、代码块等扩展语法
  - 包含`MarkdownContent`子组件用于纯内容渲染
  - 保持向后兼容的API设计

## 4. 开发指南

### 4.1 环境要求

- Node.js 18+
- npm 9+

### 4.2 启动开发服务器

```bash
npm install
npm run dev
```

### 4.3 构建生产版本

```bash
npm run build
npm run start
```

## 5. 部署指南

### 5.1 部署到Vercel

1. 登录Vercel账号
2. 连接GitHub仓库
3. 配置项目设置（默认设置即可）
4. 点击"Deploy"按钮部署项目

### 5.2 其他部署方式

可以部署到Netlify、AWS Amplify或其他支持Next.js的静态站点托管服务。

## 6. 扩展建议

1. 替换模拟数据库为真实数据库（如PostgreSQL、MongoDB）
2. 实现JWT认证机制，替代简单的secret参数
3. 添加用户管理系统
4. 实现文章评论功能
5. 添加文章搜索功能
6. 实现访问统计功能
7. 添加文章分类功能
8. 实现暗色模式切换
9. 添加文章阅读统计
10. 添加社交分享功能
11. 优化移动端体验

## 7. 故障排查

### 7.1 常见问题

1. **创建文章失败**：
   - 检查是否提供了正确的secret参数
   - 检查请求体格式是否正确

2. **文章内容无法正确渲染**：
   - 检查Markdown语法是否正确
   - 检查Markdown渲染组件是否正常工作

3. **API请求失败**：
   - 检查开发服务器是否正在运行
   - 检查API_BASE_URL配置是否正确

## 8. 版本历史

| 版本 | 日期 | 说明 |
| --- | --- | --- |
| v1.0 | 2025-12-03 | 初始版本，包含基本的博客功能 |
| v1.1 | 2025-12-22 | 前后端一体化，移除Flask后端，使用Next.js API Routes |

## 9. 贡献指南

1. Fork本仓库
2. 创建特性分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送到分支：`git push origin feature/new-feature`
5. 提交Pull Request

## 10. 许可证

MIT License
