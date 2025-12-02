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
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
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
                  href="/admin"
                  className="block px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-catppuccin-surface1 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
                >
                  仪表板
                </Link>
                <Link
                  href="/admin/posts"
                  className="block px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-catppuccin-surface1 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
                >
                  文章管理
                </Link>
                <Link
                  href="/admin/create"
                  className="block px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-catppuccin-surface1 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
                >
                  撰写文章
                </Link>
                <Link
                  href="/admin/settings"
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">文章管理</h3>
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                    查看、编辑和删除您的博客文章
                  </p>
                  <Link
                    href="/admin/posts"
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
                    href="/admin/create"
                    className="inline-block mt-4 text-sm font-medium text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    撰写文章 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}