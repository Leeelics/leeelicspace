"use client";

import { Check, Copy, Twitter } from "lucide-react";
import React, { useMemo, useState } from "react";
import type { XThreadPost } from "@/types";

interface XPreviewProps {
  title: string;
  content: string;
}

const MAX_LENGTH = 280;

export default function XPreview({ title, content }: XPreviewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [addNumbering, setAddNumbering] = useState(true);
  const [threadMode, setThreadMode] = useState(false);

  // Split content into threads
  const threads: XThreadPost[] = useMemo(() => {
    const fullText = title ? `${title}\n\n${content}` : content;
    const plainText = fullText.replace(/[#*`>\-[\]()]/g, "");

    if (!threadMode || plainText.length <= MAX_LENGTH) {
      return [
        {
          number: 1,
          total: 1,
          content: plainText.slice(0, MAX_LENGTH),
          charCount: Math.min(plainText.length, MAX_LENGTH),
        },
      ];
    }

    // Split into multiple posts
    const posts: XThreadPost[] = [];
    let remaining = plainText;
    let number = 1;

    while (remaining.length > 0) {
      // Reserve space for numbering (e.g., "1/10 ")
      const numberingLength = addNumbering ? 6 : 0;
      const availableLength = MAX_LENGTH - numberingLength;

      let chunk = remaining.slice(0, availableLength);

      // Try to break at sentence end
      const lastSentence = chunk.match(/.*[。！？.!?\n]/);
      if (lastSentence && lastSentence[0].length > availableLength * 0.5) {
        chunk = lastSentence[0];
      }

      const numberedContent = addNumbering
        ? `${number}/${Math.ceil(plainText.length / availableLength)} ${chunk}`
        : chunk;

      posts.push({
        number,
        total: 0, // Will update after
        content: numberedContent,
        charCount: numberedContent.length,
      });

      remaining = remaining.slice(chunk.length).trim();
      number++;

      // Safety limit
      if (number > 25) break;
    }

    // Update total
    posts.forEach((post) => (post.total = posts.length));

    return posts;
  }, [title, content, addNumbering, threadMode]);

  const handleCopy = (index: number) => {
    navigator.clipboard.writeText(threads[index].content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allContent = threads.map((t) => t.content).join("\n\n---\n\n");
    navigator.clipboard.writeText(allContent);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-8">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={threadMode}
              onChange={(e) => setThreadMode(e.target.checked)}
              className="rounded"
            />
            线程模式
          </label>
          {threadMode && (
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={addNumbering}
                onChange={(e) => setAddNumbering(e.target.checked)}
                className="rounded"
              />
              添加编号
            </label>
          )}
        </div>
        {threads.length > 1 && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
          >
            {copiedIndex === -1 ? <Check size={14} /> : <Copy size={14} />}
            复制全部
          </button>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-4 max-w-[500px] mx-auto">
        {threads.map((post, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <Twitter size={20} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-[var(--text-primary)]">Lee</div>
                <div className="text-sm text-[var(--text-muted)]">
                  @leelicspace
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-[var(--text-primary)] whitespace-pre-wrap mb-3">
              {post.content}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[var(--text-muted)] text-sm">
              <span>{new Date().toLocaleDateString("zh-CN")}</span>
              <div className="flex items-center gap-3">
                <span
                  className={post.charCount > MAX_LENGTH ? "text-red-500" : ""}
                >
                  {post.charCount}/{MAX_LENGTH}
                </span>
                <button
                  onClick={() => handleCopy(index)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  {copiedIndex === index ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
        共 {threads.length} 条推文
        {threads.length > 1 && " · 按顺序发布形成线程"}
      </div>
    </div>
  );
}
