import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { locales } from "@/i18n/request";
import ThemeProvider from "../ThemeProvider";
import "../globals.css";

// Chinese fonts configuration
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "leelicspace",
  description: "Lee's Digital Space - 记录技术、设计与思考",
  keywords: [
    "blog",
    "technology",
    "design",
    "programming",
    "life",
    "leelicspace",
  ],
  authors: [{ name: "Lee" }],
  openGraph: {
    title: "leelicspace",
    description: "Lee's Digital Space - 记录技术、设计与思考",
    type: "website",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations();

  return (
    <ThemeProvider>
      <html
        lang={locale}
        suppressHydrationWarning
        className={`${notoSansSC.variable} ${notoSerifSC.variable}`}
      >
        <body className="antialiased min-h-screen flex flex-col bg-[var(--bg-default)]">
          <NextIntlClientProvider messages={messages} locale={locale}>
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
              <div className="container">
                <nav className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <Link
                    href={`/${locale}`}
                    className="text-[var(--font-size-h3)] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                  >
                    leelicspace
                  </Link>

                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center gap-1">
                    <Link href={`/${locale}`} className="nav-link">
                      {t("nav.home")}
                    </Link>
                    <Link href={`/${locale}/about`} className="nav-link">
                      {t("nav.about")}
                    </Link>
                    <Link
                      href={`/${locale}/tools/media-card`}
                      className="nav-link"
                    >
                      工具
                    </Link>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-2">
                    {/* Search */}
                    <form
                      action={`/${locale}`}
                      method="GET"
                      className="hidden sm:block"
                    >
                      <input
                        type="text"
                        name="search"
                        placeholder={t("nav.searchPlaceholder")}
                        className="input input-search w-40 lg:w-48"
                      />
                    </form>

                    {/* Language Switcher */}
                    <LanguageSwitcher currentLocale={locale} />

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* RSS */}
                    <a
                      href="/api/rss"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      title={t("nav.rss")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M4 11a9 9 0 0 1 9 9" />
                        <path d="M4 4a16 16 0 0 1 16 16" />
                        <circle cx="5" cy="19" r="1" />
                      </svg>
                      <span className="sr-only">{t("nav.rss")}</span>
                    </a>
                  </div>
                </nav>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow animate-fade-in">{children}</main>

            {/* Footer */}
            <footer className="border-t border-[var(--border)] mt-auto">
              <div className="container py-8 md:py-12">
                <div className="flex flex-col items-center text-center gap-4">
                  {/* Brand */}
                  <div className="text-[var(--font-size-h2)] font-semibold text-[var(--text-primary)]">
                    leelicspace
                  </div>

                  {/* Tagline */}
                  <p className="text-[var(--font-size-body)] text-[var(--text-secondary)]">
                    {t("metadata.description")}
                  </p>

                  {/* Copyright */}
                  <div className="text-[var(--font-size-small)] text-[var(--text-muted)] pt-4 border-t border-[var(--border)] w-full max-w-md">
                    © {new Date().getFullYear()} leelicspace.{" "}
                    {t("footer.builtWith") || "Built with"} Next.js & Tailwind
                    CSS.
                  </div>
                </div>
              </div>
            </footer>
          </NextIntlClientProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
