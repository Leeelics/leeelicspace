"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Dynamically import the MediaCardCreator to avoid SSR issues with html2canvas
const MediaCardCreator = dynamic(
  () => import("@/components/tools/MediaCardCreator"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary">加载中...</div>
      </div>
    ),
  },
);

export default function MediaCardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={24} />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  图文排版助手
                </h1>
                <p className="text-xs text-muted-foreground">
                  来自 leelicspace
                </p>
              </div>
            </div>
          </div>
          <Link href="/dashboard/write">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
            >
              去写作中台 →
            </Button>
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
