"use client";

import { useEffect, useState } from "react";

interface DataErrorDisplayProps {
  error?: string;
  retryUrl?: string;
}

export function DataErrorDisplay({ error, retryUrl }: DataErrorDisplayProps) {
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(
    null,
  );

  useEffect(() => {
    // 收集调试信息
    const collectDebugInfo = async () => {
      try {
        const healthResponse = await fetch("/api/health");
        const healthData = healthResponse.ok
          ? await healthResponse.json()
          : null;

        setDebugInfo({
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          health: healthData,
          localStorage: {
            theme: localStorage.getItem("theme"),
          },
        });
      } catch {
        // Silently ignore debug info collection errors
      }
    };

    collectDebugInfo();
  }, []);

  const handleRetry = () => {
    if (retryUrl) {
      window.location.href = retryUrl;
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 text-center animate-fade-in-up">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 mb-6 shadow-lg">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-600 dark:text-red-400"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          数据加载失败
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
          {error || "无法加载博客数据，请检查网络连接或稍后重试。"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="btn btn-primary inline-flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
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
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            重新加载
          </button>

          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary inline-flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            检查系统状态
          </a>
        </div>
      </div>

      {debugInfo && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 text-left">
          <h3 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
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
              aria-hidden="true"
            >
              <path d="m10 20-6-6 6-6" />
              <path d="M4 14h12a6 6 0 0 0 6-6 6 6 0 0 0-6-6H10" />
            </svg>
            调试信息
          </h3>
          <pre className="text-xs text-[var(--text-tertiary)] overflow-auto max-h-32 bg-[var(--background)] p-3 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
