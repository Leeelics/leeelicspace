'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AdminCreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/dashboard/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // 解析标签，去除空标签
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await createPost({ 
        title, 
        content, 
        tags: tagsArray,
        secret: 'admin-secret' // 添加权限验证参数
      });
      router.push('/dashboard/posts');
    } catch {
      setError('创建文章失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
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
                onClick={() => router.push('/dashboard')}
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
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-catppuccin-text">撰写新文章</h2>
          
          {error && (
            <div className="p-3 mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-catppuccin-red dark:border-red-900/40">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 标题 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-catppuccin-subtext1">
                标题
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入文章标题"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface1 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:focus:ring-catppuccin-blue"
                disabled={isSubmitting}
              />
            </div>
            
            {/* 标签 */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-catppuccin-subtext1">
                标签（用逗号分隔）
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="例如: 技术, Next.js, React"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface1 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:focus:ring-catppuccin-blue"
                disabled={isSubmitting}
              />
            </div>
            
            {/* 内容编辑器 - Obsidian风格 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-catppuccin-subtext1">
                  内容
                </label>
                {/* Obsidian风格的预览按钮 */}
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-catppuccin-blue dark:hover:text-catppuccin-lavender flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showPreview ? '编辑' : '预览'}
                </button>
              </div>
              
              {/* 编辑器容器 - Obsidian风格 */}
              <div className="relative border border-gray-300 rounded-lg overflow-hidden dark:border-catppuccin-surface1">
                {/* 编辑器区域 */}
                {!showPreview ? (
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="请输入文章内容，支持Markdown格式\n\n例如：\n# 标题\n\n**粗体** 和 *斜体*\n\n- 列表项1\n- 列表项2"
                    rows={25}
                    className="w-full px-4 py-4 font-mono text-sm resize-none border-none outline-none bg-white dark:bg-catppuccin-surface0 dark:text-catppuccin-text"
                    disabled={isSubmitting}
                  />
                ) : (
                  /* 预览区域 - Obsidian风格 */
                  <div className="p-6 max-h-[600px] overflow-auto bg-white dark:bg-catppuccin-surface0">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-catppuccin-text">{title || '预览'}</h3>
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]} 
                      >
                        {content || '开始输入Markdown内容查看预览...'}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard/posts')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-catppuccin-surface1 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:hover:bg-catppuccin-surface0"
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-catppuccin-blue dark:hover:bg-catppuccin-lavender"
                disabled={isSubmitting}
              >
                {isSubmitting ? '发布中...' : '发布文章'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}