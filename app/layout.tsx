import type { Metadata } from "next";
import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ThemeProvider from "./ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "我的博客",
  description: "使用Next.js和Flask构建的个人博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <html lang="zh-CN">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          {/* 导航栏 */}
          <header className="bg-white shadow-md dark:bg-catppuccin-base dark:border-catppuccin-surface1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-xl font-bold text-gray-900 dark:text-catppuccin-text">
                    我的博客
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  {/* 搜索框 - 客户端组件 */}
                  <div className="relative">
                    <form action="/" method="GET" className="relative">
                      <input
                        type="text"
                        name="search"
                        placeholder="搜索文章..."
                        className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface0 dark:border-catppuccin-surface2 dark:text-catppuccin-text"
                      />
                      <button
                        type="submit"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-catppuccin-overlay1 dark:hover:text-catppuccin-text"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </form>
                  </div>
                  {/* 导航链接 */}
                  <nav className="flex items-center space-x-4">
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium dark:text-catppuccin-subtext0 dark:hover:text-catppuccin-text"
                    >
                      首页
                    </Link>
                    <Link
                      href="/admin/login"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium dark:text-catppuccin-subtext0 dark:hover:text-catppuccin-text"
                    >
                      管理后台
                    </Link>
                    <Link
                      href="/projects"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium dark:text-catppuccin-subtext0 dark:hover:text-catppuccin-text"
                    >
                      个人项目
                    </Link>
                    {/* RSS订阅 */}
                    <Link
                      href="/api/rss"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:text-orange-600 dark:text-catppuccin-subtext0 dark:hover:text-catppuccin-orange"
                      title="RSS订阅"
                    >
                      {/* RSS图标 */}
                      <svg
                        width="18"
                        height="18"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6.18 3.56a8.89 8.89 0 0 1 5.91 2.29c.37.32.58.76.58 1.23 0 .84-.49 1.58-1.21 1.88-.35.14-.72.21-1.09.21-.44 0-.87-.12-1.25-.36a.84.84 0 0 1-.36-1.15c.17-.29.29-.6.29-.94 0-.72-.55-1.31-1.24-1.31a1.4 1.4 0 0 0-1.42 1.43c0 .18.03.35.08.51a.73.73 0 0 1-.64 1.04 2.12 2.12 0 0 1-.42-.05 2.68 2.68 0 0 1-.36-.15.74.74 0 0 1-.37-.64v-.08a.83.83 0 0 1 .34-.67 5.59 5.59 0 0 1 2.22-1.42ZM2 12.54c0-2.7 1.47-5.03 3.68-6.45a.74.74 0 0 1 .95.11c.21.23.3.51.3.79 0 .77-.49 1.43-1.21 1.73-.35.15-.72.21-1.1.21-.43 0-.85-.12-1.22-.36a.84.84 0 0 1-.36-1.15A7.77 7.77 0 0 0 2 12.55v.04a.83.83 0 0 0 .34.67 8.83 8.83 0 0 0 5.89 2.3.83.83 0 0 0 .77-.52 1.15 1.15 0 0 0-.33-1.39 3.91 3.91 0 0 1-.89-.55.7.7 0 0 0-.99.07 2.68 2.68 0 0 0-.14.18.74.74 0 0 0-.05.72v.07c0 .39.18.74.48.97.35.27.78.42 1.22.42a3.95 3.95 0 0 0 1.7-.37A7.41 7.41 0 0 0 14 15.59a.75.75 0 0 0-.08-1.06 3.97 3.97 0 0 1-3.47-2.44 5.93 5.93 0 0 1-1.11-3.72c0-2.17 1.23-4.02 3.08-4.96a.83.83 0 0 1 1.22.96 7.51 7.51 0 0 0-1.42 5.36c0 4.14 3.35 7.5 7.5 7.5a7.44 7.44 0 0 0 7.5-7.49 7.5 7.5 0 0 0-7.5-7.5h-.01a.83.83 0 0 1 0-1.66h.01a9.16 9.16 0 0 1 9.17 9.17 9.16 9.16 0 0 1-9.17 9.17 9.19 9.19 0 0 1-9.17-9.17Z" />
                      </svg>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </header>

          {/* 主要内容 */}
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* 页脚 */}
          <footer className="bg-gray-50 border-t border-gray-200 py-6 dark:bg-catppuccin-surface0 dark:border-catppuccin-surface1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-catppuccin-text">
              <p>© {new Date().getFullYear()} 我的博客. 使用 Next.js 和 Flask 构建.</p>
            </div>
          </footer>
        </body>
      </html>
    </ThemeProvider>
  );
}
