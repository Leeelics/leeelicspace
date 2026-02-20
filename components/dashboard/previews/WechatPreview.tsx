'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import DOMPurify from 'dompurify';

interface WechatPreviewProps {
  title: string;
  content: string;
}

// Allowed HTML tags and attributes for WeChat - 模块级常量
const WECHAT_ALLOWED_TAGS = [
  'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'em', 'b', 'i', 'u', 'strike', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'img', 'span', 'div'
];

const WECHAT_ALLOWED_ATTR = [
  'style', 'href', 'src', 'alt', 'title', 'class'
];

// 模块级正则表达式，避免每次渲染重新创建
const REGEX_PATTERNS = {
  // HTML 转义
  htmlEntities: {
    amp: /&/g,
    lt: /</g,
    gt: />/g,
  },
  // 标题
  headersHtml: {
    h1: /^&lt;h1&gt;(.+?)&lt;\/h1&gt;$/gm,
    h2: /^&lt;h2&gt;(.+?)&lt;\/h2&gt;$/gm,
    h3: /^&lt;h3&gt;(.+?)&lt;\/h3&gt;$/gm,
  },
  headersMarkdown: {
    h1: /^# (.+)$/gm,
    h2: /^## (.+)$/gm,
    h3: /^### (.+)$/gm,
  },
  // 格式
  bold: /\*\*(.+?)\*\*/g,
  italic: /\*(.+?)\*/g,
  listItem: /^- (.+)$/gm,
  listWrapper: /(<li[^>]*>.+<\/li>\n?)+/g,
  quote: /^&gt; (.+)$/gm,
  codeBlock: /```([\s\S]+?)```/g,
  inlineCode: /`(.+?)`/g,
  paragraph: /\n\n/g,
  lineBreak: /\n/g,
};

// 标题样式模板
const HEADER_STYLES = {
  h1: '<h1 style="font-size: 20px; font-weight: bold; margin: 20px 0;">$1</h1>',
  h2: '<h2 style="font-size: 18px; font-weight: bold; margin: 16px 0;">$1</h2>',
  h3: '<h3 style="font-size: 16px; font-weight: bold; margin: 14px 0;">$1</h3>',
};

// Markdown to HTML 转换函数 - 移到模块级，避免每次渲染重新创建
const convertToWechatHtml = (markdown: string): string => {
  // HTML 实体转义
  let html = markdown
    .replace(REGEX_PATTERNS.htmlEntities.amp, '&amp;')
    .replace(REGEX_PATTERNS.htmlEntities.lt, '&lt;')
    .replace(REGEX_PATTERNS.htmlEntities.gt, '&gt;');

  // 处理 HTML 标签形式的标题
  html = html
    .replace(REGEX_PATTERNS.headersHtml.h1, HEADER_STYLES.h1)
    .replace(REGEX_PATTERNS.headersHtml.h2, HEADER_STYLES.h2)
    .replace(REGEX_PATTERNS.headersHtml.h3, HEADER_STYLES.h3);
  
  // 处理 Markdown 形式的标题
  html = html
    .replace(REGEX_PATTERNS.headersMarkdown.h1, HEADER_STYLES.h1)
    .replace(REGEX_PATTERNS.headersMarkdown.h2, HEADER_STYLES.h2)
    .replace(REGEX_PATTERNS.headersMarkdown.h3, HEADER_STYLES.h3);
  
  // 粗体和斜体
  html = html
    .replace(REGEX_PATTERNS.bold, '<strong>$1</strong>')
    .replace(REGEX_PATTERNS.italic, '<em>$1</em>');
  
  // 列表
  html = html
    .replace(REGEX_PATTERNS.listItem, '<li style="margin: 8px 0;">$1</li>');
  
  // 包裹连续的 li 元素
  html = html.replace(REGEX_PATTERNS.listWrapper, '<ul style="margin: 16px 0; padding-left: 20px;">$&</ul>');
  
  // 引用
  html = html.replace(REGEX_PATTERNS.quote, '<blockquote style="border-left: 4px solid #07c160; padding-left: 16px; margin: 16px 0; color: #666;">$1</blockquote>');
  
  // 代码块
  html = html.replace(REGEX_PATTERNS.codeBlock, '<pre style="background: #f6f6f6; padding: 12px; border-radius: 4px; overflow-x: auto; margin: 16px 0;"><code>$1</code></pre>');
  
  // 行内代码
  html = html.replace(REGEX_PATTERNS.inlineCode, '<code style="background: #f6f6f6; padding: 2px 6px; border-radius: 3px; font-family: monospace;">$1</code>');
  
  // 段落
  html = html.replace(REGEX_PATTERNS.paragraph, '</p><p style="margin: 16px 0; line-height: 1.8;">');
  
  // 换行
  html = html.replace(REGEX_PATTERNS.lineBreak, '<br>');

  // 如果不是以标签开头，用 p 标签包裹
  if (!html.startsWith('<')) {
    html = `<p style="margin: 16px 0; line-height: 1.8;">${html}</p>`;
  }

  return html;
};

// DOMPurify 配置 - 模块级缓存
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: WECHAT_ALLOWED_TAGS,
  ALLOWED_ATTR: WECHAT_ALLOWED_ATTR,
  ALLOW_DATA_ATTR: false,
  SANITIZE_DOM: true,
};

export default function WechatPreview({ title, content }: WechatPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showHtml, setShowHtml] = useState(false);

  // 使用 useMemo 缓存转换结果
  const sanitizedHtml = useMemo(() => {
    const rawHtml = convertToWechatHtml(content);
    return DOMPurify.sanitize(rawHtml, DOMPURIFY_CONFIG);
  }, [content]);

  // 使用 useCallback 稳定事件处理器
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(sanitizedHtml);
    setCopied(true);
    // 使用 requestAnimationFrame 优化 setState
    requestAnimationFrame(() => {
      setTimeout(() => setCopied(false), 2000);
    });
  }, [sanitizedHtml]);

  const handleShowPreview = useCallback(() => setShowHtml(false), []);
  const handleShowHtml = useCallback(() => setShowHtml(true), []);

  return (
    <div className="p-8">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handleShowPreview}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors focus-ring ${
              !showHtml ? 'bg-[#07c160] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)]'
            }`}
          >
            预览
          </button>
          <button
            onClick={handleShowHtml}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors focus-ring ${
              showHtml ? 'bg-[#07c160] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)]'
            }`}
          >
            HTML
          </button>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors focus-ring"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? '已复制' : '复制 HTML'}
        </button>
      </div>

      {/* Preview */}
      {showHtml ? (
        <div className="bg-[var(--surface)] rounded-lg p-4 overflow-auto">
          <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">
            {sanitizedHtml}
          </pre>
        </div>
      ) : (
        <div className="max-w-[375px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* WeChat Article Header */}
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">
              {title || '未命名文章'}
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-8 h-8 rounded-full bg-[#07c160] flex items-center justify-center text-white text-xs font-bold">
                L
              </div>
              <div>
                <div className="text-sm text-gray-900">leelicspace</div>
                <div className="text-xs text-gray-400">
                  {new Date().toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div 
            className="p-4 text-gray-800"
            style={{ fontSize: '16px', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />

          {/* Footer */}
          <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
            阅读原文 · 赞赏作者
          </div>
        </div>
      )}
    </div>
  );
}
