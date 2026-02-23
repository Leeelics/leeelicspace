// Server Component

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ArticleOutline from "@/components/ArticleOutline";
import MarkdownRenderer from "@/components/MarkdownContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPost } from "@/services/api";

export default async function PostDetail({
  params,
}: {
  params: Promise<{ postId: string; locale: string }>;
}) {
  try {
    const { postId, locale } = await params;
    const post = await fetchPost(postId);
    const t = await getTranslations();

    if (!post) {
      throw new Error("Article not found");
    }

    const isEn = locale === "en";

    return (
      <div className="min-h-screen">
        {/* Article Header */}
        <section className="border-b border-border">
          <div className="container py-8 md:py-12">
            <div className="max-w-3xl">
              {/* Back Link */}
              <Link href={`/${locale}`}>
                <Button variant="ghost" size="sm" className="mb-6">
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
                    className="mr-2"
                    aria-hidden="true"
                  >
                    <title>Back arrow</title>
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  {t("article.backToHome") || "返回首页"}
                </Button>
              </Link>

              {/* Title */}
              <h1 className="text-4xl font-semibold text-foreground leading-tight mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-base text-muted-foreground mb-6">
                <time dateTime={post.created_at}>
                  {new Date(post.created_at).toLocaleDateString(
                    isEn ? "en-US" : "zh-CN",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </time>

                {post.updated_at !== post.created_at && (
                  <>
                    <span>·</span>
                    <span>
                      {t("article.updated") || "更新于"}{" "}
                      {new Date(post.updated_at).toLocaleDateString(
                        isEn ? "en-US" : "zh-CN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Link key={tag} href={`/${locale}?tag=${tag}`}>
                    <Badge variant="secondary" className="cursor-pointer">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Area - Two Column */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Main Content */}
              <article className="lg:col-span-8 prose max-w-none">
                <div className="text-foreground">
                  <MarkdownRenderer content={post.content} />
                </div>
              </article>

              {/* Sidebar - Outline */}
              <aside className="hidden lg:block lg:col-span-4">
                <div className="sticky top-24">
                  <ArticleOutline content={post.content} />
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Article Footer */}
        <footer className="border-t border-border py-8 md:py-12">
          <div className="container">
            <div className="max-w-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-base text-muted-foreground">
                {t("article.thanks") || "感谢阅读"}
              </p>

              <Link href={`/${locale}`}>
                <Button variant="outline">
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
                    className="mr-2"
                    aria-hidden="true"
                  >
                    <title>Article list</title>
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  {t("article.browseMore") || "浏览更多文章"}
                </Button>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen">
        <div className="container py-20 text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
              aria-hidden="true"
            >
              <title>Error icon</title>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            文章加载失败
          </h1>
          <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
            无法加载指定的文章，请检查文章ID是否正确，或稍后再试。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/">
              <Button>
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
                  className="mr-2"
                  aria-hidden="true"
                >
                  <title>Home icon</title>
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                返回首页
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.location.reload()}>
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
                className="mr-2"
                aria-hidden="true"
              >
                <title>Refresh icon</title>
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              重新加载
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
