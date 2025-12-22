'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Theme = 'light' | 'dark' | 'catppuccin';

export default function AdminSettings() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('light');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/admin/login');
    }

    // 从localStorage获取当前主题
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(savedTheme);
  }, [router]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSave = () => {
    // 保存主题到localStorage
    localStorage.setItem('theme', theme);
    setIsSaved(true);
    
    // 3秒后清除保存成功提示
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
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
                onClick={() => router.push('/admin')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-catppuccin-surface1 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
              >
                返回控制台
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 dark:bg-catppuccin-surface0 dark:border dark:border-catppuccin-surface1">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-catppuccin-text">网站设置</h2>
          
          {isSaved && (
            <div className="p-3 mb-6 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-catppuccin-green dark:border-green-900/40">
              设置已保存
            </div>
          )}
          
          {/* 主题设置 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-catppuccin-text">主题设置</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-catppuccin-surface1">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-catppuccin-text">浅色主题</h4>
                  <p className="text-sm text-gray-600 dark:text-catppuccin-subtext0">经典的浅色外观</p>
                </div>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => handleThemeChange('light')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-catppuccin-surface2"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-catppuccin-surface1">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-catppuccin-text">深色主题</h4>
                  <p className="text-sm text-gray-600 dark:text-catppuccin-subtext0">适合夜间使用的深色外观</p>
                </div>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-catppuccin-surface2"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-catppuccin-surface1">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-catppuccin-text">Catppuccin主题</h4>
                  <p className="text-sm text-gray-600 dark:text-catppuccin-subtext0">使用Catppuccin Macchiatto配色方案</p>
                </div>
                <input
                  type="radio"
                  name="theme"
                  value="catppuccin"
                  checked={theme === 'catppuccin'}
                  onChange={() => handleThemeChange('catppuccin')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-catppuccin-surface2"
                />
              </div>
            </div>
          </div>
          
          {/* 保存按钮 */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-catppuccin-blue dark:hover:bg-catppuccin-lavender"
            >
              保存设置
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}