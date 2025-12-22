import { Post } from '@/types';
import Link from 'next/link';

export default async function Home({ searchParams }: { searchParams?: Promise<{ page?: string; tag?: string; search?: string }> }) {
  // 处理 searchParams - 在Next.js 16中，searchParams是Promise，需要await解包
  const resolvedSearchParams = await searchParams || {};
  const page = parseInt(resolvedSearchParams?.page || '1');
  const tag = resolvedSearchParams?.tag || undefined;
  const search = resolvedSearchParams?.search || undefined;
  
  // 直接使用fetch函数获取数据，避免URL解析问题
  const [postsResponse, tagsResponse] = await Promise.all([
    fetch(`http://localhost:3000/api/posts?page=${page}&per_page=5${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`),
    fetch('http://localhost:3000/api/tags')
  ]);

  if (!postsResponse.ok || !tagsResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const postsResponseData = await postsResponse.json();
  const tags = await tagsResponse.json();
  
  const { posts, pagination } = postsResponseData;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-catppuccin-text">博客文章</h1>
      
      {/* 标签筛选 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-catppuccin-subtext1">标签</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={search ? `/?search=${search}` : "/"}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${!tag 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-catppuccin-surface0 dark:text-catppuccin-subtext0 dark:hover:bg-catppuccin-surface1'}`}
          >
            全部
          </Link>
          {tags.map((t: string) => (
            <Link
              key={t}
              href={`/?tag=${t}${search ? `&search=${search}` : ''}`}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${tag === t 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-catppuccin-surface0 dark:text-catppuccin-subtext0 dark:hover:bg-catppuccin-surface1'}`}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>
      
      {/* 文章列表 */}
      <div className="space-y-6">
        {posts.map((post: Post) => (
          <article key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow dark:border-catppuccin-surface1 dark:bg-catppuccin-base">
            <Link href={`/posts/${post.id}`} className="block">
              <h2 className="text-xl font-semibold mb-2 text-blue-600 hover:text-blue-800 transition-colors dark:text-catppuccin-blue dark:hover:text-catppuccin-lavender">
                {post.title}
              </h2>
              
              {/* 文章标签 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((t) => (
                  <span key={t} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs dark:bg-catppuccin-surface0 dark:text-catppuccin-subtext0">
                    {t}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-600 mb-3 line-clamp-2 dark:text-catppuccin-subtext0">{post.content}</p>
              <div className="text-sm text-gray-500 dark:text-catppuccin-overlay0">
                创建于: {new Date(post.created_at).toLocaleString()}
                {post.updated_at !== post.created_at && (
                  <span className="ml-2">更新于: {new Date(post.updated_at).toLocaleString()}</span>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {/* 分页 */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <Link
            href={`/?${new URLSearchParams({ page: (page - 1).toString(), ...(tag ? { tag } : {}), ...(search ? { search } : {}) })}`}
            className={`px-4 py-2 rounded-lg border ${page === 1 
              ? 'cursor-not-allowed opacity-50 border-gray-300 text-gray-500 dark:border-catppuccin-surface1 dark:text-catppuccin-overlay0' 
              : 'border-gray-300 hover:bg-gray-100 dark:border-catppuccin-surface1 dark:hover:bg-catppuccin-surface0'}`}
            aria-disabled={page === 1}
          >
            上一页
          </Link>
          
          <span className="px-4 py-2 rounded-lg bg-gray-100 font-medium dark:bg-catppuccin-surface0">
            第 {page} / {pagination.total_pages} 页
          </span>
          
          <Link
            href={`/?${new URLSearchParams({ page: (page + 1).toString(), ...(tag ? { tag } : {}), ...(search ? { search } : {}) })}`}
            className={`px-4 py-2 rounded-lg border ${page === pagination.total_pages 
              ? 'cursor-not-allowed opacity-50 border-gray-300 text-gray-500 dark:border-catppuccin-surface1 dark:text-catppuccin-overlay0' 
              : 'border-gray-300 hover:bg-gray-100 dark:border-catppuccin-surface1 dark:hover:bg-catppuccin-surface0'}`}
            aria-disabled={page === pagination.total_pages}
          >
            下一页
          </Link>
        </nav>
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-catppuccin-overlay0">
          <p>暂无文章，快来写第一篇吧！</p>
        </div>
      )}
    </div>
  );
}
