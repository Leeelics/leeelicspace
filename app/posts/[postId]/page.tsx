// 服务器组件
import { fetchPost } from '@/services/api';
import Link from 'next/link';

// 客户端组件 - 分离到单独的文件
import MarkdownRenderer from '@/components/MarkdownContent';
import ArticleOutline from '@/components/ArticleOutline';

// 主页面组件 - 服务器组件

export default async function PostDetail({ params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params;
    const post = await fetchPost(postId);
    if (!post) {
      throw new Error('未找到文章');
    }
    return (
      <div className="min-h-screen bg-[var(--background)]">
        {/* 顶部返回导航 */}
        <div className="border-b border-[var(--border)]">
          <div className="container container-narrow py-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2" aria-label="返回">
                <title>返回</title>
                <path d="m15 18-6-6 6-6"/>
              </svg>
              返回首页
            </Link>
          </div>
        </div>

        <div className="container container-narrow py-12 md:py-16">
          {/* 文章头部 */}
          <header className="mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)] mb-6">
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('zh-CN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              
              {post.updated_at !== post.created_at && (
                <>
                  <span className="text-[var(--border)]">•</span>
                  <span>
                    更新于 {new Date(post.updated_at).toLocaleDateString('zh-CN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </>
              )}
            </div>
            
            {/* 标签 */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/?tag=${tag}`}
                  className="tag hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </header>

          {/* 内容区域 */}
          <div className="relative">
            <article className="prose prose-lg max-w-none">
              <div className="text-[var(--text-primary)]">
                <MarkdownRenderer content={post.content} />
              </div>
            </article>

            {/* 右侧大纲 - 桌面端显示 */}
            <aside className="hidden xl:block fixed top-24 right-8 w-64">
              <ArticleOutline content={post.content} />
            </aside>
          </div>

          {/* 文章底部 */}
          <footer className="mt-16 pt-8 border-t border-[var(--border)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-[var(--text-muted)]">
                感谢阅读
              </div>
              
              <Link 
                href="/" 
                className="btn btn-secondary btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2" aria-label="文章列表">
                  <title>文章列表</title>
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                浏览更多文章
              </Link>
            </div>
          </footer>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container container-narrow py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--surface)] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)]" aria-label="错误">
              <title>错误</title>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">文章加载失败</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            无法加载指定的文章，请检查文章ID是否正确，或稍后再试。
          </p>
          <Link href="/" className="btn btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    );
  }
}
