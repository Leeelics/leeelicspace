'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, 
  Send, 
  Loader2, 
  Check,
} from 'lucide-react';
import type { Post } from '@/types';
import { defaultChannelConfig, defaultPublishStatus } from '@/types';
import Editor from '@/components/dashboard/Editor';
import PlatformPreview from '@/components/dashboard/PlatformPreview';
import PublishModal from '@/components/dashboard/PublishModal';

// 模块级常量，避免每次渲染重新创建
const DEFAULT_PUBLISH_STATUS = { ...defaultPublishStatus };
const DEFAULT_CHANNEL_CONFIG = { ...defaultChannelConfig };

// 优化的标签解析函数 - 单次遍历
const parseTags = (tagsString: string): string[] => {
  const tags: string[] = [];
  const parts = tagsString.split(',');
  for (let i = 0; i < parts.length; i++) {
    const trimmed = parts[i].trim();
    if (trimmed) {
      tags.push(trimmed);
    }
  }
  return tags;
};

export default function WritePage() {
  const router = useRouter();
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'zh';

  // Editor state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  // 使用 useMemo 缓存解析后的标签数组
  const parsedTags = useMemo(() => parseTags(tags), [tags]);

  // 使用 useMemo 缓存 postData 对象，避免每次渲染重新创建
  const postData = useMemo(() => ({
    title: title.trim(),
    content,
    tags: parsedTags,
    publishStatus: DEFAULT_PUBLISH_STATUS,
    channelConfig: DEFAULT_CHANNEL_CONFIG,
  }), [title, content, parsedTags]);

  // 使用 useCallback 稳定事件处理器
  const handleAutoSave = useCallback(async () => {
    if (!title.trim() || saveStatus === 'saving') return;
    
    setSaveStatus('saving');
    try {
      const autoSaveData = {
        ...postData,
        title: title.trim() || '未命名草稿',
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoSaveData),
      });

      if (response.ok) {
        const data = await response.json();
        setPostId(data.id);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch {
      setSaveStatus('idle');
    }
  }, [postData, title, saveStatus]);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [title, content, handleAutoSave]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        setPostId(data.id);
        setSaveStatus('saved');
        setShowPublishModal(true);
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  }, [postData, title]);

  // 使用 useCallback 稳定 onChange 处理器
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  }, []);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const handleClosePublishModal = useCallback(() => {
    setShowPublishModal(false);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="输入文章标题..."
            className="text-xl font-semibold bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] w-96"
          />
          {saveStatus === 'saving' && (
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              保存中...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Check size={12} />
              已保存
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors focus-ring"
          >
            <Save size={16} />
            保存草稿
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 focus-ring"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            发布
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="w-1/2 border-r border-[var(--border)] flex flex-col">
          <div className="p-4 border-b border-[var(--border)]">
            <input
              type="text"
              value={tags}
              onChange={handleTagsChange}
              placeholder="标签，用逗号分隔..."
              className="w-full text-sm bg-transparent border-none outline-none text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor value={content} onChange={handleContentChange} />
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 flex flex-col bg-[var(--background)]">
          <PlatformPreview
            title={title}
            content={content}
            tags={parsedTags}
          />
        </div>
      </div>

      {showPublishModal && postId && (
        <PublishModal
          postId={postId}
          title={title}
          content={content}
          onClose={handleClosePublishModal}
        />
      )}
    </div>
  );
}
