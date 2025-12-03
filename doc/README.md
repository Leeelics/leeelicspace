# 我的博客项目文档

## 1. 项目概述

这是一个使用Next.js和Flask构建的现代化博客系统，支持前后端分离架构，提供完整的博客管理功能。

### 1.1 技术栈

| 分类 | 技术 | 版本 |
| --- | --- | --- |
| 前端框架 | Next.js | 16+ |
| 前端语言 | TypeScript | 5+ |
| 样式框架 | Tailwind CSS | 3+ |
| 后端框架 | Flask | 3+ |
| 后端语言 | Python | 3.12+ |
| 数据库 | 模拟内存数据库（可扩展） | - |

### 1.2 项目结构

```
├── blog-frontend/        # 前端代码
├── blog-backend/         # 后端代码
└── doc/                  # 项目文档
```

## 2. 后端架构

### 2.1 核心文件结构

```
blog-backend/
└── app.py               # 主应用文件，包含所有API路由和业务逻辑
```

### 2.2 主要功能

1. **文章管理**：
   - 获取文章列表（支持分页、标签筛选）
   - 获取单篇文章
   - 创建新文章
   - 更新文章
   - 删除文章

2. **标签管理**：
   - 获取所有标签

### 2.3 API端点

| 端点 | 方法 | 功能 | 参数 | 权限 |
| --- | --- | --- | --- | --- |
| `/api/posts` | GET | 获取文章列表 | page, per_page, tag | 公开 |
| `/api/posts/<int:post_id>` | GET | 获取单篇文章 | post_id | 公开 |
| `/api/posts` | POST | 创建新文章 | title, content, tags, secret | 管理员 |
| `/api/posts/<int:post_id>` | PUT | 更新文章 | post_id, title, content, tags, secret | 管理员 |
| `/api/posts/<int:post_id>` | DELETE | 删除文章 | post_id, secret | 管理员 |
| `/api/tags` | GET | 获取所有标签 | 无 | 公开 |

### 2.4 数据模型

#### 文章模型

```python
{
    "id": 1,
    "title": "文章标题",
    "content": "文章内容",
    "tags": ["标签1", "标签2"],
    "created_at": "2025-12-03T10:00:00",
    "updated_at": "2025-12-03T10:00:00"
}
```

### 2.5 权限控制

- 公开接口：无需认证
- 管理员接口：需要在请求中提供 `secret` 参数，值为 `admin-secret`

## 3. 前端架构

### 3.1 核心文件结构

```
blog-frontend/
├── app/                  # Next.js App Router
│   ├── admin/            # 管理后台页面
│   │   ├── create/       # 创建文章
│   │   ├── login/        # 登录页面
│   │   ├── posts/        # 文章管理
│   │   ├── settings/     # 设置页面
│   │   └── test-login/   # 测试登录
│   ├── posts/            # 博客文章页面
│   │   └── [postId]/     # 单篇文章详情
│   ├── projects/         # 项目页面
│   ├── ThemeProvider.tsx # 主题提供者
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/           # React组件
│   ├── AuthGuard.tsx     # 认证守卫
│   └── MarkdownWithOutline.tsx # Markdown渲染组件
├── services/             # API服务
│   └── api.ts            # API请求函数
└── types/                # TypeScript类型定义
    └── index.ts          # 类型声明
```

### 3.2 主要功能

1. **博客前台**：
   - 首页文章列表展示
   - 文章详情页
   - 标签筛选
   - 分页功能

2. **管理后台**：
   - 文章管理（创建、编辑、删除）
   - 管理员登录
   - 主题设置

### 3.3 组件说明

#### 3.3.1 AuthGuard 组件

- **功能**：保护管理后台路由，确保只有管理员可以访问
- **位置**：`components/AuthGuard.tsx`
- **实现原理**：
  - 使用`localStorage`存储登录状态
  - 在组件挂载时检查登录状态
  - 未登录时重定向到登录页面
  - 已登录时渲染子组件

#### 3.3.2 MarkdownWithOutline 组件

- **功能**：渲染Markdown内容，支持GFM（GitHub风格Markdown）
- **位置**：`components/MarkdownWithOutline.tsx`
- **实现原理**：
  - 使用`react-markdown`库渲染Markdown
  - 集成`remark-gfm`插件支持表格、代码块等扩展语法
  - 包含`MarkdownContent`子组件用于纯内容渲染
  - 保持向后兼容的API设计

### 3.4 API服务

- **位置**：`services/api.ts`
- **功能**：封装所有与后端的API交互
- **主要方法**：
  - `fetchPosts()`：获取文章列表
  - `fetchPost()`：获取单篇文章
  - `fetchTags()`：获取所有标签
  - `createPost()`：创建新文章
  - `updatePost()`：更新文章
  - `deletePost()`：删除文章

### 3.5 类型定义

- **位置**：`types/index.ts`
- **主要类型**：
  - `Post`：文章类型
  - `Pagination`：分页信息类型
  - `PostResponse`：文章列表响应类型

## 4. 开发指南

### 4.1 前端开发

#### 4.1.1 环境要求

- Node.js 18+
- npm 9+

#### 4.1.2 启动开发服务器

```bash
cd blog-frontend
npm install
npm run dev
```

#### 4.1.3 构建生产版本

```bash
npm run build
npm run start
```

### 4.2 后端开发

#### 4.2.1 环境要求

- Python 3.12+
- pip 23+

#### 4.2.2 启动开发服务器

```bash
cd blog-backend
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 4.3 项目配置

#### 4.3.1 前端配置

- 后端API地址：`services/api.ts` 中的 `API_BASE_URL`
- 主题配置：`app/ThemeProvider.tsx`

#### 4.3.2 后端配置

- 端口：`app.py` 中 `app.run()` 的 `port` 参数
- 管理员密钥：代码中硬编码的 `admin-secret`（实际项目中应使用环境变量）

## 5. 部署指南

### 5.1 前端部署

1. 构建生产版本：
   ```bash
   npm run build
   ```

2. 部署到Vercel、Netlify或其他静态站点托管服务

### 5.2 后端部署

1. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

2. 使用Gunicorn或uWSGI启动生产服务器：
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5001 app:app
   ```

3. 部署到AWS EC2、DigitalOcean或其他云服务器

## 6. 扩展建议

### 6.1 后端扩展

1. 替换模拟数据库为真实数据库（如PostgreSQL、MongoDB）
2. 实现JWT认证机制，替代简单的secret参数
3. 添加用户管理系统
4. 实现文章评论功能
5. 添加文章搜索功能
6. 实现访问统计功能

### 6.2 前端扩展

1. 添加文章分类功能
2. 实现暗色模式切换
3. 添加文章阅读统计
4. 实现评论系统
5. 添加社交分享功能
6. 优化移动端体验

## 7. 故障排查

### 7.1 常见问题

1. **前端无法连接到后端**：
   - 检查后端服务是否正在运行
   - 检查前端API_BASE_URL配置是否正确
   - 检查CORS配置

2. **创建文章失败**：
   - 检查是否提供了正确的secret参数
   - 检查请求体格式是否正确

3. **文章内容无法正确渲染**：
   - 检查Markdown语法是否正确
   - 检查Markdown渲染组件是否正常工作

## 8. 版本历史

| 版本 | 日期 | 说明 |
| --- | --- | --- |
| v1.0 | 2025-12-03 | 初始版本，包含基本的博客功能 |

## 9. 贡献指南

1. Fork本仓库
2. 创建特性分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送到分支：`git push origin feature/new-feature`
5. 提交Pull Request

## 10. 许可证

MIT License
