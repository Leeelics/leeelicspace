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
    <div className="max-w-4xl mx-auto p-8 text-center">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
          数据加载失败
        </h2>
        <p className="text-red-600 dark:text-red-300 mb-4">
          {error || "无法加载博客数据，请检查网络连接或稍后重试。"}
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            重新加载
          </button>

          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors ml-2"
          >
            检查系统状态
          </a>
        </div>
      </div>

      {debugInfo && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            调试信息
          </h3>
          <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
