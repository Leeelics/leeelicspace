import { Post, PostResponse } from '@/types';

const API_BASE_URL = 'http://localhost:5001/api';

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
  
  const response = await fetch(`${API_BASE_URL}/posts?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

// 获取单篇文章
export const fetchPost = async (postId: number): Promise<Post> => {
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
export const createPost = async (postData: { title: string; content: string; tags?: string[] }): Promise<Post> => {
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
export const updatePost = async (postId: number, postData: { title?: string; content?: string; tags?: string[] }): Promise<Post> => {
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
export const deletePost = async (postId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}?secret=admin-secret`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
};