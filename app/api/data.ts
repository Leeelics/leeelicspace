import { v4 as uuidv4 } from "uuid";

// 生成短哈希ID的函数
export async function generateShortId(title: string): Promise<string> {
  // 结合标题和当前时间生成唯一字符串
  const uniqueStr = `${title}${new Date().toISOString()}${uuidv4()}`;
  // 使用SHA-256生成哈希
  const encoder = new TextEncoder();
  const data = encoder.encode(uniqueStr);
  try {
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // 取前8个字符作为短ID
    return hashHex.slice(0, 8);
  } catch {
    // 如果环境不支持crypto.subtle，使用简化的ID生成
    return Math.random().toString(36).substring(2, 10);
  }
}

// 定义文章类型
export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// 导入KV存储
import { kvStorage } from '@/lib/kv-storage';

// 使用KV存储（适合Vercel环境）
const storage = kvStorage;

// 兼容层：提供与原来PostStore相同的接口
class PostStore {
  private initialized = false;

  // 初始化数据（只在第一次调用时执行）
  private async initialize() {
    if (this.initialized) return;
    
    // 检查是否已有数据，如果没有则创建初始数据
    const existingPosts = await storage.getAllPosts();
    if (existingPosts.length === 0) {
      // 创建初始文章数据
      const initialPosts = [
        {
          title: "欢迎来到我的博客",
          content: "这是我的第一篇博客文章，使用Next.js构建。\n\n我将在这个博客中分享我的学习心得、技术笔记和生活感悟。希望能对大家有所帮助。",
          tags: ["技术", "博客"]
        },
        {
          title: "Next.js 16 新特性介绍",
          content: "Next.js 16 带来了许多令人兴奋的新特性，包括：\n\n- Turbopack 构建速度提升\n- React 19 支持\n- 更好的服务器组件支持\n- 改进的开发体验\n\n这些新特性让Next.js在构建现代Web应用时更加高效和便捷。",
          tags: ["Next.js", "React", "前端"]
        },
        {
          title: "TypeScript 入门指南",
          content: "TypeScript 是 JavaScript 的超集，它添加了静态类型检查。\n\n主要特点：\n- 静态类型检查\n- 更好的IDE支持\n- 代码可维护性提升\n- 更好的团队协作\n\n学习TypeScript可以帮助你编写更可靠、更易于维护的代码。",
          tags: ["TypeScript", "JavaScript", "前端"]
        },
        {
          title: "前端性能优化指南",
          content: "前端性能优化是提升用户体验的重要手段。以下是一些优化策略：\n\n## 1. 资源加载优化\n\n- 压缩CSS和JavaScript\n- 图片优化（压缩、懒加载、WebP格式）\n- 使用CDN加速资源加载\n\n## 2. 渲染优化\n\n- 减少DOM操作\n- 使用虚拟DOM\n- 优化CSS选择器\n- 使用requestAnimationFrame\n\n通过持续优化，可以显著提升前端应用的性能和用户体验。",
          tags: ["前端", "性能优化", "用户体验"]
        }
      ];

      // 创建初始文章
      for (const postData of initialPosts) {
        await storage.createPost(postData);
      }
    }
    
    this.initialized = true;
  }

  // 获取所有文章
  async getAllPosts() {
    await this.initialize();
    return storage.getAllPosts();
  }

  // 获取单篇文章
  async getPostById(id: string) {
    await this.initialize();
    return storage.getPostById(id);
  }

  // 创建新文章
  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
    await this.initialize();
    return storage.createPost(postData);
  }

  // 更新文章
  async updatePost(id: string, updateData: Partial<Omit<Post, 'id' | 'created_at'>>) {
    await this.initialize();
    return storage.updatePost(id, updateData);
  }

  // 删除文章
  async deletePost(id: string) {
    await this.initialize();
    return storage.deletePost(id);
  }

  // 获取所有标签
  async getAllTags() {
    await this.initialize();
    return storage.getAllTags();
  }

  // 获取排序后的文章
  async getSortedPosts() {
    await this.initialize();
    return storage.getSortedPosts();
  }

  // 批量修复所有文章 id（兼容原有接口）
  async repairAllPostIds() {
    await this.initialize();
    const posts = await storage.getAllPosts();
    let modified = false;
    
    for (const post of posts) {
      // id 不是 8 位 hash 或为空时，重新生成
      if (!post.id || typeof post.id !== 'string' || post.id.length !== 8 || /[^a-f0-9]/i.test(post.id)) {
        post.id = Math.random().toString(36).substring(2, 10);
        post.updated_at = new Date().toISOString();
        modified = true;
      }
    }
    
    if (modified) {
      // 重新保存所有文章
      for (const post of posts) {
        await storage.updatePost(post.id, post);
      }
    }
    
    return posts;
  }
}

// 导出单例实例（保持兼容性）
export const postStore = new PostStore();
