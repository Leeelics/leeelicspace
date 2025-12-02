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
                  {/* 搜索框 */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索文章..."
                      className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface0 dark:border-catppuccin-surface2 dark:text-catppuccin-text"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-catppuccin-overlay1"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
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
