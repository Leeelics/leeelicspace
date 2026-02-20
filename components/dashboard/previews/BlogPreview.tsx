"use client";

// React import not needed in Next.js
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPreviewProps {
  title: string;
  content: string;
  tags: string[];
}

export default function BlogPreview({
  title,
  content,
  tags,
}: BlogPreviewProps) {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          {title || "未命名文章"}
        </h1>
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
          <span>{new Date().toLocaleDateString("zh-CN")}</span>
          <span>·</span>
          <span>{content.length} 字</span>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-[var(--surface)] text-[var(--text-secondary)] rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none text-[var(--text-primary)]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content || "开始写作，内容将在这里预览..."}
        </ReactMarkdown>
      </div>
    </div>
  );
}
