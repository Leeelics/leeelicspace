// 服务器组件
import { fetchPost } from '@/services/api';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

// 客户端组件 - 分离到单独的文件
import MarkdownRenderer from '@/components/MarkdownContent';
import ArticleOutline from '@/components/ArticleOutline';

// 主页面组件 - 服务器组件
export default async function PostDetail({ params }: { params: Promise<{ postId: string, locale: string }> }) {
  try {
    const { postId, locale } = await params;
    const post = await fetchPost(postId);
    const t = await getTranslations();
    
    if (!post) {
      throw new Error('未找到文章');
    }
    
    return (
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero Section - 文章标题区域 */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-20 border-b border-[var(--border)] bg-gradient-to-b from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)]">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* 返回链接 */}
              <Link 
                href={`/${locale}`}
                className="inline-flex items-center text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors mb-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2" aria-label="返回">
                  <title>返回</title>
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                {t('article.backToHome') || '返回首页'}
              </Link>
              
              {/* 文章标题 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-8">
                {post.title}
              </h1>
              
              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)] mb-6">
                <time dateTime={post.created_at}>
                  {new Date(post.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
                
                {post.updated_at !== post.created_at && (
                  <>
                    <span className="text-[var(--border)]">•</span>
                    <span>
                      {t('article.updated') || '更新于'} {new Date(post.updated_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', { 
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
                    href={`/${locale}?tag=${tag}`}
                    className="tag hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 内容区域 - 两栏布局 */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* 左侧：正文内容 */}
              <article className="lg:col-span-8 prose prose-lg max-w-none">
                <div className="text-[var(--text-primary)] leading-relaxed">
                  <MarkdownRenderer content={post.content} />
                </div>
              </article>

              {/* 右侧：目录大纲 */}
              <aside className="hidden lg:block lg:col-span-4">
                <div className="sticky top-28">
                  <ArticleOutline content={post.content} />
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* 文章底部 */}
        <footer className="border-t border-[var(--border)] py-16 md:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-[var(--text-muted)]">
                {t('article.thanks') || '感谢阅读'}
              </div>
              
              <Link 
                href={`/${locale}`}
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
                {t('article.browseMore') || '浏览更多文章'}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container py-20 text-center">
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
