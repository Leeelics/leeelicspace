# 我的博客 / My Blog

这是一个使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 引导创建的 [Next.js](https://nextjs.org) 项目。

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 快速开始 / Quickstart

### 1. 安装依赖 / Install Dependencies

```bash
npm install
```

### 2. 启动开发服务器 / Start the Development Server

```bash
npm run dev
```

### 3. 访问网站 / Visit the Website

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 4. 启动后端服务器 / Start the Backend Server

```bash
# 进入后端目录 / Navigate to the backend directory
cd ../blog-backend

# 激活虚拟环境 / Activate the virtual environment
source venv/bin/activate

# 启动后端服务器 / Start the backend server
python app.py
```

## 开发指南 / Getting Started

### 启动开发服务器 / Run the Development Server

首先，启动开发服务器：

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 编辑页面 / Edit the Page

您可以通过修改 `app/page.tsx` 来开始编辑页面。当您编辑文件时，页面会自动更新。

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### 字体优化 / Font Optimization

该项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化和加载 [Geist](https://vercel.com/font)，这是 Vercel 的一个新字体家族。

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 学习资源 / Learn More

要了解有关 Next.js 的更多信息，请查看以下资源：

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - 了解 Next.js 功能和 API。
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程。
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

您可以查看 [Next.js GitHub 存储库](https://github.com/vercel/next.js) - 欢迎您的反馈和贡献！

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 在 Vercel 上部署 / Deploy on Vercel

部署 Next.js 应用程序的最简单方法是使用 Next.js 创建者提供的 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

有关更多详细信息，请查看我们的 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
