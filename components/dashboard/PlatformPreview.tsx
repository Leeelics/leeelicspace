'use client';

import React, { useState } from 'react';
import { 
  Monitor, 
  BookOpen, 
  MessageSquare, 
  Twitter,
  FileText,
  Zap,
} from 'lucide-react';
import type { Platform } from '@/types';
import { platforms } from '@/types';
import BlogPreview from './previews/BlogPreview';
import XiaohongshuPreview from './previews/XiaohongshuPreview';
import WechatPreview from './previews/WechatPreview';
import XPreview from './previews/XPreview';
import JikePreview from './previews/JikePreview';

interface PlatformPreviewProps {
  title: string;
  content: string;
  tags: string[];
}

const platformIcons: Record<Platform, React.ElementType> = {
  blog: BookOpen,
  xiaohongshu: MessageSquare,
  wechat: FileText,
  x: Twitter,
  jike: Zap,
};

export default function PlatformPreview({ title, content, tags }: PlatformPreviewProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>('blog');

  const renderPreview = () => {
    switch (activePlatform) {
      case 'blog':
        return <BlogPreview title={title} content={content} tags={tags} />;
      case 'xiaohongshu':
        return <XiaohongshuPreview title={title} content={content} />;
      case 'wechat':
        return <WechatPreview title={title} content={content} />;
      case 'x':
        return <XPreview title={title} content={content} />;
      case 'jike':
        return <JikePreview title={title} content={content} />;
      default:
        return <BlogPreview title={title} content={content} tags={tags} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Platform Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-[var(--border)] bg-[var(--surface)]">
        {platforms.map((platform) => {
          const Icon = platformIcons[platform.id];
          return (
            <button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                activePlatform === platform.id
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <Icon size={14} />
              {platform.name}
            </button>
          );
        })}
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-[var(--background)]">
        {renderPreview()}
      </div>

      {/* Platform Info */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-muted)]">
        <div className="flex items-center justify-between">
          <span>
            {platforms.find(p => p.id === activePlatform)?.name} 预览
          </span>
          <span>
            {content.length} 字符
          </span>
        </div>
      </div>
    </div>
  );
}
