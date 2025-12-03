'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPosts, deletePost } from '@/services/api';
import { Post } from '@/types';
import Link from 'next/link';

export default function AdminPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    // 获取所有文章
    const getPosts = async () => {
      try {
        const response = await fetchPosts(1, 100); // 获取所有文章
        setPosts(response.posts);
      } catch (error) {
        console.error('获取文章失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, []);

  // 删除文章处理函数
  const handleDelete = async (postId: number) => {
    if (confirm('确定要删除这篇文章吗？')) {
      setIsDeleting(postId);
      try {
        await deletePost(postId);
        // 更新文章列表
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('删除文章失败:', error);
        alert('删除文章失败，请重试');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-catppuccin-base">
        <header className="bg-white shadow dark:bg-catppuccin-surface0 dark:border-b dark:border-catppuccin-surface1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-catppuccin-text">管理后台</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6 dark:bg-catppuccin-surface0 dark:border dark:border-catppuccin-surface1">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 dark:text-catppuccin-overlay0">加载中...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-catppuccin-base">
      {/* 导航栏 */}
      <header className="bg-white shadow dark:bg-catppuccin-surface0 dark:border-b dark:border-catppuccin-surface1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-catppuccin-text">管理后台</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 dark:bg-catppuccin-surface0 dark:border dark:border-catppuccin-surface1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-catppuccin-text">文章管理</h2>
            <Link
              href="/admin/create"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-catppuccin-blue dark:hover:bg-catppuccin-lavender"
            >
              撰写新文章
            </Link>
          </div>
          
          {/* 文章列表 */}
          {posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-catppuccin-surface1">
                <thead className="bg-gray-50 dark:bg-catppuccin-surface1">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-catppuccin-subtext0">
                      标题
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-catppuccin-subtext0">
                      标签
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-catppuccin-subtext0">
                      创建时间
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-catppuccin-subtext0">
                      更新时间
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-catppuccin-subtext0">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-catppuccin-surface0 dark:divide-catppuccin-surface1">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-catppuccin-surface1">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-catppuccin-text">{post.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full dark:bg-catppuccin-surface2 dark:text-catppuccin-subtext0">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-catppuccin-overlay0">
                          {new Date(post.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-catppuccin-overlay0">
                          {new Date(post.updated_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/posts/${post.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4 dark:text-catppuccin-blue dark:hover:text-catppuccin-lavender"
                          target="_blank"
                        >
                          查看
                        </Link>
                        <button 
                          className={`text-red-600 hover:text-red-900 dark:text-catppuccin-red dark:hover:text-catppuccin-maroon ${isDeleting === post.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleDelete(post.id)}
                          disabled={isDeleting === post.id}
                        >
                          {isDeleting === post.id ? '删除中...' : '删除'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-catppuccin-overlay0">暂无文章</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}