import { fetchPost } from '@/services/api';
import { notFound } from 'next/navigation';
import MarkdownWithOutline from '@/components/MarkdownWithOutline';

export default async function PostDetail({ params }: { params: Promise<{ postId: string }> }) {
  // 解包 params Promise
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.postId);
  let post;
  
  try {
    post = await fetchPost(postId);
  } catch (error) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-catppuccin-text">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6 dark:text-catppuccin-overlay0">
          创建于: {new Date(post.created_at).toLocaleString()}
          {post.updated_at !== post.created_at && (
            <span className="ml-2">更新于: {new Date(post.updated_at).toLocaleString()}</span>
          )}
        </div>
        
        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm dark:bg-catppuccin-surface0 dark:text-catppuccin-subtext0">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* 文章内容和大纲 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧：文章内容 */}
        <div className="lg:w-3/4">
          <MarkdownWithOutline content={post.content} />
        </div>
      </div>
    </div>
  );
}