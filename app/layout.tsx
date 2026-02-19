import type { Metadata } from "next";
import Link from "next/link";
import ThemeProvider from "./ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lee's Blog",
  description: "Sharing thoughts on technology, design, and life.",
  keywords: ["blog", "technology", "design", "programming", "life"],
  authors: [{ name: "Lee" }],
  openGraph: {
    title: "Lee's Blog",
    description: "Sharing thoughts on technology, design, and life.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <html lang="zh-CN" suppressHydrationWarning>
        <body className="antialiased min-h-screen flex flex-col bg-[var(--background)]">
          {/* Navigation */}
          <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
            <div className="container">
              <nav className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient flex items-center justify-center text-white font-bold text-lg">
                    L
                  </div>
                  <span className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Lee&apos;s Blog
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                  <Link 
                    href="/" 
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    首页
                  </Link>
                  <Link 
                    href="/projects" 
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    项目
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    关于
                  </Link>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <form action="/" method="GET" className="hidden sm:block">
                    <div className="relative">
                      <input
                        type="text"
                        name="search"
                        placeholder="搜索文章..."
                        className="input input-search w-48 lg:w-64 text-sm"
                      />
                    </div>
                  </form>

                  {/* Theme Toggle */}
                  <ThemeToggle />

                  {/* Admin Link */}
                  <Link
                    href="/dashboard"
                    className="btn btn-ghost btn-sm hidden sm:inline-flex"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="管理后台">
                      <title>管理后台</title>
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="ml-2">管理</span>
                  </Link>

                  {/* Mobile Menu Button */}
                  <button 
                    type="button"
                    className="btn btn-ghost btn-sm md:hidden"
                    aria-label="菜单"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="菜单">
                      <title>菜单</title>
                      <line x1="3" y1="12" x2="21" y2="12"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                  </button>
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-[var(--border)] mt-auto">
            <div className="container py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Copyright */}
                <div className="text-sm text-[var(--text-tertiary)]">
                  © {new Date().getFullYear()} Lee&apos;s Blog. Built with Next.js & Tailwind CSS.
                </div>

                {/* Links */}
                <div className="flex items-center gap-4">
                  <a 
                    href="/api/rss" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="RSS 订阅">
                      <title>RSS 订阅</title>
                      <path d="M4 11a9 9 0 0 1 9 9"/>
                      <path d="M4 4a16 16 0 0 1 16 16"/>
                      <circle cx="5" cy="19" r="1"/>
                    </svg>
                    RSS
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="GitHub">
                      <title>GitHub</title>
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ThemeProvider>
  );
}
