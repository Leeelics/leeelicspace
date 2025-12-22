'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRef } from 'react';

// Markdown内容渲染组件
function MarkdownContent({ content }: { content: string }) {
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

export default MarkdownContent;
