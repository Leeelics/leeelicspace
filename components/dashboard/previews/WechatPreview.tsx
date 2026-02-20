'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import DOMPurify from 'dompurify';

interface WechatPreviewProps {
  title: string;
  content: string;
}

// Allowed HTML tags and attributes for WeChat
const WECHAT_ALLOWED_TAGS = [
  'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'em', 'b', 'i', 'u', 'strike', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'img', 'span', 'div'
];

const WECHAT_ALLOWED_ATTR = [
  'style', 'href', 'src', 'alt', 'title', 'class'
];

export default function WechatPreview({ title, content }: WechatPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showHtml, setShowHtml] = useState(false);

  // Simple markdown to HTML conversion for WeChat
  const convertToWechatHtml = (markdown: string): string => {
    // First, escape HTML entities to prevent injection
    let html = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headers
    html = html
      .replace(/^&lt;h1&gt;(.+?)&lt;\/h1&gt;$/gm, '<h1 style="font-size: 20px; font-weight: bold; margin: 20px 0;">$1</h1>')
      .replace(/^&lt;h2&gt;(.+?)&lt;\/h2&gt;$/gm, '<h2 style="font-size: 18px; font-weight: bold; margin: 16px 0;">$1</h2>')
      .replace(/^&lt;h3&gt;(.+?)&lt;\/h3&gt;$/gm, '<h3 style="font-size: 16px; font-weight: bold; margin: 14px 0;">$1</h3>');
    
    // Headers from markdown # syntax
    html = html
      .replace(/^# (.+)$/gm, '<h1 style="font-size: 20px; font-weight: bold; margin: 20px 0;">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size: 18px; font-weight: bold; margin: 16px 0;">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 style="font-size: 16px; font-weight: bold; margin: 14px 0;">$1</h3>');
    
    // Bold and italic
    html = html
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Lists
    html = html
      .replace(/^- (.+)$/gm, '<li style="margin: 8px 0;">$1</li>');
    
    // Wrap consecutive li elements in ul
    html = html.replace(/(<li[^>]*>.+<\/li>\n?)+/g, '<ul style="margin: 16px 0; padding-left: 20px;">$&</ul>');
    
    // Quotes
    html = html
      .replace(/^&gt; (.+)$/gm, '<blockquote style="border-left: 4px solid #07c160; padding-left: 16px; margin: 16px 0; color: #666;">$1</blockquote>');
    
    // Code blocks
    html = html
      .replace(/```([\s\S]+?)```/g, '<pre style="background: #f6f6f6; padding: 12px; border-radius: 4px; overflow-x: auto; margin: 16px 0;"><code>$1</code></pre>');
    
    // Inline code
    html = html
      .replace(/`(.+?)`/g, '<code style="background: #f6f6f6; padding: 2px 6px; border-radius: 3px; font-family: monospace;">$1</code>');
    
    // Paragraphs
    html = html
      .replace(/\n\n/g, '</p><p style="margin: 16px 0; line-height: 1.8;">');
    
    // Line breaks
    html = html
      .replace(/\n/g, '<br>');

    // Wrap with p tag if not already wrapped
    if (!html.startsWith('<')) {
      html = `<p style="margin: 16px 0; line-height: 1.8;">${html}</p>`;
    }

    return html;
  };

  // Sanitize HTML content using DOMPurify
  const sanitizedHtml = useMemo(() => {
    const rawHtml = convertToWechatHtml(content);
    
    // Use DOMPurify to sanitize HTML
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: WECHAT_ALLOWED_TAGS,
      ALLOWED_ATTR: WECHAT_ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false, // Disable data-* attributes
      SANITIZE_DOM: true,
    });
  }, [content]);

  const handleCopy = () => {
    // Copy sanitized HTML to clipboard
    navigator.clipboard.writeText(sanitizedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHtml(false)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              !showHtml ? 'bg-[#07c160] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)]'
            }`}
          >
            预览
          </button>
          <button
            onClick={() => setShowHtml(true)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              showHtml ? 'bg-[#07c160] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)]'
            }`}
          >
            HTML
          </button>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
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

          {/* Content - now sanitized */}
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
