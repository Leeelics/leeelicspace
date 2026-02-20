import { kv } from "@vercel/kv";
import type { Post } from "@/types";
import { defaultChannelConfig, defaultPublishStatus } from "@/types";
import { logger } from "./logger";

const POSTS_KEY = "blog:posts";
const POST_IDS_KEY = "blog:post_ids";
const TAGS_KEY = "blog:tags";

// Storage interface for type safety
interface StorageInfo {
  type: string;
  post_count: number;
  tag_count: number;
  writable: boolean;
  connected: boolean;
  fallback?: boolean;
  error?: string;
}

// 内存存储回退（当 KV 不可用时使用）
class MemoryStorage {
  private posts: Map<string, Post> = new Map();
  private tags: Set<string> = new Set();

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.posts.get(id) || null;
  }

  async createPost(
    postData: Omit<Post, "id" | "created_at" | "updated_at">,
  ): Promise<Post> {
    const id = Math.random().toString(36).substring(2, 10);
    const now = new Date().toISOString();
    const newPost: Post = {
      id,
      ...postData,
      created_at: now,
      updated_at: now,
    };
    this.posts.set(id, newPost);
    for (const tag of postData.tags) {
      this.tags.add(tag);
    }
    return newPost;
  }

  async updatePost(
    id: string,
    updateData: Partial<Omit<Post, "id" | "created_at">>,
  ): Promise<Post | null> {
    const existing = this.posts.get(id);
    if (!existing) return null;
    const updated: Post = {
      ...existing,
      ...updateData,
      id,
      updated_at: new Date().toISOString(),
    };
    this.posts.set(id, updated);
    return updated;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  async getAllTags(): Promise<string[]> {
    return Array.from(this.tags);
  }

  async getSortedPosts(): Promise<Post[]> {
    const posts = Array.from(this.posts.values());
    return posts.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  }
}

export class KVStorage {
  private initialized = false;
  private useMemory = false;
  private memoryStorage = new MemoryStorage();

  async initialize(): Promise<void> {
    if (this.initialized) return;

    logger.info("Initializing storage...");

    // 首先测试 KV 连接
    try {
      await kv.ping();
      logger.info("KV connection successful");
    } catch (error) {
      logger.error(
        "KV connection failed, switching to memory storage",
        error instanceof Error ? error : new Error(String(error)),
      );
      this.useMemory = true;
      // 内存存储也需要初始化数据
      const existingPosts = await this.memoryStorage.getAllPosts();
      if (existingPosts.length === 0) {
        logger.debug("Creating initial posts in memory storage...");
        await this.createInitialPosts();
      }
      this.initialized = true;
      return;
    }

    try {
      // 检查是否已有数据
      const existingPosts = await this.getAllPosts();
      logger.debug(`Found ${existingPosts.length} existing posts`);

      if (existingPosts.length === 0) {
        logger.debug("No existing data, creating initial posts...");
        await this.createInitialPosts();
      }

      this.initialized = true;
      logger.info("Storage initialization completed");
    } catch (error) {
      logger.error(
        "Failed to initialize storage",
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }

  private async createInitialPosts(): Promise<void> {
    const initialPosts = [
      {
        title: "欢迎来到我的博客",
        content:
          "这是我的第一篇博客文章，使用Next.js和Vercel KV构建。\n\n我将在这个博客中分享我的学习心得、技术笔记和生活感悟。希望能对大家有所帮助。",
        tags: ["技术", "博客"],
        publishStatus: { ...defaultPublishStatus },
        channelConfig: { ...defaultChannelConfig },
      },
      {
        title: "Next.js 16 新特性介绍",
        content:
          "Next.js 16 带来了许多令人兴奋的新特性，包括：\n\n- Turbopack 构建速度提升\n- React 19 支持\n- 更好的服务器组件支持\n- 改进的开发体验\n\n这些新特性让Next.js在构建现代Web应用时更加高效和便捷。",
        tags: ["Next.js", "React", "前端"],
        publishStatus: { ...defaultPublishStatus },
        channelConfig: { ...defaultChannelConfig },
      },
      {
        title: "Vercel KV 存储最佳实践",
        content:
          "Vercel KV 是一个基于Redis的键值存储服务，非常适合在Serverless环境中使用。\n\n主要优势：\n- 持久化存储\n- 自动扩展\n- 低延迟访问\n- 与Vercel完美集成\n\n使用Vercel KV可以解决传统文件存储在Serverless环境中的限制。",
        tags: ["Vercel", "KV", "存储"],
        publishStatus: { ...defaultPublishStatus },
        channelConfig: { ...defaultChannelConfig },
      },
      {
        title: "前端性能优化指南",
        content:
          "前端性能优化是提升用户体验的重要手段。以下是一些优化策略：\n\n## 1. 资源加载优化\n\n- 压缩CSS和JavaScript\n- 图片优化（压缩、懒加载、WebP格式）\n- 使用CDN加速资源加载\n\n## 2. 渲染优化\n\n- 减少DOM操作\n- 使用虚拟DOM\n- 优化CSS选择器\n- 使用requestAnimationFrame\n\n通过持续优化，可以显著提升前端应用的性能和用户体验。",
        tags: ["前端", "性能优化", "用户体验"],
        publishStatus: { ...defaultPublishStatus },
        channelConfig: { ...defaultChannelConfig },
      },
    ];

    for (const postData of initialPosts) {
      await this.createPost(postData);
    }

    logger.info("Initial posts created successfully");
  }

  async getAllPosts(): Promise<Post[]> {
    if (this.useMemory) {
      return this.memoryStorage.getAllPosts();
    }

    try {
      const postIds = await kv.smembers(POST_IDS_KEY);
      if (!postIds || postIds.length === 0) {
        logger.debug("No post IDs found");
        return [];
      }

      const posts: Post[] = [];
      for (const id of postIds) {
        const post = await kv.hgetall(`${POSTS_KEY}:${id}`);
        if (post) {
          // KV 返回的是 Record<string, unknown>，这里我们信任数据结构并进行显式断言
          posts.push(post as unknown as Post);
        }
      }

      logger.debug(`Retrieved ${posts.length} posts`);
      return posts;
    } catch (error) {
      logger.error(
        "Error getting all posts",
        error instanceof Error ? error : new Error(String(error)),
      );
      // 切换到内存存储
      this.useMemory = true;
      return this.memoryStorage.getAllPosts();
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    if (this.useMemory) {
      return this.memoryStorage.getPostById(id);
    }

    try {
      logger.debug(`Getting post by ID: ${id}`);
      const post = await kv.hgetall(`${POSTS_KEY}:${id}`);
      return post ? (post as unknown as Post) : null;
    } catch (error) {
      logger.error(
        `Error getting post by ID: ${id}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return null;
    }
  }

  async createPost(
    postData: Omit<Post, "id" | "created_at" | "updated_at">,
  ): Promise<Post> {
    if (this.useMemory) {
      return this.memoryStorage.createPost(postData);
    }

    try {
      const id = Math.random().toString(36).substring(2, 10);
      const now = new Date().toISOString();

      const newPost: Post = {
        id,
        ...postData,
        created_at: now,
        updated_at: now,
      };

      // 存储文章数据（KV 接口要求 Record<string, unknown>）
      await kv.hset(
        `${POSTS_KEY}:${id}`,
        newPost as unknown as Record<string, unknown>,
      );

      // 添加到文章ID集合
      await kv.sadd(POST_IDS_KEY, id);

      // 更新标签集合
      for (const tag of postData.tags) {
        await kv.sadd(TAGS_KEY, tag);
      }

      logger.debug(`Created post: ${id}`);
      return newPost;
    } catch (error) {
      logger.error(
        "Error creating post",
        error instanceof Error ? error : new Error(String(error)),
      );
      // 切换到内存存储并继续
      this.useMemory = true;
      return this.memoryStorage.createPost(postData);
    }
  }

  async updatePost(
    id: string,
    updateData: Partial<Omit<Post, "id" | "created_at">>,
  ): Promise<Post | null> {
    if (this.useMemory) {
      return this.memoryStorage.updatePost(id, updateData);
    }

    try {
      logger.debug(`Updating post: ${id}`);

      const existingPost = await this.getPostById(id);
      if (!existingPost) {
        logger.debug(`Post not found for update: ${id}`);
        return null;
      }

      const updatedPost: Post = {
        ...existingPost,
        ...updateData,
        id,
        updated_at: new Date().toISOString(),
      };

      await kv.hset(
        `${POSTS_KEY}:${id}`,
        updatedPost as unknown as Record<string, unknown>,
      );

      // 如果标签有变化，更新标签集合
      if (updateData.tags) {
        // 重新计算所有标签
        const allPosts = await this.getAllPosts();
        const allTags = new Set<string>();
        for (const post of allPosts) {
          for (const tag of post.tags) {
            allTags.add(tag);
          }
        }
        await kv.del(TAGS_KEY);
        if (allTags.size > 0) {
          await kv.sadd(TAGS_KEY, Array.from(allTags));
        }
      }

      logger.debug(`Updated post: ${id}`);
      return updatedPost;
    } catch (error) {
      logger.error(
        `Error updating post: ${id}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return null;
    }
  }

  async deletePost(id: string): Promise<boolean> {
    if (this.useMemory) {
      return this.memoryStorage.deletePost(id);
    }

    try {
      logger.debug(`Deleting post: ${id}`);

      const existingPost = await this.getPostById(id);
      if (!existingPost) {
        logger.debug(`Post not found for deletion: ${id}`);
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
        for (const tag of post.tags) {
          allTags.add(tag);
        }
      }
      await kv.del(TAGS_KEY);
      if (allTags.size > 0) {
        await kv.sadd(TAGS_KEY, Array.from(allTags));
      }

      logger.debug(`Deleted post: ${id}`);
      return true;
    } catch (error) {
      logger.error(
        `Error deleting post: ${id}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return false;
    }
  }

  async getAllTags(): Promise<string[]> {
    if (this.useMemory) {
      return this.memoryStorage.getAllTags();
    }

    try {
      logger.debug("Getting all tags");
      const tags = await kv.smembers(TAGS_KEY);
      logger.debug(`Retrieved ${tags.length} tags`);
      return tags || [];
    } catch (error) {
      logger.error(
        "Error getting all tags",
        error instanceof Error ? error : new Error(String(error)),
      );
      return [];
    }
  }

  async getSortedPosts(): Promise<Post[]> {
    if (this.useMemory) {
      return this.memoryStorage.getSortedPosts();
    }

    try {
      logger.debug("Getting sorted posts");
      const posts = await this.getAllPosts();
      const sorted = posts.sort((a, b) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
      logger.debug(`Sorted ${sorted.length} posts`);
      return sorted;
    } catch (error) {
      logger.error(
        "Error getting sorted posts",
        error instanceof Error ? error : new Error(String(error)),
      );
      return [];
    }
  }

  async getStorageInfo(): Promise<StorageInfo> {
    if (this.useMemory) {
      const posts = await this.memoryStorage.getAllPosts();
      const tags = await this.memoryStorage.getAllTags();
      return {
        type: "memory-storage",
        post_count: posts.length,
        tag_count: tags.length,
        writable: true,
        connected: true,
        fallback: true,
      };
    }

    try {
      const postIds = await kv.smembers(POST_IDS_KEY);
      const tags = await kv.smembers(TAGS_KEY);

      return {
        type: "kv-storage",
        post_count: postIds.length,
        tag_count: tags.length,
        writable: true,
        connected: true,
      };
    } catch (error) {
      logger.error(
        "Error getting storage info",
        error instanceof Error ? error : new Error(String(error)),
      );
      return {
        type: "kv-storage",
        post_count: 0,
        tag_count: 0,
        writable: false,
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// 单例实例
export const kvStorage = new KVStorage();
