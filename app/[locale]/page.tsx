import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DataErrorDisplay } from "@/components/DataErrorDisplay";
import { buildApiUrl } from "@/lib/url-helper";
import type { Post } from "@/types";

export const dynamic = "force-dynamic";

// Mock collection data
const collections = [
  {
    id: "1",
    title: "Next.js 系列教程",
    titleEn: "Next.js Tutorial Series",
    count: 5,
  },
  {
    id: "2",
    title: "React 进阶指南",
    titleEn: "Advanced React Guide",
    count: 8,
  },
  {
    id: "3",
    title: "TypeScript 实战",
    titleEn: "TypeScript in Practice",
    count: 6,
  },
];

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const isEn = locale === "en";

  let posts: Post[] = [];
  let tags: string[] = [];
  let pagination = { page: 1, per_page: 10, total: 0, total_pages: 0 };

  // Parse search params
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams?.page;
  const tagParam = resolvedSearchParams?.tag;
  const searchParam = resolvedSearchParams?.search;

  const page = parseInt(
    Array.isArray(pageParam) ? (pageParam[0] ?? "1") : (pageParam ?? "1"),
    10,
  );
  const tag = Array.isArray(tagParam) ? tagParam[0] : (tagParam ?? undefined);
  const search = Array.isArray(searchParam)
    ? searchParam[0]
    : (searchParam ?? undefined);

  try {
    const postsUrl = new URL(buildApiUrl("/api/posts"));
    postsUrl.searchParams.set("page", page.toString());
    postsUrl.searchParams.set("per_page", "10");
    if (tag) postsUrl.searchParams.set("tag", tag);
    if (search) postsUrl.searchParams.set("search", search);

    const tagsUrl = new URL(buildApiUrl("/api/tags"));

    const [postsResponse, tagsResponse] = await Promise.all([
      fetch(postsUrl.toString()),
      fetch(tagsUrl.toString()),
    ]);

    if (!postsResponse.ok || !tagsResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const postsResponseData = await postsResponse.json();
    const tagsResponseData = await tagsResponse.json();

    posts = postsResponseData.data?.posts || [];
    tags = tagsResponseData.data || [];
    pagination = postsResponseData.data?.pagination || {
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
    };

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="border-b border-[var(--border)]">
          <div className="container py-12 md:py-16">
            <div className="max-w-2xl">
              <h1 className="text-[var(--font-size-hero)] font-semibold text-[var(--text-primary)] leading-tight mb-4">
                leelicspace
              </h1>
              <p className="text-[var(--font-size-body)] text-[var(--text-secondary)] leading-relaxed">
                {isEn
                  ? "Recording Technology, Design & Thoughts"
                  : "记录技术、设计与思考"}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content - Two Column Layout */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Sidebar */}
              <aside className="lg:col-span-3 order-2 lg:order-1">
                <div className="lg:sticky lg:top-24 space-y-8">
                  {/* Tags */}
                  <div>
                    <h2 className="text-[var(--font-size-small)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                      {isEn ? "Tags" : "标签"}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={
                          search ? `/${locale}?search=${search}` : `/${locale}`
                        }
                        className={`tag ${!tag ? "active" : ""}`}
                      >
                        {t("tags.all")}
                      </Link>
                      {tags.map((t: string) => (
                        <Link
                          key={t}
                          href={`/${locale}?tag=${t}${search ? `&search=${search}` : ""}`}
                          className={`tag ${tag === t ? "active" : ""}`}
                        >
                          {t}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Collections */}
                  <div>
                    <h2 className="text-[var(--font-size-small)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                      {isEn ? "Collections" : "专辑"}
                    </h2>
                    <nav className="space-y-1">
                      {collections.map((collection) => (
                        <Link
                          key={collection.id}
                          href={`/${locale}/collection/${collection.id}`}
                          className="group flex items-center justify-between py-2 text-[var(--font-size-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          <span className="truncate">
                            {isEn ? collection.titleEn : collection.title}
                          </span>
                          <span className="text-[var(--font-size-small)] text-[var(--text-muted)] ml-2">
                            {collection.count}
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Popular Posts */}
                  {posts.length > 0 && (
                    <div>
                      <h2 className="text-[var(--font-size-small)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                        {isEn ? "Popular" : "热门"}
                      </h2>
                      <nav className="space-y-2">
                        {posts.slice(0, 5).map((post: Post) => (
                          <Link
                            key={post.id}
                            href={`/${locale}/posts/${post.id}`}
                            className="block text-[var(--font-size-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors line-clamp-2"
                          >
                            {post.title}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              </aside>

              {/* Main Content - Articles */}
              <div className="lg:col-span-9 order-1 lg:order-2">
                {/* Filter Indicator */}
                {(tag || search) && (
                  <div className="mb-8 p-4 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg">
                    <h2 className="text-[var(--font-size-h3)] font-semibold text-[var(--text-primary)]">
                      {search
                        ? `${t("tags.searchResults")}: "${search}"`
                        : `${t("tags.tag")}: ${tag}`}
                    </h2>
                    <p className="text-[var(--font-size-body)] text-[var(--text-tertiary)] mt-1">
                      {t("tags.articlesCount", { count: pagination.total })}
                    </p>
                  </div>
                )}

                {posts.length > 0 ? (
                  <>
                    <div className="space-y-8">
                      {posts.map((post: Post, index: number) => (
                        <ArticleCard
                          key={post.id}
                          post={post}
                          locale={locale}
                          t={t}
                          isEn={isEn}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.total_pages > 1 && (
                      <div className="mt-12 flex items-center justify-center gap-2">
                        <Link
                          href={`/${locale}?${new URLSearchParams({
                            page: (page - 1).toString(),
                            ...(tag ? { tag } : {}),
                            ...(search ? { search } : {}),
                          })}`}
                          className={`btn btn-secondary btn-md ${page === 1 ? "opacity-50 pointer-events-none" : ""}`}
                        >
                          {t("pagination.previous")}
                        </Link>

                        <span className="px-4 py-2 text-[var(--font-size-body)] text-[var(--text-secondary)] bg-[var(--bg-subtle)] rounded-md">
                          {page} / {pagination.total_pages}
                        </span>

                        <Link
                          href={`/${locale}?${new URLSearchParams({
                            page: (page + 1).toString(),
                            ...(tag ? { tag } : {}),
                            ...(search ? { search } : {}),
                          })}`}
                          className={`btn btn-secondary btn-md ${page === pagination.total_pages ? "opacity-50 pointer-events-none" : ""}`}
                        >
                          {t("pagination.next")}
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyState search={search} tag={tag} t={t} locale={locale} />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="container py-20">
        <DataErrorDisplay
          error={
            error instanceof Error ? error.message : t("article.loadError")
          }
        />
      </div>
    );
  }
}

// Article Card Component
function ArticleCard({
  post,
  locale,
  t,
  isEn,
  index,
}: {
  post: Post;
  locale: string;
  t: Awaited<ReturnType<typeof getTranslations>>;
  isEn: boolean;
  index: number;
}) {
  return (
    <article
      className="group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link
        href={`/${locale}/posts/${post.id}`}
        className="block py-6 border-b border-[var(--border)] last:border-b-0 transition-colors"
      >
        {/* Title */}
        <h3 className="text-[var(--font-size-h2)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-3">
          {post.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <time
            dateTime={post.created_at}
            className="text-[var(--font-size-small)] text-[var(--text-muted)]"
          >
            {formatDate(post.created_at, isEn)}
          </time>

          {post.tags.length > 0 && (
            <>
              <span className="text-[var(--border-strong)]">·</span>
              <span className="text-[var(--font-size-small)] text-[var(--text-tertiary)]">
                {post.tags.slice(0, 3).join(", ")}
              </span>
            </>
          )}
        </div>

        {/* Excerpt - Max 3 lines */}
        <p className="text-[var(--font-size-body)] text-[var(--text-secondary)] leading-relaxed line-clamp-3">
          {post.content.slice(0, 200).replace(/[#*`[\]]/g, "")}
        </p>

        {/* Read More */}
        <div className="mt-4 flex items-center text-[var(--font-size-body)] text-[var(--accent)]">
          <span className="font-medium">{t("article.readMore")}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1 transform group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          >
            <title>Read more arrow</title>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </Link>
    </article>
  );
}

// Empty State Component
function EmptyState({
  search,
  tag,
  t,
  locale,
}: {
  search?: string;
  tag?: string;
  t: Awaited<ReturnType<typeof getTranslations>>;
  locale: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--text-muted)]"
          aria-hidden="true"
        >
          <title>No articles icon</title>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <p className="text-[var(--font-size-body)] text-[var(--text-tertiary)]">
        {search ? t("empty.noSearchResults") : t("empty.noArticles")}
      </p>
      {(tag || search) && (
        <Link href={`/${locale}`} className="btn btn-primary btn-md mt-6">
          {t("empty.viewAll")}
        </Link>
      )}
    </div>
  );
}

// Date formatting helper
function formatDate(dateString: string, isEn: boolean): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return isEn ? "Yesterday" : "昨天";
  if (diffDays < 7) return `${diffDays} ${isEn ? "days ago" : "天前"}`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} ${isEn ? "weeks ago" : "周前"}`;

  return date.toLocaleDateString(isEn ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
