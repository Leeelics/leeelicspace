'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [secret, setSecret] = useState('');
  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空');
      return;
    }

    if (!secret.trim()) {
      setAuthError('请输入管理员密码');
      return;
    }

    setIsSubmitting(true);
    setAuthError('');
    
    try {
      // 解析标签，去除空标签
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await createPost({ 
        title, 
        content, 
        tags: tagsArray,
        secret // 添加权限验证参数
      });
      router.push('/');
    } catch (error: any) {
      console.error('创建文章失败:', error);
      if (error.message.includes('Unauthorized')) {
        setAuthError('管理员密码错误');
      } else {
        alert('创建文章失败，请重试');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-catppuccin-text">撰写新文章</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 标题 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 dark:text-catppuccin-subtext1">
            标题
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入文章标题"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface0 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:focus:ring-catppuccin-blue"
            disabled={isSubmitting}
          />
        </div>
        
        {/* 标签 */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1 dark:text-catppuccin-subtext1">
            标签（用逗号分隔）
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例如: 技术, Next.js, React"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface0 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:focus:ring-catppuccin-blue"
            disabled={isSubmitting}
          />
        </div>
        
        {/* 密码验证 */}
        <div>
          <label htmlFor="secret" className="block text-sm font-medium text-gray-700 mb-1 dark:text-catppuccin-subtext1">
            管理员密码
          </label>
          <input
            type="password"
            id="secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="请输入管理员密码"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface0 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:focus:ring-catppuccin-blue"
            disabled={isSubmitting}
          />
          {authError && (
            <p className="mt-1 text-sm text-red-600 dark:text-catppuccin-red">{authError}</p>
          )}
        </div>
        
        {/* 内容编辑器和预览 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-catppuccin-subtext1">
              内容（支持Markdown）
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-catppuccin-blue dark:hover:text-catppuccin-lavender"
              disabled={isSubmitting}
            >
              {showPreview ? '显示编辑器' : '显示预览'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 编辑器 */}
            {!showPreview && (
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入文章内容，支持Markdown格式\n\n例如：\n# 标题\n\n**粗体** 和 *斜体*\n\n- 列表项1\n- 列表项2"
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface0 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:focus:ring-catppuccin-blue"
                disabled={isSubmitting}
              />
            )}
            
            {/* 预览 */}
            <div className={`${showPreview ? 'lg:col-span-2' : ''} border border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-catppuccin-surface0 dark:border-catppuccin-surface2 overflow-auto max-h-[600px]`}>
              <h3 className="text-lg font-semibold mb-4 dark:text-catppuccin-text">{title || '预览'}</h3>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                wrapperProps={{
                  className: "prose prose-lg max-w-none dark:prose-invert"
                }}
              >
                {content || '开始输入Markdown内容查看预览...'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-catppuccin-surface1 dark:bg-catppuccin-base dark:text-catppuccin-subtext0 dark:hover:bg-catppuccin-surface0"
            disabled={isSubmitting}
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 dark:bg-catppuccin-blue dark:hover:bg-catppuccin-lavender"
            disabled={isSubmitting}
          >
            {isSubmitting ? '发布中...' : '发布文章'}
          </button>
        </div>
      </form>
    </div>
  );
}