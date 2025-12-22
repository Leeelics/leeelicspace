'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/dashboard/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/dashboard/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-catppuccin-base">
      {/* 导航栏 */}
      <header className="bg-white shadow dark:bg-catppuccin-surface0 dark:border-b dark:border-catppuccin-surface1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-catppuccin-text">管理后台</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-catppuccin-surface1 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 侧边导航 */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 dark:bg-catppuccin-surface0 dark:border dark:border-catppuccin-surface1">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-catppuccin-text">管理菜单</h2>
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-catppuccin-surface1 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
                >
                  仪表板
                </Link>
                <Link
                  href="/dashboard/posts"
                  className="block px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-catppuccin-surface1 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
                >
                  文章管理
                </Link>
                <Link
                  href="/dashboard/create"
                  className="block px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-catppuccin-surface1 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
                >
                  撰写文章
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-catppuccin-surface1 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
                >
                  网站设置
                </Link>
              </nav>
            </div>
          </div>

          {/* 主要内容 */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 dark:bg-catppuccin-surface0 dark:border dark:border-catppuccin-surface1">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-catppuccin-text">欢迎来到管理后台</h2>
              
              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 文章浏览量 */}
                <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">总文章浏览量</p>
                      <h3 className="text-2xl font-bold mt-1 text-blue-900 dark:text-blue-300">12,456</h3>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% 较上月</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* 网站访问量 */}
                <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">总网站访问量</p>
                      <h3 className="text-2xl font-bold mt-1 text-green-900 dark:text-green-300">34,892</h3>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8% 较上月</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full dark:bg-green-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* 安全监控 */}
                <div className="p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">安全状态</p>
                      <h3 className="text-2xl font-bold mt-1 text-purple-900 dark:text-purple-300">安全</h3>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">0 次异常登录</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full dark:bg-purple-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 主要功能入口 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">文章管理</h3>
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                    查看、编辑和删除您的博客文章
                  </p>
                  <Link
                    href="/dashboard/posts"
                    className="inline-block mt-4 text-sm font-medium text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    管理文章 →
                  </Link>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-300">撰写文章</h3>
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    创建新的博客文章，支持Markdown格式
                  </p>
                  <Link
                    href="/dashboard/create"
                    className="inline-block mt-4 text-sm font-medium text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    撰写文章 →
                  </Link>
                </div>
              </div>
              
              {/* 最近文章统计 */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-catppuccin-text">最近文章浏览量</h3>
                <div className="bg-white rounded-lg shadow p-4 dark:bg-catppuccin-base dark:border dark:border-catppuccin-surface1">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-catppuccin-surface1">
                    <thead className="bg-gray-50 dark:bg-catppuccin-surface0">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-catppuccin-subtext0">文章标题</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-catppuccin-subtext0">浏览量</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-catppuccin-subtext0">发布日期</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-catppuccin-base dark:divide-catppuccin-surface1">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-catppuccin-text">如何学习Next.js 16</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-catppuccin-subtext0">2,345</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-catppuccin-subtext0">2025-12-01</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-catppuccin-text">Tailwind CSS v4 新特性</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-catppuccin-subtext0">1,890</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-catppuccin-subtext0">2025-11-28</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-catppuccin-text">Flask 3 REST API 最佳实践</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-catppuccin-subtext0">1,567</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-catppuccin-subtext0">2025-11-25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}