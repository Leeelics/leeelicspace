'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRef, useEffect } from 'react';

// Markdown内容渲染组件 - 优化阅读体验
function MarkdownContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  // 为标题添加 ID，用于大纲跳转
  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        const text = heading.textContent || '';
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        heading.id = id;
      });
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="w-full prose prose-lg max-w-none dark:prose-invert
        prose-headings:scroll-mt-24
        prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-catppuccin-surface1
        prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6
        prose-h4:text-lg prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-4
        prose-p:text-gray-700 dark:prose-p:text-catppuccin-text prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-blue-600 dark:prose-a:text-catppuccin-blue prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-catppuccin-text prose-strong:font-semibold
        prose-code:text-pink-600 dark:prose-code:text-catppuccin-pink prose-code:bg-gray-100 dark:prose-code:bg-catppuccin-surface0 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-gray-900 dark:prose-pre:bg-catppuccin-crust prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:my-6
        prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
        prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
        prose-li:text-gray-700 dark:prose-li:text-catppuccin-text prose-li:my-1
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-catppuccin-blue prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-catppuccin-subtext0
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
        prose-hr:my-8 prose-hr:border-gray-300 dark:prose-hr:border-catppuccin-surface1
        prose-table:my-6
        prose-th:bg-gray-100 dark:prose-th:bg-catppuccin-surface0 prose-th:font-semibold
        prose-td:border prose-td:border-gray-300 dark:prose-td:border-catppuccin-surface1"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;
