import { Post } from '@/types';
import Link from 'next/link';
import { buildApiUrl } from '@/lib/url-helper';
import { DataErrorDisplay } from '@/components/DataErrorDisplay';

export default async function Home({ searchParams }: { searchParams?: { page?: string; tag?: string; search?: string } }) {
  // 添加详细的页面加载日志
  console.log('[PAGE] Home component started rendering');
  console.log('[PAGE] Raw searchParams:', searchParams);
  console.log('[PAGE] Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    buildApiUrl: typeof buildApiUrl,
  });
  
  let posts: Post[] = [];
  let tags: string[] = [];
  let pagination = { page: 1, per_page: 5, total: 0, total_pages: 0 };
  let hasError = false;
  let errorMessage = '';
  
  try {
    // 正确处理 searchParams - 在Next.js中，searchParams是同步对象
    console.log('[PAGE] Processing searchParams');
    const page = parseInt(searchParams?.page || '1');
    const tag = searchParams?.tag || undefined;
    const search = searchParams?.search || undefined;
    
    console.log('[PAGE] Parsed parameters:', { page, tag, search });
    
    // 构建完整的API URL
    console.log('[PAGE] Building API URLs');
    const postsUrl = new URL(buildApiUrl('/api/posts'));
    postsUrl.searchParams.set('page', page.toString());
    postsUrl.searchParams.set('per_page', '5');
    if (tag) postsUrl.searchParams.set('tag', tag);
    if (search) postsUrl.searchParams.set('search', search);
    
    const tagsUrl = new URL(buildApiUrl('/api/tags'));
    
    console.log('[PAGE] API URLs:', {
      postsUrl: postsUrl.toString(),
      tagsUrl: tagsUrl.toString(),
    });
    
    console.log('[PAGE] Starting fetch requests');
    const [postsResponse, tagsResponse] = await Promise.all([
      fetch(postsUrl.toString()),
      fetch(tagsUrl.toString())
    ]);
    
    console.log('[PAGE] Fetch responses received:', {
      postsStatus: postsResponse.status,
      postsOk: postsResponse.ok,
      tagsStatus: tagsResponse.status,
      tagsOk: tagsResponse.ok,
    });

    if (!postsResponse.ok || !tagsResponse.ok) {
      console.error('[PAGE] API response error:', {
        postsOk: postsResponse.ok,
        postsStatus: postsResponse.status,
        postsStatusText: postsResponse.statusText,
        tagsOk: tagsResponse.ok,
        tagsStatus: tagsResponse.status,
        tagsStatusText: tagsResponse.statusText,
      });
      
      // 尝试获取错误详情
      try {
        const postsErrorText = await postsResponse.text();
        console.error('[PAGE] Posts API error body:', postsErrorText);
      } catch (e) {
        console.error('[PAGE] Could not read posts error body');
      }
      
      try {
        const tagsErrorText = await tagsResponse.text();
        console.error('[PAGE] Tags API error body:', tagsErrorText);
      } catch (e) {
        console.error('[PAGE] Could not read tags error body');
      }
      
      throw new Error(`Failed to fetch data: posts=${postsResponse.status}, tags=${tagsResponse.status}`);
    }

    console.log('[PAGE] Parsing JSON responses');
    const postsResponseData = await postsResponse.json();
    const tags = await tagsResponse.json();
    
    console.log('[PAGE] Parsed data:', {
      postsCount: postsResponseData.posts?.length,
      totalPosts: postsResponseData.pagination?.total,
      tagsCount: tags.length,
    });
    
    const posts = postsResponseData.posts || [];
    const pagination = postsResponseData.pagination || { page: 1, per_page: 5, total: 0, total_pages: 0 };
    
    console.log('[PAGE] Data extraction successful, rendering component');
    
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
    
  } catch (error) {
    console.error('[PAGE] Error in Home component:', error);
    console.error('[PAGE] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    
    // 返回错误界面
    return (
      <div className="max-w-4xl mx-auto p-8">
        <DataErrorDisplay 
          error={error instanceof Error ? error.message : '未知错误'} 
        />
      </div>
    );
  }
}