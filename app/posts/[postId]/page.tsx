// 服务器组件
import { fetchPost } from '@/services/api';

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
      <div className="min-h-screen bg-white dark:bg-catppuccin-base">
        {/* 容器：使用更宽的最大宽度以容纳内容+大纲 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 文章头部：居中显示 */}
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-catppuccin-text leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-catppuccin-overlay0 mb-6">
              <span>创建于: {new Date(post.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              {post.updated_at !== post.created_at && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>更新于: {new Date(post.updated_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </>
              )}
            </div>
            {/* 标签 */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors dark:bg-catppuccin-surface0 dark:text-catppuccin-blue dark:hover:bg-catppuccin-surface1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 内容区域：文章居中 + 大纲固定右侧 */}
          <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* 主内容区：居中显示，最佳阅读宽度 */}
            <article className="flex-1 max-w-3xl mx-auto lg:mx-0 w-full">
              <div className="bg-white dark:bg-catppuccin-base rounded-lg">
                <MarkdownRenderer content={post.content} />
              </div>
            </article>

            {/* 右侧大纲：固定位置 */}
            <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
              <ArticleOutline content={post.content} />
            </aside>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">文章加载失败</h1>
        <p className="text-gray-600 dark:text-catppuccin-subtext0">
          无法加载指定的文章，请检查文章ID是否正确，或稍后再试。
        </p>
      </div>
    );
  }
}
