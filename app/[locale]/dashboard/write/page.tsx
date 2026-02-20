'use client';

import React, { useState, useEffect } from 'react';
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

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const handleAutoSave = async () => {
    if (!title.trim() || saveStatus === 'saving') return;
    
    setSaveStatus('saving');
    try {
      const postData = {
        title: title.trim() || '未命名草稿',
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        publishStatus: defaultPublishStatus,
        channelConfig: defaultChannelConfig,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
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
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title: title.trim(),
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        publishStatus: defaultPublishStatus,
        channelConfig: defaultChannelConfig,
      };

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
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setTags(e.target.value)}
              placeholder="标签，用逗号分隔..."
              className="w-full text-sm bg-transparent border-none outline-none text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 flex flex-col bg-[var(--background)]">
          <PlatformPreview
            title={title}
            content={content}
            tags={tags.split(',').map(t => t.trim()).filter(Boolean)}
          />
        </div>
      </div>

      {showPublishModal && postId && (
        <PublishModal
          postId={postId}
          title={title}
          content={content}
          onClose={() => setShowPublishModal(false)}
        />
      )}
    </div>
  );
}
