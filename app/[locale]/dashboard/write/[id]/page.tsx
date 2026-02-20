'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
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

  // 使用 useMemo 缓存解析后的标签数组
  const parsedTags = useMemo(() => parseTags(tags), [tags]);

  // 使用 useCallback 稳定 fetchPost 函数
  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error('Post not found');
      
      const post: Post = await response.json();
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.join(', '));
    } catch {
      alert('文章加载失败');
      router.push(`/${locale}/dashboard/posts`);
    } finally {
      setLoading(false);
    }
  }, [postId, locale, router]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // 使用 useMemo 缓存 postData
  const postData = useMemo(() => ({
    title: title.trim(),
    content,
    tags: parsedTags,
  }), [title, content, parsedTags]);

  // 使用 useCallback 稳定保存函数
  const handleSave = useCallback(async () => {
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
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error('Update failed');
      }
    } catch {
      alert('保存失败，请重试');
      setSaveStatus('idle');
    } finally {
      setSaving(false);
    }
  }, [postData, postId, title]);

  // 使用 useCallback 稳定其他事件处理器
  const handleBack = useCallback(() => {
    router.push(`/${locale}/dashboard/posts`);
  }, [router, locale]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  }, []);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const handleShowPublishModal = useCallback(() => {
    setShowPublishModal(true);
  }, []);

  const handleClosePublishModal = useCallback(() => {
    setShowPublishModal(false);
  }, []);

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
            onClick={handleBack}
            className="p-2 hover:bg-[var(--surface-hover)] rounded-lg text-[var(--text-secondary)] focus-ring"
          >
            <ArrowLeft size={20} />
          </button>
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
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors focus-ring"
          >
            <Save size={16} />
            保存
          </button>
          <button
            onClick={handleShowPublishModal}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors focus-ring"
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

      {showPublishModal && (
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
