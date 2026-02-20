'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Share2,
  Clock,
  TrendingUp,
  PenLine,
  ExternalLink,
  BookOpen,
  MessageSquare,
  Twitter,
} from 'lucide-react';
import type { Post, Platform } from '@/types';
import { platforms } from '@/types';

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  platformStats: Record<Platform, number>;
  recentPosts: Post[];
}

export default function DashboardOverview() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'zh';
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    platformStats: {
      blog: 0,
      xiaohongshu: 0,
      wechat: 0,
      jike: 0,
      x: 0,
    },
    recentPosts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      const posts: Post[] = data.posts || [];

      // Calculate stats
      const platformStats = {
        blog: 0,
        xiaohongshu: 0,
        wechat: 0,
        jike: 0,
        x: 0,
      };

      let publishedPosts = 0;

      posts.forEach((post) => {
        let isPublished = false;
        (Object.keys(post.publishStatus) as Platform[]).forEach((platform) => {
          if (post.publishStatus[platform].published) {
            platformStats[platform]++;
            isPublished = true;
          }
        });
        if (isPublished) publishedPosts++;
      });

      setStats({
        totalPosts: posts.length,
        publishedPosts,
        platformStats,
        recentPosts: posts.slice(0, 5),
      });
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--surface)] rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-[var(--surface)] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          内容管理中台
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          一次写作，多平台发布
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link
          href={`/${locale}/dashboard/write`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors font-medium"
        >
          <PenLine size={20} />
          开始写作
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FileText}
          label="总文章数"
          value={stats.totalPosts}
          color="blue"
        />
        <StatCard
          icon={Share2}
          label="已发布文章"
          value={stats.publishedPosts}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="待发布文章"
          value={stats.totalPosts - stats.publishedPosts}
          color="orange"
        />
        <StatCard
          icon={TrendingUp}
          label="发布率"
          value={`${stats.totalPosts > 0 ? Math.round((stats.publishedPosts / stats.totalPosts) * 100) : 0}%`}
          color="purple"
        />
      </div>

      {/* Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            平台分布
          </h2>
          <div className="space-y-3">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-[var(--text-secondary)]">{platform.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[var(--text-primary)] font-medium">
                    {stats.platformStats[platform.id]}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    篇
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              最近文章
            </h2>
            <Link
              href={`/${locale}/dashboard/posts`}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              查看全部
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentPosts.length === 0 ? (
              <p className="text-[var(--text-muted)] text-center py-4">
                还没有文章，开始写作吧！
              </p>
            ) : (
              stats.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${locale}/dashboard/write/${post.id}`}
                      className="text-[var(--text-primary)] hover:text-[var(--accent)] truncate block"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {new Date(post.updated_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {getPublishedPlatforms(post).map((platform) => (
                      <div
                        key={platform.id}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: platform.color }}
                        title={platform.name}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Platform Links */}
      <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          快速访问
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PlatformLink
            name="博客首页"
            icon={BookOpen}
            href={`/${locale}`}
            color="#3b82f6"
          />
          <PlatformLink
            name="小红书"
            icon={MessageSquare}
            href="https://www.xiaohongshu.com"
            color="#ff2442"
            external
          />
          <PlatformLink
            name="公众号"
            icon={FileText}
            href="https://mp.weixin.qq.com"
            color="#07c160"
            external
          />
          <PlatformLink
            name="X / Twitter"
            icon={Twitter}
            href="https://x.com"
            color="#000000"
            external
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-green-500/10 text-green-600',
    orange: 'bg-orange-500/10 text-orange-600',
    purple: 'bg-purple-500/10 text-purple-600',
  };

  return (
    <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm text-[var(--text-muted)]">{label}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
      </div>
    </div>
  );
}

function PlatformLink({
  name,
  icon: Icon,
  href,
  color,
  external = false,
}: {
  name: string;
  icon: React.ElementType;
  href: string;
  color: string;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors group">
      <div
        className="p-2 rounded-lg text-white"
        style={{ backgroundColor: color }}
      >
        <Icon size={18} />
      </div>
      <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
        {name}
      </span>
      {external && (
        <ExternalLink size={14} className="text-[var(--text-muted)] ml-auto" />
      )}
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}

function getPublishedPlatforms(post: Post) {
  return platforms.filter((p) => post.publishStatus[p.id]?.published);
}
