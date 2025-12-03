'use client';

// 客户端组件导入
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'next/navigation';
import { fetchPost } from '@/services/api';

// 主页面组件 - 客户端组件
export default function PostDetail() {
  // 使用useParams钩子获取路由参数
  const params = useParams();
  const postId = params.postId as string;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // 获取文章数据
  useEffect(() => {
    const loadPost = async () => {
      try {
        const postIdNum = parseInt(postId);
        const postData = await fetchPost(postIdNum);
        setPost(postData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading post:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);
  
  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Loading...</div>;
  }

  if (error || !post) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Error loading post</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
      
      {/* 文章内容和大纲 - 按用户要求的布局 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧：文章内容（区域1） */}
        <div className="w-full lg:w-3/4">
          <MarkdownRenderer content={post.content} />
        </div>
        
        {/* 右侧：文章大纲（区域2） */}
        <div className="w-full lg:w-1/4">
          <ArticleOutline content={post.content} />
        </div>
      </div>
    </div>
  );
}

// Markdown渲染组件
function MarkdownRenderer({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={contentRef} className="w-full prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// 文章大纲组件
function ArticleOutline({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Array<{ level: number; text: string; id: string }>>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  
  // 提取Markdown中的标题
  useEffect(() => {
    const extractedHeadings: Array<{ level: number; text: string; id: string }> = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        extractedHeadings.push({ level, text, id });
      }
    });
    
    setHeadings(extractedHeadings);
  }, [content]);
  
  // 监听滚动，更新当前活动标题
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let current = '';
      
      // 找到当前可见的最高级标题
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            current = heading.id;
          } else {
            break;
          }
        }
      }
      
      setActiveHeading(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);
  
  if (headings.length === 0) {
    return null;
  }
  
  return (
    <div className="hidden lg:block lg:sticky lg:top-24 self-start">
      <div className="bg-gray-50 rounded-lg p-4 dark:bg-catppuccin-surface0">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-catppuccin-text">文章大纲</h3>
        <nav className="text-sm">
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id} className={`ml-${(heading.level - 1) * 4}`}>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1 px-2 rounded transition-colors ${activeHeading === heading.id
                    ? 'text-blue-600 dark:text-catppuccin-blue font-medium'
                    : 'text-gray-600 dark:text-catppuccin-subtext0 hover:text-blue-500 dark:hover:text-catppuccin-blue'}`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}