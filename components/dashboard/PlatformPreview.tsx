'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { BookOpen, MessageSquare, Twitter, FileText, Zap } from 'lucide-react';
import type { Platform } from '@/types';
import { platforms } from '@/types';
import dynamic from 'next/dynamic';

interface PlatformPreviewProps {
  title: string;
  content: string;
  tags: string[];
}

// 静态导入小图标（lucide-react 支持 tree-shaking）
const platformIcons: Record<Platform, React.ElementType> = {
  blog: BookOpen,
  xiaohongshu: MessageSquare,
  wechat: FileText,
  x: Twitter,
  jike: Zap,
};

// 动态导入预览组件，减少初始加载
const BlogPreview = dynamic(() => import('./previews/BlogPreview'), {
  loading: () => <PreviewLoading />,
});

const XiaohongshuPreview = dynamic(() => import('./previews/XiaohongshuPreview'), {
  loading: () => <PreviewLoading />,
});

const WechatPreview = dynamic(() => import('./previews/WechatPreview'), {
  loading: () => <PreviewLoading />,
});

const XPreview = dynamic(() => import('./previews/XPreview'), {
  loading: () => <PreviewLoading />,
});

const JikePreview = dynamic(() => import('./previews/JikePreview'), {
  loading: () => <PreviewLoading />,
});

// 加载占位组件
function PreviewLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-pulse text-[var(--text-muted)]">加载预览...</div>
    </div>
  );
}

export default function PlatformPreview({ title, content, tags }: PlatformPreviewProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>('blog');

  // 使用 useMemo 缓存渲染内容
  const previewContent = useMemo(() => {
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
  }, [activePlatform, title, content, tags]);

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
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors focus-ring ${
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

      {/* Preview Area - 使用动态组件 */}
      <div className="flex-1 overflow-auto bg-[var(--background)]">
        <Suspense fallback={<PreviewLoading />}>
          {previewContent}
        </Suspense>
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
