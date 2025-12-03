'use client';

import React, { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'catppuccin';

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  // 监听localStorage中的theme变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const newTheme = e.newValue as Theme || 'light';
        applyTheme(newTheme);
        setTheme(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 应用主题
  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    
    // 移除所有主题类
    html.classList.remove('light', 'dark', 'catppuccin');
    
    // 添加当前主题类
    html.classList.add(newTheme);
    
    // 为了兼容现有的dark类用法，当主题为dark或catppuccin时，添加dark类
    if (newTheme === 'dark' || newTheme === 'catppuccin') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  // 主题切换功能
  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'catppuccin'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="theme-provider">
      {children}
    </div>
  );
};

export default ThemeProvider;
