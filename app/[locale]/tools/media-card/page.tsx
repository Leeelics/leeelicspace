'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

// Dynamically import the MediaCardCreator to avoid SSR issues with html2canvas
const MediaCardCreator = dynamic(
  () => import('@/components/tools/MediaCardCreator'),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-purple-600">加载中...</div>
    </div>
  )}
);

export default function MediaCardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-600" size={24} />
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  图文排版助手
                </h1>
                <p className="text-xs text-gray-500">来自 leelicspace</p>
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/write"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            去写作中台 →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-73px)]">
        <MediaCardCreator />
      </main>
    </div>
  );
}
