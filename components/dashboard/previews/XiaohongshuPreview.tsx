"use client";

import { Check, Copy, Download } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface XiaohongshuPreviewProps {
  title: string;
  content: string;
}

export default function XiaohongshuPreview({
  title,
  content,
}: XiaohongshuPreviewProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Configuration
  const [config, setConfig] = useState({
    background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    textColor: "#1f2937",
    fontSize: 28,
    padding: 60,
    showTitle: true,
    showWatermark: true,
  });

  // Extract plain text for character count
  const plainText = content.replace(/[#*`]/g, "");
  const isOverLimit = plainText.length > 1000;

  const handleCopyText = () => {
    const textToCopy = `${title}\n\n${plainText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = async () => {
    // This will be implemented with html2canvas
    // For now, show a placeholder message
    alert("卡片下载功能需要加载 html2canvas，点击确定继续...");
  };

  return (
    <div className="p-8">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm">
          <span className="text-[var(--text-muted)]">字数：</span>
          <span
            className={
              isOverLimit ? "text-red-500" : "text-[var(--text-primary)]"
            }
          >
            {plainText.length} / 1000
          </span>
          {isOverLimit && <span className="text-red-500 ml-2">超出限制</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "已复制" : "复制文本"}
          </button>
          <button
            onClick={handleDownloadCard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#ff2442] text-white rounded-lg hover:bg-[#ff2442]/90 transition-colors"
          >
            <Download size={14} />
            下载卡片
          </button>
        </div>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className="relative w-[375px] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: config.background,
            padding: config.padding,
          }}
        >
          {/* Content */}
          <div style={{ color: config.textColor }}>
            {config.showTitle && title && (
              <h2
                className="font-bold mb-4"
                style={{ fontSize: config.fontSize * 1.5 }}
              >
                {title}
              </h2>
            )}
            <div style={{ fontSize: config.fontSize, lineHeight: 1.6 }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <div
                      style={{
                        fontSize: config.fontSize * 1.3,
                        fontWeight: "bold",
                        margin: "0.5em 0",
                      }}
                    >
                      {children}
                    </div>
                  ),
                  h2: ({ children }) => (
                    <div
                      style={{
                        fontSize: config.fontSize * 1.2,
                        fontWeight: "bold",
                        margin: "0.5em 0",
                      }}
                    >
                      {children}
                    </div>
                  ),
                  p: ({ children }) => (
                    <div style={{ margin: "0.5em 0" }}>{children}</div>
                  ),
                  li: ({ children }) => (
                    <div style={{ margin: "0.3em 0", paddingLeft: "1em" }}>
                      • {children}
                    </div>
                  ),
                }}
              >
                {content || "开始写作，卡片内容将在这里显示..."}
              </ReactMarkdown>
            </div>
          </div>

          {/* Watermark */}
          {config.showWatermark && (
            <div
              className="mt-8 pt-4 flex items-center gap-2 opacity-60"
              style={{
                color: config.textColor,
                borderTop: `1px solid ${config.textColor}20`,
                fontSize: config.fontSize * 0.7,
              }}
            >
              <div
                className="w-1 h-4 rounded-full"
                style={{ backgroundColor: config.textColor }}
              />
              <span>@leelicspace</span>
              <span className="ml-auto">
                {new Date().toLocaleDateString("zh-CN")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Style Controls */}
      <div className="mt-6 p-4 bg-[var(--surface)] rounded-lg">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
          样式设置
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="bg-select"
              className="text-xs text-[var(--text-muted)] block mb-1"
            >
              背景
            </label>
            <select
              id="bg-select"
              value={config.background}
              onChange={(e) =>
                setConfig({ ...config, background: e.target.value })
              }
              className="w-full text-sm p-2 rounded border border-[var(--border)] bg-[var(--background)]"
            >
              <option value="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)">
                极光
              </option>
              <option value="linear-gradient(120deg, #f6d365 0%, #fda085 100%)">
                日落
              </option>
              <option value="#ffffff">纯白</option>
              <option value="#1a1a1a">纯黑</option>
              <option value="#fdfbf7">纸张</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="font-size"
              className="text-xs text-[var(--text-muted)] block mb-1"
            >
              字号
            </label>
            <input
              id="font-size"
              type="range"
              min={20}
              max={40}
              value={config.fontSize}
              onChange={(e) =>
                setConfig({ ...config, fontSize: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
