import { Post } from "@/types";
import Link from "next/link";
import { buildApiUrl } from "@/lib/url-helper";
import { DataErrorDisplay } from "@/components/DataErrorDisplay";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps<"/">) {
  let posts: Post[] = [];
  let tags: string[] = [];
  let pagination = { page: 1, per_page: 9, total: 0, total_pages: 0 };
  let featuredPost: Post | null = null;
  
  try {
    const resolvedSearchParams = await searchParams;
    const pageParam = resolvedSearchParams?.page;
    const tagParam = resolvedSearchParams?.tag;
    const searchParam = resolvedSearchParams?.search;

    const page = parseInt(
      Array.isArray(pageParam) ? (pageParam[0] ?? '1') : pageParam ?? '1',
      10,
    );
    const tag = Array.isArray(tagParam) ? tagParam[0] : tagParam ?? undefined;
    const search = Array.isArray(searchParam)
      ? searchParam[0]
      : searchParam ?? undefined;
    
    const postsUrl = new URL(buildApiUrl('/api/posts'));
    postsUrl.searchParams.set('page', page.toString());
    postsUrl.searchParams.set('per_page', '9');
    if (tag) postsUrl.searchParams.set('tag', tag);
    if (search) postsUrl.searchParams.set('search', search);
    
    const tagsUrl = new URL(buildApiUrl('/api/tags'));
    
    const [postsResponse, tagsResponse] = await Promise.all([
      fetch(postsUrl.toString()),
      fetch(tagsUrl.toString())
    ]);

    if (!postsResponse.ok || !tagsResponse.ok) {
      throw new Error(`Failed to fetch data`);
    }

    const postsResponseData = await postsResponse.json();
    tags = await tagsResponse.json();
    
    posts = postsResponseData.posts || [];
    pagination = postsResponseData.pagination || { page: 1, per_page: 9, total: 0, total_pages: 0 };
    
    // Set featured post (first post or null if filtering)
    if (!tag && !search && posts.length > 0) {
      featuredPost = posts[0];
      posts = posts.slice(1);
    }
    
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b border-[var(--border)]">
          <div className="container container-narrow text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              L
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
              Lee&apos;s Blog
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
              分享关于技术、设计和生活的思考。
              <br className="hidden md:block" />
              记录学习路上的点滴成长。
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2" aria-label="GitHub">
                  <title>GitHub</title>
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                GitHub
              </a>
              <Link href="/projects" className="btn btn-primary btn-sm">
                查看项目
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2" aria-label="箭头">
                  <title>箭头</title>
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost && !tag && !search && (
          <section className="py-12">
            <div className="container">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient rounded-full"></div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] m-0">精选文章</h2>
              </div>
              
              <Link 
                href={`/posts/${featuredPost.id}`}
                className="card block overflow-hidden group"
              >
                <div className="card-body p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {featuredPost.tags.slice(0, 3).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                    <span className="text-sm text-[var(--text-muted)] ml-auto">
                      {formatDate(featuredPost.created_at)}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-[var(--accent)] transition-colors">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-[var(--text-secondary)] line-clamp-3 mb-4">
                    {featuredPost.content.slice(0, 200)}...
                  </p>
                  
                  <div className="flex items-center text-[var(--accent)] font-medium">
                    阅读全文
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform" aria-label="箭头">
                      <title>箭头</title>
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Tags Filter */}
        <section className="py-8 border-t border-[var(--border)]">
          <div className="container">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={search ? `/?search=${search}` : "/"}
                className={`tag ${!tag ? 'active' : ''}`}
              >
                全部
              </Link>
              {tags.map((t: string) => (
                <Link
                  key={t}
                  href={`/?tag=${t}${search ? `&search=${search}` : ''}`}
                  className={`tag ${tag === t ? 'active' : ''}`}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-8 pb-16">
          <div className="container">
            {(tag || search) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  {search ? `搜索结果: "${search}"` : `标签: ${tag}`}
                </h2>
                <p className="text-[var(--text-tertiary)] mt-1">
                  共 {pagination.total} 篇文章
                </p>
              </div>
            )}

            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post: Post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Link
                      href={`/?${new URLSearchParams({ 
                        page: (page - 1).toString(), 
                        ...(tag ? { tag } : {}), 
                        ...(search ? { search } : {}) 
                      })}`}
                      className={`btn btn-secondary ${page === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      上一页
                    </Link>
                    
                    <span className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)]">
                      {page} / {pagination.total_pages}
                    </span>
                    
                    <Link
                      href={`/?${new URLSearchParams({ 
                        page: (page + 1).toString(), 
                        ...(tag ? { tag } : {}), 
                        ...(search ? { search } : {}) 
                      })}`}
                      className={`btn btn-secondary ${page === pagination.total_pages ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      下一页
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface)] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)]" aria-label="空">
                    <title>空</title>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <p className="text-[var(--text-tertiary)]">
                  {search ? '没有找到相关文章' : '暂无文章'}
                </p>
                {(tag || search) && (
                  <Link href="/" className="btn btn-primary btn-sm mt-4">
                    查看全部文章
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    );
    
  } catch (error) {
    return (
      <div className="container py-16">
        <DataErrorDisplay 
          error={error instanceof Error ? error.message : '未知错误'} 
        />
      </div>
    );
  }
}

// Article Card Component
function ArticleCard({ post }: { post: Post }) {
  return (
    <Link 
      href={`/posts/${post.id}`}
      className="card group flex flex-col h-full"
    >
      <div className="card-body flex flex-col h-full p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 2).map((t) => (
            <span key={t} className="tag text-xs">
              {t}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {post.title}
        </h3>
        
        <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4 flex-grow">
          {post.content.slice(0, 150)}...
        </p>
        
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mt-auto pt-4 border-t border-[var(--border)]">
          <span>{formatDate(post.created_at)}</span>
          <span className="flex items-center text-[var(--accent)]">
            阅读
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform" aria-label="箭头">
              <title>箭头</title>
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// Date formatting helper
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
