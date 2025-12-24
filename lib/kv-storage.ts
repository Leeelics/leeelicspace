import { kv } from '@vercel/kv';
import { Post } from '@/app/api/data';

const POSTS_KEY = 'blog:posts';
const POST_IDS_KEY = 'blog:post_ids';
const TAGS_KEY = 'blog:tags';

export class KVStorage {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    console.log('[KV] Initializing storage...');
    
    try {
      // 检查是否已有数据
      const existingPosts = await this.getAllPosts();
      console.log('[KV] Found existing posts:', existingPosts.length);
      
      if (existingPosts.length === 0) {
        console.log('[KV] No existing data, creating initial posts...');
        await this.createInitialPosts();
      }
      
      this.initialized = true;
      console.log('[KV] Storage initialization completed');
    } catch (error) {
      console.error('[KV] Failed to initialize storage:', error);
      throw error;
    }
  }

  private async createInitialPosts(): Promise<void> {
    const initialPosts = [
      {
        title: "欢迎来到我的博客",
        content: "这是我的第一篇博客文章，使用Next.js和Vercel KV构建。\n\n我将在这个博客中分享我的学习心得、技术笔记和生活感悟。希望能对大家有所帮助。",
        tags: ["技术", "博客"]
      },
      {
        title: "Next.js 16 新特性介绍",
        content: "Next.js 16 带来了许多令人兴奋的新特性，包括：\n\n- Turbopack 构建速度提升\n- React 19 支持\n- 更好的服务器组件支持\n- 改进的开发体验\n\n这些新特性让Next.js在构建现代Web应用时更加高效和便捷。",
        tags: ["Next.js", "React", "前端"]
      },
      {
        title: "Vercel KV 存储最佳实践",
        content: "Vercel KV 是一个基于Redis的键值存储服务，非常适合在Serverless环境中使用。\n\n主要优势：\n- 持久化存储\n- 自动扩展\n- 低延迟访问\n- 与Vercel完美集成\n\n使用Vercel KV可以解决传统文件存储在Serverless环境中的限制。",
        tags: ["Vercel", "KV", "存储"]
      },
      {
        title: "前端性能优化指南",
        content: "前端性能优化是提升用户体验的重要手段。以下是一些优化策略：\n\n## 1. 资源加载优化\n\n- 压缩CSS和JavaScript\n- 图片优化（压缩、懒加载、WebP格式）\n- 使用CDN加速资源加载\n\n## 2. 渲染优化\n\n- 减少DOM操作\n- 使用虚拟DOM\n- 优化CSS选择器\n- 使用requestAnimationFrame\n\n通过持续优化，可以显著提升前端应用的性能和用户体验。",
        tags: ["前端", "性能优化", "用户体验"]
      }
    ];

    for (const postData of initialPosts) {
      await this.createPost(postData);
    }
    
    console.log('[KV] Initial posts created successfully');
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      const postIds = await kv.smembers(POST_IDS_KEY);
      if (!postIds || postIds.length === 0) {
        console.log('[KV] No post IDs found');
        return [];
      }

      const posts: Post[] = [];
      for (const id of postIds) {
        const post = await kv.hgetall(`${POSTS_KEY}:${id}`);
        if (post) {
          posts.push(post as Post);
        }
      }
      
      console.log('[KV] Retrieved posts:', posts.length);
      return posts;
    } catch (error) {
      console.error('[KV] Error getting all posts:', error);
      return [];
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    try {
      console.log('[KV] Getting post by ID:', id);
      const post = await kv.hgetall(`${POSTS_KEY}:${id}`);
      return post ? (post as Post) : null;
    } catch (error) {
      console.error('[KV] Error getting post by ID:', error);
      return null;
    }
  }

  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
    try {
      const id = Math.random().toString(36).substring(2, 10);
      const now = new Date().toISOString();
      
      const newPost: Post = {
        id,
        ...postData,
        created_at: now,
        updated_at: now
      };

      // 存储文章数据
      await kv.hset(`${POSTS_KEY}:${id}`, newPost);
      
      // 添加到文章ID集合
      await kv.sadd(POST_IDS_KEY, id);
      
      // 更新标签集合
      for (const tag of postData.tags) {
        await kv.sadd(TAGS_KEY, tag);
      }
      
      console.log('[KV] Created post:', id);
      return newPost;
    } catch (error) {
      console.error('[KV] Error creating post:', error);
      throw error;
    }
  }

  async updatePost(id: string, updateData: Partial<Omit<Post, 'id' | 'created_at'>>): Promise<Post | null> {
    try {
      console.log('[KV] Updating post:', id);
      
      const existingPost = await this.getPostById(id);
      if (!existingPost) {
        console.log('[KV] Post not found for update:', id);
        return null;
      }

      const updatedPost: Post = {
        ...existingPost,
        ...updateData,
        id,
        updated_at: new Date().toISOString()
      };

      await kv.hset(`${POSTS_KEY}:${id}`, updatedPost);
      
      // 如果标签有变化，更新标签集合
      if (updateData.tags) {
        // 重新计算所有标签
        const allPosts = await this.getAllPosts();
        const allTags = new Set<string>();
        for (const post of allPosts) {
          post.tags.forEach(tag => allTags.add(tag));
        }
        await kv.del(TAGS_KEY);
        if (allTags.size > 0) {
          await kv.sadd(TAGS_KEY, ...Array.from(allTags));
        }
      }
      
      console.log('[KV] Updated post:', id);
      return updatedPost;
    } catch (error) {
      console.error('[KV] Error updating post:', error);
      return null;
    }
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      console.log('[KV] Deleting post:', id);
      
      const existingPost = await this.getPostById(id);
      if (!existingPost) {
        console.log('[KV] Post not found for deletion:', id);
        return false;
      }

      // 删除文章数据
      await kv.del(`${POSTS_KEY}:${id}`);
      
      // 从文章ID集合中移除
      await kv.srem(POST_IDS_KEY, id);
      
      // 重新计算标签集合
      const allPosts = await this.getAllPosts();
      const allTags = new Set<string>();
      for (const post of allPosts) {
        post.tags.forEach(tag => allTags.add(tag));
      }
      await kv.del(TAGS_KEY);
      if (allTags.size > 0) {
        await kv.sadd(TAGS_KEY, ...Array.from(allTags));
      }
      
      console.log('[KV] Deleted post:', id);
      return true;
    } catch (error) {
      console.error('[KV] Error deleting post:', error);
      return false;
    }
  }

  async getAllTags(): Promise<string[]> {
    try {
      console.log('[KV] Getting all tags');
      const tags = await kv.smembers(TAGS_KEY);
      console.log('[KV] Retrieved tags:', tags.length);
      return tags || [];
    } catch (error) {
      console.error('[KV] Error getting all tags:', error);
      return [];
    }
  }

  async getSortedPosts(): Promise<Post[]> {
    try {
      console.log('[KV] Getting sorted posts');
      const posts = await this.getAllPosts();
      const sorted = posts.sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      console.log('[KV] Sorted posts:', sorted.length);
      return sorted;
    } catch (error) {
      console.error('[KV] Error getting sorted posts:', error);
      return [];
    }
  }

  async getStorageInfo(): Promise<any> {
    try {
      const postIds = await kv.smembers(POST_IDS_KEY);
      const tags = await kv.smembers(TAGS_KEY);
      
      return {
        type: 'kv-storage',
        post_count: postIds.length,
        tag_count: tags.length,
        writable: true,
        connected: true
      };
    } catch (error) {
      console.error('[KV] Error getting storage info:', error);
      return {
        type: 'kv-storage',
        post_count: 0,
        tag_count: 0,
        writable: false,
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// 单例实例
export const kvStorage = new KVStorage();