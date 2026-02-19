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

// 根据环境选择存储方式
// 开发环境使用内存存储，生产环境使用KV存储
let storage: any;

if (process.env.NODE_ENV === 'development') {
  // 内存存储实现（兼容KV存储接口）
  class MemoryStorage {
    private posts: any[] = [];
    private initialized = false;

    async initialize() {
      if (this.initialized) return;
      
      // 创建初始文章数据
      const initialPosts = [
        {
          id: "4eb37cde",
          title: "Git 高级技巧分享",
          content: "Git 是现代开发中不可或缺的版本控制工具。以下是一些高级技巧：\n\n## 1. 交互式rebase\n\n使用 `git rebase -i` 可以交互式地修改提交历史，包括合并、编辑和删除提交。\n\n## 2. 重置和恢复\n\n- `git reset`: 重置分支指向和工作目录\n- `git checkout --`: 恢复工作目录文件\n- `git revert`: 创建新提交来撤销之前的提交\n\n## 3. 子模块和子树\n\n- `git submodule`: 管理外部依赖\n- `git subtree`: 将外部仓库作为子目录引入\n\n## 4. 钩子脚本\n\n使用Git钩子可以自动化开发流程，如提交前的代码检查、自动部署等。\n\n掌握这些高级技巧可以让你更加高效地使用Git，提高开发效率。",
          tags: ["Git", "开发工具", "版本控制"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "220fef26",
          title: "Docker 容器化最佳实践",
          content: "Docker 容器化已经成为现代应用部署的标准方式。以下是一些最佳实践：\n\n## 1. 镜像优化\n\n- 使用多阶段构建减少镜像大小\n- 选择合适的基础镜像（如Alpine）\n- 最小化镜像层数\n\n## 2. 容器安全\n\n- 使用非root用户运行容器\n- 定期更新基础镜像和依赖\n- 扫描镜像漏洞\n\n## 3. 编排和管理\n\n- 使用Docker Compose管理多容器应用\n- 考虑使用Kubernetes进行大规模部署\n\n## 4. 日志和监控\n\n- 配置适当的日志记录\n- 使用监控工具（如Prometheus、Grafana）监控容器性能\n\n遵循这些最佳实践可以确保你的容器化应用安全、高效地运行。",
          tags: ["Docker", "容器化", "DevOps"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "08aa9ef7",
          title: "数据结构与算法学习心得",
          content: "数据结构与算法是程序员的基本功。以下是我的学习心得：\n\n## 1. 学习方法\n\n- 理解基本概念和原理\n- 动手实现常见数据结构和算法\n- 刷LeetCode等平台的题目\n- 学习算法复杂度分析\n\n## 2. 重点数据结构\n\n- 数组、链表、栈、队列\n- 树、图\n- 哈希表、集合\n- 堆、优先队列\n\n## 3. 重点算法\n\n- 排序算法\n- 搜索算法\n- 动态规划\n- 贪心算法\n- 回溯算法\n\n## 4. 实践应用\n\n将所学的算法应用到实际项目中，解决实际问题，加深理解。\n\n持续学习和实践是掌握数据结构与算法的关键。",
          tags: ["数据结构", "算法", "编程基础"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "0d58d368",
          title: "前端性能优化指南",
          content: "前端性能优化是提升用户体验的重要手段。以下是一些优化策略：\n\n## 1. 资源加载优化\n\n- 压缩CSS和JavaScript\n- 图片优化（压缩、懒加载、WebP格式）\n- 使用CDN加速资源加载\n\n## 2. 渲染优化\n\n- 减少DOM操作\n- 使用虚拟DOM\n- 优化CSS选择器\n- 使用requestAnimationFrame\n\n## 3. 代码优化\n\n- 减少JavaScript执行时间\n- 避免不必要的重渲染\n- 使用Web Workers处理耗时任务\n\n## 4. 缓存策略\n\n- 利用浏览器缓存\n- 使用Service Worker实现离线缓存\n\n## 5. 监控和分析\n\n- 使用Lighthouse等工具分析性能\n- 监控真实用户体验（RUM）\n\n通过持续优化，可以显著提升前端应用的性能和用户体验。",
          tags: ["前端", "性能优化", "用户体验"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "c12910bb",
          title: "Next.js 16 新特性介绍",
          content: "Next.js 16 带来了许多令人兴奋的新特性，包括：\n\n- Turbopack 构建速度提升\n- React 19 支持\n- 更好的服务器组件支持\n- 改进的开发体验\n\n这些新特性让Next.js在构建现代Web应用时更加高效和便捷。",
          tags: ["Next.js", "React", "前端"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      this.posts = initialPosts;
      this.initialized = true;
    }

    async getAllPosts() {
      await this.initialize();
      return this.posts;
    }

    async getPostById(id: string) {
      await this.initialize();
      return this.posts.find((p: any) => p.id === id) || null;
    }

    async createPost(postData: any) {
      await this.initialize();
      const id = Math.random().toString(36).substring(2, 10);
      const now = new Date().toISOString();
      const newPost = {
        id,
        ...postData,
        created_at: now,
        updated_at: now
      };
      this.posts.push(newPost);
      return newPost;
    }

    async updatePost(id: string, updateData: any) {
      await this.initialize();
      const post = this.posts.find((p: any) => p.id === id);
      if (!post) return null;
      
      Object.assign(post, updateData);
      post.updated_at = new Date().toISOString();
      return post;
    }

    async deletePost(id: string) {
      await this.initialize();
      const initialLength = this.posts.length;
      this.posts = this.posts.filter((p: any) => p.id !== id);
      return this.posts.length < initialLength;
    }

    async getAllTags() {
      await this.initialize();
      const tags = new Set<string>();
      for (const post of this.posts) {
        for (const tag of post.tags) {
          tags.add(tag);
        }
      }
      return Array.from(tags);
    }

    async getSortedPosts() {
      await this.initialize();
      return [...this.posts].sort((a: any, b: any) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
    }
  }

  storage = new MemoryStorage();
} else {
  // 生产环境使用KV存储
  storage = kvStorage;
}

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
