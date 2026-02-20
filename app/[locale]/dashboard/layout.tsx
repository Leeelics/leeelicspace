'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  PenLine,
  FileText,
  Settings,
  LogOut,
  Globe,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: '总览' },
  { href: '/dashboard/write', icon: PenLine, label: '写作' },
  { href: '/dashboard/posts', icon: FileText, label: '文章管理' },
  { href: '/dashboard/channels', icon: Globe, label: '渠道配置' },
  { href: '/dashboard/settings', icon: Settings, label: '设置' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'zh';

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push(`/${locale}/dashboard/login`);
    }
  }, [router, locale]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push(`/${locale}/dashboard/login`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] fixed h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-gradient">lee</span>
              <span className="text-[var(--text-primary)]">lic</span>
              <span className="text-[var(--text-muted)]">space</span>
            </span>
          </Link>
          <p className="text-xs text-[var(--text-muted)] mt-1">内容管理中台</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={`/${locale}${item.href}`}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
          >
            <LogOut size={18} />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  // Use typeof window to check current path
  const isActive = typeof window !== 'undefined' && window.location.pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
        isActive
          ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}
