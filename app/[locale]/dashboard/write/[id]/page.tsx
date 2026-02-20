'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, 
  Send, 
  Loader2, 
  Check,
  ArrowLeft,
} from 'lucide-react';
import type { Post } from '@/types';
import Editor from '@/components/dashboard/Editor';
import PlatformPreview from '@/components/dashboard/PlatformPreview';
import PublishModal from '@/components/dashboard/PublishModal';

export default function EditPostPage() {
  const router = useRouter();
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'zh';
  const postId = routeParams?.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error('Post not found');
      
      const post: Post = await response.json();
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.join(', '));
    } catch (error) {
      console.error('Failed to fetch post:', error);
      alert('文章加载失败');
      router.push(`/${locale}/dashboard/posts`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存失败，请重试');
      setSaveStatus('idle');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/${locale}/dashboard/posts`)}
            className="p-2 hover:bg-[var(--surface-hover)] rounded-lg text-[var(--text-secondary)]"
          >
            <ArrowLeft size={20} />
          </button>
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
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
          >
            <Save size={16} />
            保存
          </button>
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Send size={16} />
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

      {showPublishModal && (
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
