import type { Post } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

// 简单的文件存储实现，适合Vercel环境
export class FileStorage {
  private dataPath: string;
  private posts: Post[] = [];
  private initialized = false;

  constructor() {
    // 使用临时目录，Vercel支持写入
    this.dataPath = path.join(process.cwd(), 'tmp', 'posts.json');
  }

  private async ensureDir() {
    const dir = path.dirname(this.dataPath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // 目录可能已存在
    }
  }

  private async loadData() {
    if (this.initialized) return;

    try {
      await this.ensureDir();
      const data = await fs.readFile(this.dataPath, 'utf-8');
      this.posts = JSON.parse(data);
      this.initialized = true;
    } catch (error) {
      // 文件不存在或读取失败，使用空数组
      this.posts = [];
      this.initialized = true;
      // 保存空数据
      await this.saveData();
    }
  }

  private async saveData() {
    try {
      await this.ensureDir();
      await fs.writeFile(this.dataPath, JSON.stringify(this.posts, null, 2));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  async getAllPosts(): Promise<Post[]> {
    await this.loadData();
    return this.posts;
  }

  async getPostById(id: string): Promise<Post | null> {
    await this.loadData();
    return this.posts.find(p => p.id === id) || null;
  }

  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
    await this.loadData();
    
    const id = Math.random().toString(36).substring(2, 10);
    const now = new Date().toISOString();
    const newPost: Post = {
      id,
      ...postData,
      created_at: now,
      updated_at: now
    };
    
    this.posts.push(newPost);
    await this.saveData();
    return newPost;
  }

  async updatePost(id: string, updateData: Partial<Omit<Post, 'id' | 'created_at'>>): Promise<Post | null> {
    await this.loadData();
    const post = this.posts.find(p => p.id === id);
    if (!post) return null;
    
    Object.assign(post, updateData);
    post.updated_at = new Date().toISOString();
    await this.saveData();
    return post;
  }

  async deletePost(id: string): Promise<boolean> {
    await this.loadData();
    const initialLength = this.posts.length;
    this.posts = this.posts.filter(p => p.id !== id);
    
    if (this.posts.length < initialLength) {
      await this.saveData();
      return true;
    }
    return false;
  }

  async getAllTags(): Promise<string[]> {
    await this.loadData();
    const tags = new Set<string>();
    for (const post of this.posts) {
      for (const tag of post.tags) {
        tags.add(tag);
      }
    }
    return Array.from(tags);
  }

  async getSortedPosts(): Promise<Post[]> {
    await this.loadData();
    return [...this.posts].sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }
}

// 单例实例
export const fileStorage = new FileStorage();