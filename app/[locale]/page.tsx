import { Post } from "@/types";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buildApiUrl } from "@/lib/url-helper";
import { DataErrorDisplay } from "@/components/DataErrorDisplay";

export const dynamic = "force-dynamic";

// 模拟专辑数据（后续可以从数据库获取）
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
      throw new Error(`Failed to fetch data`);
    }

    const postsResponseData = await postsResponse.json();
    tags = await tagsResponse.json();

    posts = postsResponseData.posts || [];
    pagination = postsResponseData.pagination || {
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
    };

    return (
      <div className="min-h-screen">
        {/* Hero Section - leelicspace Brand */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)]">
          <div className="container relative z-10 py-24 md:py-36">
            <div className="flex items-center justify-center gap-6 md:gap-10">
              {/* 左侧副标题 */}
              <div className="hidden sm:flex flex-col items-end gap-3">
                <span className="text-lg md:text-xl font-bold text-[var(--text-muted)] opacity-25 tracking-widest">
                  思考
                </span>
                <span className="text-base md:text-lg font-bold text-[var(--text-muted)] opacity-15 tracking-widest">
                  探索
                </span>
              </div>

              {/* Logo */}
              <div>
                <span className="text-5xl md:text-6xl font-bold tracking-tight">
                  <span className="text-gradient">lee</span>
                  <span className="text-[var(--text-primary)]">lic</span>
                  <span className="text-[var(--text-muted)]">space</span>
                </span>
              </div>

              {/* 右侧副标题 */}
              <div className="hidden sm:flex flex-col items-start gap-3">
                <span className="text-base md:text-lg font-bold text-[var(--text-muted)] opacity-15 tracking-widest">
                  记录
                </span>
                <span className="text-lg md:text-xl font-bold text-[var(--text-muted)] opacity-25 tracking-widest">
                  分享
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent"></div>
        </div>

        {/* Main Content - Two Column Layout */}
        <section className="pt-16 pb-28 md:pt-24 md:pb-36">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left Sidebar - Categories & Collections */}
              <aside className="lg:col-span-3 order-2 lg:order-1">
                <div className="lg:sticky lg:top-28 space-y-10">
                  {/* Browse by Category */}
                  <div>
                    <h2 className="text-xs font-bold tracking-wider text-[var(--accent)] uppercase mb-4">
                      {isEn ? "Browse by Category" : "按类别浏览"}
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

                  {/* Collections / Series */}
                  <div>
                    <h2 className="text-xs font-bold tracking-wider text-[var(--accent)] uppercase mb-4">
                      {isEn ? "Collections" : "专辑"}
                    </h2>
                    <nav className="space-y-1">
                      {collections.map((collection) => (
                        <Link
                          key={collection.id}
                          href={`/${locale}/collection/${collection.id}`}
                          className="group flex items-center justify-between py-2 px-3 -mx-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                        >
                          <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                            {isEn ? collection.titleEn : collection.title}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full">
                            {collection.count}
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Popular Content Placeholder */}
                  <div>
                    <h2 className="text-xs font-bold tracking-wider text-[var(--accent)] uppercase mb-4">
                      {isEn ? "Popular" : "热门内容"}
                    </h2>
                    <nav className="space-y-2">
                      {posts.slice(0, 5).map((post: Post) => (
                        <Link
                          key={post.id}
                          href={`/${locale}/posts/${post.id}`}
                          className="group block py-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors line-clamp-2"
                        >
                          <span className="inline-block mr-2 text-[var(--accent)]">
                            →
                          </span>
                          {post.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>

              {/* Main Content - Articles List */}
              <div className="lg:col-span-9 order-1 lg:order-2">
                {(tag || search) && (
                  <div className="mb-8 p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {search
                        ? `${t("tags.searchResults")}: "${search}"`
                        : `${t("tags.tag")}: ${tag}`}
                    </h3>
                    <p className="text-[var(--text-tertiary)] mt-1 text-sm">
                      {t("tags.articlesCount", { count: pagination.total })}
                    </p>
                  </div>
                )}

                {posts.length > 0 ? (
                  <>
                    <div className="space-y-20 mt-8">
                      {posts.map((post: Post) => (
                        <ArticleCard
                          key={post.id}
                          post={post}
                          locale={locale}
                          t={t}
                          isEn={isEn}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.total_pages > 1 && (
                      <div className="mt-12 flex items-center justify-center gap-3">
                        <Link
                          href={`/${locale}?${new URLSearchParams({
                            page: (page - 1).toString(),
                            ...(tag ? { tag } : {}),
                            ...(search ? { search } : {}),
                          })}`}
                          className={`btn btn-secondary ${page === 1 ? "opacity-50 pointer-events-none" : ""}`}
                        >
                          {t("pagination.previous")}
                        </Link>

                        <span className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--surface)] rounded-lg">
                          {page} / {pagination.total_pages}
                        </span>

                        <Link
                          href={`/${locale}?${new URLSearchParams({
                            page: (page + 1).toString(),
                            ...(tag ? { tag } : {}),
                            ...(search ? { search } : {}),
                          })}`}
                          className={`btn btn-secondary ${page === pagination.total_pages ? "opacity-50 pointer-events-none" : ""}`}
                        >
                          {t("pagination.next")}
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface)] flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[var(--text-muted)]"
                        aria-label={t("empty.noArticles")}
                      >
                        <title>{t("empty.noArticles")}</title>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <p className="text-[var(--text-tertiary)]">
                      {search
                        ? t("empty.noSearchResults")
                        : t("empty.noArticles")}
                    </p>
                    {(tag || search) && (
                      <Link
                        href={`/${locale}`}
                        className="btn btn-primary mt-4"
                      >
                        {t("empty.viewAll")}
                      </Link>
                    )}
                  </div>
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

// Article Card Component - Josh W. Comeau Style
function ArticleCard({
  post,
  locale,
  t,
  isEn,
}: {
  post: Post;
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Awaited<ReturnType<typeof getTranslations>>;
  isEn: boolean;
}) {
  return (
    <article className="group animate-fade-in-up">
      <Link
        href={`/${locale}/posts/${post.id}`}
        className="block py-10 border-b border-[var(--border)] last:border-b-0 hover-lift"
      >
        {/* Title row with date and tags */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-4">
          <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-tight">
            {post.title}
          </h3>

          <span className="text-sm text-[var(--text-muted)]">
            {formatDate(post.created_at, locale)}
          </span>

          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Summary with Read More inline */}
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {post.content.slice(0, 160).replace(/[#*`]/g, "")}
          <span className="text-[var(--text-muted)]">...</span>
          <span className="text-sm font-medium text-[var(--accent)] group-hover:underline ml-2">
            {t("article.readMore")}
          </span>
        </p>
      </Link>
    </article>
  );
}

// Date formatting helper
function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isEn = locale === "en";

  if (diffDays === 1) return isEn ? "Yesterday" : "昨天";
  if (diffDays < 7) return `${diffDays} ${isEn ? "days ago" : "天前"}`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} ${isEn ? "weeks ago" : "周前"}`;

  return date.toLocaleDateString(isEn ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
