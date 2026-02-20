'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Zap } from 'lucide-react';

interface JikePreviewProps {
  title: string;
  content: string;
}

const MAX_LENGTH = 2000;

export default function JikePreview({ title, content }: JikePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [extractImages, setExtractImages] = useState(true);

  // Format content for Jike
  const formattedContent = useMemo(() => {
    let text = title ? `${title}\n\n${content}` : content;
    
    // Convert markdown to plain text with simple formatting
    text = text
      // Headers to bold
      .replace(/^#+ (.+)$/gm, '**$1**')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '$1')
      // Italic
      .replace(/\*(.+?)\*/g, '$1')
      // Code blocks to quotes
      .replace(/```[\s\S]*?```/g, '[代码块]')
      // Inline code
      .replace(/`(.+?)`/g, '$1')
      // Lists
      .replace(/^- (.+)$/gm, '• $1')
      // Quotes
      .replace(/^&gt; (.+)$/gm, '「$1」')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '$1 $2');

    // Truncate if too long
    if (text.length > MAX_LENGTH) {
      text = text.slice(0, MAX_LENGTH - 3) + '...';
    }

    return text;
  }, [title, content]);

  // Extract potential topics from content
  const topics = useMemo(() => {
    const matches = content.match(/#(\w+)/g);
    return matches ? matches.slice(0, 3) : [];
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-[var(--text-muted)]">字数：</span>
            <span className={formattedContent.length > MAX_LENGTH ? 'text-red-500' : 'text-[var(--text-primary)]'}>
              {formattedContent.length} / {MAX_LENGTH}
            </span>
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={extractImages}
              onChange={(e) => setExtractImages(e.target.checked)}
              className="rounded"
            />
            提取图片
          </label>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#ffe411] text-black rounded-lg hover:bg-[#ffe411]/90 transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? '已复制' : '复制内容'}
        </button>
      </div>

      {/* Preview */}
      <div className="max-w-[400px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Jike Card Header */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-[#ffe411] flex items-center justify-center">
            <Zap size={20} className="text-black" />
          </div>
          <div>
            <div className="font-bold text-[var(--text-primary)]">Lee</div>
            <div className="text-xs text-[var(--text-muted)]">即刻</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
            {formattedContent || '开始写作，即刻动态将在这里显示...'}
          </div>

          {/* Topics */}
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="text-[#ffe411] text-sm"
                >
                  #{topic.replace('#', '')}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>{new Date().toLocaleDateString('zh-CN')}</span>
          <div className="flex items-center gap-4">
            <span>转发</span>
            <span>评论</span>
            <span>赞</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 max-w-[400px] mx-auto">
        <div className="bg-[var(--surface)] rounded-lg p-4 text-sm">
          <h4 className="font-medium text-[var(--text-primary)] mb-2">即刻发布提示</h4>
          <ul className="text-[var(--text-secondary)] space-y-1 list-disc list-inside">
            <li>即刻适合短内容，建议控制在 2000 字以内</li>
            <li>使用话题标签（#话题#）增加曝光</li>
            <li>可以添加图片丰富内容</li>
            <li>关注即刻的「程序员」「产品设计」等圈子</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
