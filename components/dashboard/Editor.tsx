"use client";

// React type used for props interface
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  return (
    <div className="h-full flex flex-col">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="开始写作...支持 Markdown 格式

# 标题
## 二级标题

- 列表项
- 列表项

**粗体** *斜体*

> 引用

```code
代码块
```"
        className="flex-1 w-full p-6 resize-none bg-transparent border-none outline-none text-[var(--text-primary)] font-mono text-sm leading-relaxed placeholder:text-[var(--text-muted)]"
        spellCheck={false}
      />
    </div>
  );
}

// Simple preview component for internal use
export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none p-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
