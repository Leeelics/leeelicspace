"use client";

import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 简化的Markdown渲染组件，只渲染内容，不包含大纲
export function MarkdownContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className="w-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

// 组合组件，保持向后兼容
function MarkdownWithOutline({ content }: { content: string }) {
  return <MarkdownContent content={content} />;
}

export default MarkdownWithOutline;
