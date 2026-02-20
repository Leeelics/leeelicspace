import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/request';
import ThemeProvider from "../ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import "../globals.css";

// Chinese fonts configuration
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "leelicspace",
  description: "Lee's Digital Space - 记录技术、设计与思考",
  keywords: ["blog", "technology", "design", "programming", "life", "leelicspace"],
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
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 验证语言是否支持
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations();

  return (
    <ThemeProvider>
      <html lang={locale} suppressHydrationWarning className={`${notoSansSC.variable} ${notoSerifSC.variable}`}>
        <body className="antialiased min-h-screen flex flex-col bg-[var(--background)]">
          <NextIntlClientProvider messages={messages} locale={locale}>
            {/* Navigation */}
            <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
              <div className="container">
                <nav className="flex items-center justify-between h-16">
                  {/* Logo - leelicspace */}
                  <Link href={`/${locale}`} className="flex items-center gap-1 group">
                    <span className="text-xl font-bold tracking-tight">
                      <span className="text-gradient group-hover:opacity-80 transition-opacity">lee</span>
                      <span className="text-[var(--text-primary)]">lic</span>
                      <span className="text-[var(--text-muted)]">space</span>
                    </span>
                  </Link>

                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center gap-6">
                    <Link 
                      href={`/${locale}`} 
                      className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {t('nav.home')}
                    </Link>
                    <Link 
                      href={`/${locale}/about`} 
                      className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {t('nav.about')}
                    </Link>
                    <Link 
                      href={`/${locale}/tools/media-card`} 
                      className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      工具
                    </Link>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <form action={`/${locale}`} method="GET" className="hidden sm:block">
                      <div className="relative">
                        <input
                          type="text"
                          name="search"
                          placeholder={t('nav.searchPlaceholder')}
                          className="input input-search w-48 lg:w-64 text-sm"
                        />
                      </div>
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
                      aria-label={t('nav.rss')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <title>{t('nav.rss')}</title>
                        <path d="M4 11a9 9 0 0 1 9 9"/>
                        <path d="M4 4a16 16 0 0 1 16 16"/>
                        <circle cx="5" cy="19" r="1"/>
                      </svg>
                    </a>
                  </div>
                </nav>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow animate-fade-in">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--border)] mt-auto">
              <div className="container py-12 md:py-16">
                <div className="flex flex-col items-center text-center gap-4">
                  {/* Brand */}
                  <div className="text-2xl font-bold tracking-tight">
                    <span className="text-gradient">lee</span>
                    <span className="text-[var(--text-primary)]">lic</span>
                    <span className="text-[var(--text-muted)]">space</span>
                  </div>
                  
                  {/* Tagline */}
                  <p className="text-sm text-[var(--text-secondary)]">
                    {t('metadata.description')}
                  </p>
                  
                  {/* Copyright */}
                  <div className="text-sm text-[var(--text-tertiary)] pt-4 border-t border-[var(--border)] w-full max-w-md">
                    © {new Date().getFullYear()} leelicspace. {t('footer.builtWith') || 'Built with'} Next.js & Tailwind CSS.
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
