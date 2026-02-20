'use client';

import React, { useState } from 'react';
import { X, Check, ExternalLink, BookOpen, MessageSquare, FileText, Twitter, Zap } from 'lucide-react';
import type { Platform } from '@/types';
import { platforms } from '@/types';

interface PublishModalProps {
  postId: string;
  title: string;
  content: string;
  onClose: () => void;
}

const platformIcons: Record<Platform, React.ElementType> = {
  blog: BookOpen,
  xiaohongshu: MessageSquare,
  wechat: FileText,
  x: Twitter,
  jike: Zap,
};

export default function PublishModal({ postId, title, content, onClose }: PublishModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['blog']);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<Platform[]>([]);

  const togglePlatform = (platform: Platform) => {
    if (published.includes(platform)) return;
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handlePublish = async () => {
    setPublishing(true);
    
    // Simulate publishing process
    for (const platform of selectedPlatforms) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPublished(prev => [...prev, platform]);
      
      // Update publish status in database
      try {
        await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publishStatus: {
              [platform]: {
                published: true,
                publishedAt: new Date().toISOString(),
              },
            },
          }),
        });
      } catch (error) {
        console.error(`Failed to update ${platform} status:`, error);
      }
    }
    
    setPublishing(false);
  };

  const allPublished = selectedPlatforms.every(p => published.includes(p));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              发布到各平台
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Platform Selection */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">
            选择发布平台
          </h3>
          <div className="space-y-2">
            {platforms.map((platform) => {
              const Icon = platformIcons[platform.id];
              const isSelected = selectedPlatforms.includes(platform.id);
              const isPublished = published.includes(platform.id);

              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  disabled={isPublished || publishing}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    isPublished
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : isSelected
                      ? 'bg-[var(--accent)]/5 border-[var(--accent)]'
                      : 'bg-[var(--background)] border-[var(--border)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-[var(--text-primary)]">
                      {platform.name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {isPublished
                        ? '已发布'
                        : platform.maxLength
                        ? `最多 ${platform.maxLength} 字符`
                        : '无字数限制'}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2">
                    {isPublished ? (
                      <Check size={14} className="text-green-600" />
                    ) : isSelected ? (
                      <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-[var(--border)]">
          {allPublished ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-green-600 mb-4">
                <Check size={20} />
                <span className="font-medium">发布完成！</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
              >
                关闭
              </button>
            </div>
          ) : (
            <button
              onClick={handlePublish}
              disabled={selectedPlatforms.length === 0 || publishing}
              className="w-full py-2.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  发布中... ({published.length}/{selectedPlatforms.length})
                </span>
              ) : (
                `发布到 ${selectedPlatforms.length} 个平台`
              )}
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="px-6 pb-6">
          <div className="text-xs text-[var(--text-muted)] bg-[var(--background)] rounded-lg p-4">
            <p className="font-medium mb-1">提示：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>博客会自动发布并展示在首页</li>
              <li>其他平台需要手动复制内容并上传图片</li>
              <li>可以在文章管理中随时更新发布状态</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
