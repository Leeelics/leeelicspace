"use client";

import { Check, Edit, ExternalLink, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/swr-config";
import type { Post } from "@/types";
import { platforms } from "@/types";

export default function PostsManagement() {
  // Router available for future navigation features
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || "zh";

  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // 使用 SWR 获取文章列表，自动缓存和去重
  const { data: postsData, isLoading } = useSWR<{ posts: Post[] }>(
    "/api/posts",
    fetcher,
    {
      // 5分钟后重新验证
      refreshInterval: 5 * 60 * 1000,
      // 窗口聚焦时重新验证
      revalidateOnFocus: true,
      // 错误时重试
      shouldRetryOnError: true,
      errorRetryCount: 3,
    },
  );

  const posts = postsData?.posts || [];

  // 使用 useCallback 稳定删除函数引用
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 乐观更新：立即更新本地缓存
        mutate(
          "/api/posts",
          (currentData: { posts: Post[] } | undefined) => ({
            posts: currentData?.posts.filter((p) => p.id !== id) || [],
          }),
          false, // 不立即重新验证
        );
      } else {
        throw new Error("Delete failed");
      }
    } catch {
      alert("删除失败，请重试");
    } finally {
      setDeleting(null);
    }
  }, []);

  // 使用 useMemo 缓存筛选结果
  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      // 搜索筛选
      if (
        searchQuery &&
        !post.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 状态筛选
      if (filter === "published") {
        return Object.values(post.publishStatus).some((s) => s.published);
      }
      if (filter === "draft") {
        return !Object.values(post.publishStatus).some((s) => s.published);
      }
      return true;
    });
  }, [posts, searchQuery, filter]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--surface)] rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[var(--surface)] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            文章管理
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            管理所有文章和发布状态
          </p>
        </div>
        <Link
          href={`/${locale}/dashboard/write`}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors focus-ring"
        >
          写新文章
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-[var(--surface)] rounded-lg p-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors focus-ring ${
                filter === f
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {f === "all" && "全部"}
              {f === "published" && "已发布"}
              {f === "draft" && "草稿"}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文章..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--background)] border-b border-[var(--border)]">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                文章
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                发布状态
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                更新于
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredPosts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-[var(--text-muted)]"
                >
                  没有找到文章
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--background)]/50">
                  <td className="px-6 py-4">
                    <div>
                      <Link
                        href={`/${locale}/posts/${post.id}`}
                        className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)]"
                      >
                        {post.title}
                      </Link>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-[var(--background)] text-[var(--text-muted)] rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {platforms.map((platform) => {
                        const isPublished =
                          post.publishStatus[platform.id]?.published;
                        return (
                          <div
                            key={platform.id}
                            className={`w-6 h-6 rounded flex items-center justify-center ${
                              isPublished
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                            title={`${platform.name}: ${isPublished ? "已发布" : "未发布"}`}
                          >
                            {isPublished ? (
                              <Check size={12} />
                            ) : (
                              <X size={12} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                    {new Date(post.updated_at).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${locale}/dashboard/write/${post.id}`}
                        className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] focus-ring"
                        title="编辑"
                      >
                        <Edit size={16} />
                      </Link>
                      <Link
                        href={`/${locale}/posts/${post.id}`}
                        target="_blank"
                        className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] focus-ring"
                        title="查看"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="p-2 hover:bg-red-50 rounded-lg text-[var(--text-secondary)] hover:text-red-600 disabled:opacity-50 focus-ring"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="mt-6 text-sm text-[var(--text-muted)]">
        共 {filteredPosts.length} 篇文章
        {searchQuery && ` (搜索: "${searchQuery}")`}
      </div>
    </div>
  );
}
