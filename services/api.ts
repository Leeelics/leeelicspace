import { Post, PostResponse } from '@/types';

// 使用相对URL，适应不同的部署环境
// 在Next.js中，相对URL会自动使用当前域名

// 获取所有文章，支持分页、标签筛选和关键词搜索
export const fetchPosts = async (page: number = 1, perPage: number = 5, tag?: string, search?: string): Promise<PostResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  
  if (tag) {
    params.append('tag', tag);
  }
  
  if (search) {
    params.append('search', search);
  }
  
  const response = await fetch(`/api/posts?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

// 获取基础URL（在服务器端和客户端都能正常工作）
const getBaseUrl = () => {
  // 浏览器环境
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // 服务器环境
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // 默认fallback
  return 'http://localhost:3000';
};

// 获取单篇文章
export const fetchPost = async (postId: string): Promise<Post> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/posts/${postId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return response.json();
};

// 获取所有标签
export const fetchTags = async (): Promise<string[]> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/tags`);
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  return response.json();
};

// 创建新文章
export const createPost = async (postData: { title: string; content: string; tags?: string[]; secret?: string }): Promise<Post> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
};

// 更新文章
export const updatePost = async (postId: string, postData: { title?: string; content?: string; tags?: string[]; secret?: string }): Promise<Post> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error('Failed to update post');
  }
  return response.json();
};

// 删除文章
export const deletePost = async (postId: string): Promise<void> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/posts/${postId}?secret=admin-secret`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
};