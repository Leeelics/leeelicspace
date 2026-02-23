"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  Copy,
  Download,
  Edit3,
  FileText,
  Instagram,
  Layout,
  Palette,
  Plus,
  Smartphone,
  Twitter,
  Type,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

const FONTS = [
  { name: "默认黑体", value: "sans-serif" },
  { name: "宋体风格", value: '"Songti SC", "Noto Serif SC", serif' },
  { name: "楷体风格", value: '"Kaiti SC", "STKaiti", serif' },
  { name: "圆体风格", value: '"Yuanti SC", "YouYuan", sans-serif' },
  { name: "系统代码", value: "monospace" },
];

const PRESETS = [
  {
    name: "小红书竖屏",
    width: 1080,
    height: 1440,
    icon: <Smartphone size={16} />,
  },
  {
    name: "小红书/IG 正方",
    width: 1080,
    height: 1080,
    icon: <Instagram size={16} />,
  },
  {
    name: "Twitter/X 横屏",
    width: 1200,
    height: 675,
    icon: <Twitter size={16} />,
  },
  {
    name: "Instagram Story",
    width: 1080,
    height: 1920,
    icon: <Instagram size={16} />,
  },
  { name: "A4 竖版", width: 794, height: 1123, icon: <FileText size={16} /> },
  {
    name: "16:9 横屏",
    width: 1920,
    height: 1080,
    icon: <Smartphone size={16} />,
  },
];

const GRADIENTS = [
  { name: "纯白", value: "#ffffff", type: "hex" },
  { name: "纸张", value: "#fdfbf7", type: "hex" },
  {
    name: "极光",
    value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    type: "style",
  },
  {
    name: "日落",
    value: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
    type: "style",
  },
  {
    name: "深邃",
    value: "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
    type: "style",
    dark: true,
  },
  { name: "纯黑", value: "#1a1a1a", type: "hex", dark: true },
  {
    name: "樱花",
    value: "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)",
    type: "style",
  },
  {
    name: "薄荷",
    value: "linear-gradient(to top, #d299c2 0%, #fef9d7 100%)",
    type: "style",
  },
];

export default function MediaCardCreator() {
  const [content, setContent] = useState({
    title: "在这里输入你的标题",
    body: '## 欢迎使用 Markdown\n\n这里是正文内容，支持 **Markdown** 格式！\n\n### 特性\n- ✅ 支持粗体和斜体\n- ✅ 支持标题\n- ✅ 支持列表\n- ✅ 支持引用\n- ✅ 支持代码块\n\n> 这是一个引用示例\n\n```javascript\nconsole.log("Hello, World!");\n```\n\n这个工具可以自动帮你排版，非常适合发小红书或者 Twitter。',
    author: "@leelicspace",
    date: new Date().toLocaleDateString(),
  });

  const [config, setConfig] = useState({
    presetIndex: 0,
    fontFamily: "sans-serif",
    titleSize: 64,
    bodySize: 32,
    lineHeight: 1.6,
    textAlign: "left" as const,
    textColor: "#1f2937",
    background: GRADIENTS[2],
    padding: 80,
    showWatermark: true,
    showDate: true,
    showTitle: true,
    previewScale: 0.3,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentPreset = PRESETS[config.presetIndex];
  const canvasWidth = currentPreset.width;
  const canvasHeight = currentPreset.height;

  const getBackgroundStyle = useCallback(() => {
    const bg = config.background;
    if (bg.type === "hex") return { backgroundColor: bg.value };
    if (bg.type === "style") return { background: bg.value };
    return {};
  }, [config.background]);

  const handleCopyText = () => {
    const textToCopy = `${content.title}\n\n${content.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      if (canvasRef.current) {
        const canvas = await html2canvas(canvasRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        });

        const link = document.createElement("a");
        link.download = `card-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("导出失败，请重试");
    } finally {
      setIsExporting(false);
    }
  };

  // Auto-calculate scale
  useEffect(() => {
    const calculateScale = () => {
      const containerWidth =
        window.innerWidth > 1024
          ? window.innerWidth * 0.5
          : window.innerWidth - 40;
      const scale = Math.min(containerWidth / canvasWidth, 0.8);
      setConfig((prev) => ({ ...prev, previewScale: Math.max(0.2, scale) }));
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [canvasWidth]);

  return (
    <div className="min-h-full bg-muted flex flex-col lg:flex-row font-sans text-foreground">
      {/* Left Panel */}
      <div className="w-full lg:w-[420px] bg-card border-r border-border h-[calc(100vh-73px)] overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-border sticky top-0 bg-card/95 backdrop-blur z-20">
          <h1 className="text-xl font-bold text-foreground">图文排版助手</h1>
          <p className="text-sm text-muted-foreground mt-1">
            支持 Markdown 和多平台导出
          </p>
        </div>

        <div className="p-8 space-y-10 pb-32">
          {/* Size Presets */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layout size={14} /> 画布尺寸
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((preset, idx) => (
                <Button
                  type="button"
                  key={preset.name}
                  onClick={() => setConfig({ ...config, presetIndex: idx })}
                  variant={config.presetIndex === idx ? "default" : "outline"}
                  className={`flex items-center gap-2 p-4 text-sm justify-start h-auto ${
                    config.presetIndex === idx ? "ring-1 ring-ring" : ""
                  }`}
                >
                  {preset.icon}
                  {preset.name}
                </Button>
              ))}
            </div>
          </section>

          {/* Content Editor */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Type size={14} /> 内容编辑
            </h3>

            <div>
              <label
                htmlFor="title-input"
                className="block text-sm font-medium text-foreground mb-2"
              >
                标题
              </label>
              <input
                id="title-input"
                type="text"
                value={content.title}
                onChange={(e) =>
                  setContent({ ...content, title: e.target.value })
                }
                className="w-full p-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="body-input"
                className="block text-sm font-medium text-foreground mb-2"
              >
                正文 (支持 Markdown)
              </label>
              <textarea
                id="body-input"
                rows={10}
                value={content.body}
                onChange={(e) =>
                  setContent({ ...content, body: e.target.value })
                }
                className="w-full p-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="author-input"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  作者
                </label>
                <input
                  id="author-input"
                  type="text"
                  value={content.author}
                  onChange={(e) =>
                    setContent({ ...content, author: e.target.value })
                  }
                  className="w-full p-3 border border-input rounded-md bg-background"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-muted-foreground mb-2">
                  <input
                    type="checkbox"
                    checked={config.showDate}
                    onChange={(e) =>
                      setConfig({ ...config, showDate: e.target.checked })
                    }
                    className="rounded border-border text-primary focus:ring-ring"
                  />
                  显示日期
                </label>
              </div>
            </div>
          </section>

          {/* Style Settings */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Palette size={14} /> 外观样式
            </h3>

            {/* Background */}
            <div>
              <p className="block text-sm font-medium text-foreground mb-3">
                背景主题
              </p>
              <div className="grid grid-cols-4 gap-3">
                {GRADIENTS.map((bg) => (
                  <Button
                    type="button"
                    key={bg.name}
                    onClick={() => {
                      setConfig({
                        ...config,
                        background: bg,
                        textColor: bg.dark ? "#ffffff" : "#1f2937",
                      });
                    }}
                    variant="ghost"
                    className={`w-full aspect-square p-0 border-2 transition-all ${
                      config.background.name === bg.name
                        ? "border-primary scale-105"
                        : "border-input"
                    }`}
                    style={
                      bg.type === "hex"
                        ? { backgroundColor: bg.value }
                        : { background: bg.value }
                    }
                    title={bg.name}
                  />
                ))}
              </div>
            </div>

            {/* Font */}
            <div>
              <p className="block text-sm font-medium text-foreground mb-3">
                字体风格
              </p>
              <div className="flex flex-wrap gap-2">
                {FONTS.map((font) => (
                  <Button
                    type="button"
                    key={font.name}
                    onClick={() =>
                      setConfig({ ...config, fontFamily: font.value })
                    }
                    variant={
                      config.fontFamily === font.value ? "default" : "outline"
                    }
                    size="sm"
                    className="text-xs rounded-full px-3 py-2"
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Alignment */}
            <div>
              <p className="block text-sm font-medium text-foreground mb-3">
                对齐方式
              </p>
              <div className="flex bg-muted rounded-lg p-1 w-fit">
                {[
                  { val: "left", icon: <AlignLeft size={16} /> },
                  { val: "center", icon: <AlignCenter size={16} /> },
                  { val: "right", icon: <AlignRight size={16} /> },
                ].map((align) => (
                  <Button
                    type="button"
                    key={align.val}
                    onClick={() =>
                      setConfig({ ...config, textAlign: align.val as any })
                    }
                    variant={
                      config.textAlign === align.val ? "secondary" : "ghost"
                    }
                    size="sm"
                    className="p-2"
                  >
                    {align.icon}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5">
              {[
                {
                  label: "标题字号",
                  key: "titleSize" as const,
                  min: 24,
                  max: 128,
                },
                {
                  label: "正文字号",
                  key: "bodySize" as const,
                  min: 14,
                  max: 64,
                },
                {
                  label: "行间距",
                  key: "lineHeight" as const,
                  min: 1,
                  max: 3,
                  step: 0.1,
                },
                { label: "边距", key: "padding" as const, min: 20, max: 200 },
              ].map((control) => (
                <div key={control.key}>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{control.label}</span>
                    <span>{config[control.key]}</span>
                  </div>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step || 1}
                    value={config[control.key]}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        [control.key]: Number(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 bg-muted overflow-hidden flex flex-col relative h-[calc(100vh-73px)]">
        {/* Toolbar */}
        <div className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm z-10">
          <div className="text-sm text-muted-foreground">
            预览尺寸: {canvasWidth} × {canvasHeight}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={handleCopyText}
              variant="outline"
              className="flex items-center gap-2"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "已复制" : "复制文本"}
            </Button>
            <Button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <>处理中...</>
              ) : (
                <>
                  <Download size={18} />
                  下载图片
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-dots">
          <div
            style={{
              width: canvasWidth * config.previewScale,
              height: canvasHeight * config.previewScale,
            }}
            className="relative shadow-2xl"
          >
            <div
              ref={canvasRef}
              className="absolute top-0 left-0 origin-top-left"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                transform: `scale(${config.previewScale})`,
                ...getBackgroundStyle(),
                color: config.textColor,
                fontFamily: config.fontFamily,
                padding: config.padding,
                textAlign: config.textAlign,
              }}
            >
              <div className="flex flex-col justify-center h-full">
                {config.showTitle && content.title && (
                  <h1
                    style={{
                      fontSize: config.titleSize,
                      marginBottom: config.titleSize * 0.8,
                      lineHeight: 1.2,
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {content.title}
                  </h1>
                )}
                <div style={{ flex: 1 }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <div
                          style={{
                            fontSize: config.bodySize * 1.5,
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
                            fontSize: config.bodySize * 1.3,
                            fontWeight: "bold",
                            margin: "0.5em 0",
                          }}
                        >
                          {children}
                        </div>
                      ),
                      h3: ({ children }) => (
                        <div
                          style={{
                            fontSize: config.bodySize * 1.2,
                            fontWeight: "bold",
                            margin: "0.5em 0",
                          }}
                        >
                          {children}
                        </div>
                      ),
                      p: ({ children }) => (
                        <div
                          style={{
                            margin: "0.5em 0",
                            lineHeight: config.lineHeight,
                          }}
                        >
                          {children}
                        </div>
                      ),
                      li: ({ children }) => (
                        <div style={{ margin: "0.3em 0" }}>• {children}</div>
                      ),
                      code: ({ children }) => (
                        <code
                          style={{
                            background: "rgba(0,0,0,0.1)",
                            padding: "0.2em 0.4em",
                            borderRadius: "3px",
                            fontFamily: "monospace",
                          }}
                        >
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre
                          style={{
                            background: "rgba(0,0,0,0.1)",
                            padding: "1em",
                            borderRadius: "5px",
                            overflow: "auto",
                          }}
                        >
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {content.body}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Watermark */}
              {(config.showWatermark || config.showDate) && (
                <div
                  className="mt-8 pt-4 flex justify-between items-center opacity-70"
                  style={{
                    borderTop: `1px solid ${config.textColor}20`,
                    fontSize: Math.max(16, config.bodySize * 0.6),
                  }}
                >
                  <div className="font-semibold flex items-center gap-2">
                    {config.showWatermark && (
                      <>
                        <div
                          className="w-1 h-4 rounded-full"
                          style={{ backgroundColor: config.textColor }}
                        />
                        {content.author}
                      </>
                    )}
                  </div>
                  {config.showDate && (
                    <div className="font-mono">{content.date}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-dots {
          background-image: radial-gradient(var(--border) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
