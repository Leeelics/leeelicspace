import { Post, PostResponse } from '@/types';

// 根据环境使用不同的API基础URL
// 在服务器端使用完整URL，在客户端使用相对路径
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-domain.com/api' 
  : 'http://localhost:3000/api';

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

// 获取单篇文章
export const fetchPost = async (postId: string): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return response.json();
};

// 获取所有标签
export const fetchTags = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/tags`);
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  return response.json();
};

// 创建新文章
export const createPost = async (postData: { title: string; content: string; tags?: string[]; secret?: string }): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
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
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
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
  const response = await fetch(`${API_BASE_URL}/posts/${postId}?secret=admin-secret`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
};