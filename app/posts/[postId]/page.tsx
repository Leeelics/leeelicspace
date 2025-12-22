// 服务器组件
import React from 'react';
import { fetchPost } from '@/services/api';

// 客户端组件 - 分离到单独的文件
import MarkdownRenderer from '@/components/MarkdownContent';
import ArticleOutline from '@/components/ArticleOutline';

// 获取文章数据
async function getPost(postId: string) {
  try {
    const postData = await fetchPost(postId);
    return postData;
  } catch (err) {
    console.error('Error loading post:', err);
    throw err;
  }
}

// 主页面组件 - 服务器组件
export default async function PostDetail({ params }: { params: { postId: string } }) {
  try {
    const post = await getPost(params.postId);
    
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-catppuccin-text">{post.title}</h1>
          <div className="text-sm text-gray-500 mb-6 dark:text-catppuccin-overlay0">
            创建于: {new Date(post.created_at).toLocaleString()}
            {post.updated_at !== post.created_at && (
              <span className="ml-2">更新于: {new Date(post.updated_at).toLocaleString()}</span>
            )}
          </div>
          
          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm dark:bg-catppuccin-surface0 dark:text-catppuccin-subtext0">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* 文章内容和大纲 - 按用户要求的布局 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧：文章内容（区域1） */}
          <div className="w-full lg:w-3/4">
            <MarkdownRenderer content={post.content} />
          </div>
          
          {/* 右侧：文章大纲（区域2） */}
          <div className="w-full lg:w-1/4">
            <ArticleOutline content={post.content} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">文章加载失败</h1>
        <p className="text-gray-600 dark:text-catppuccin-subtext0">
          无法加载指定的文章，请检查文章ID是否正确，或稍后再试。
        </p>
      </div>
    );
  }
}
