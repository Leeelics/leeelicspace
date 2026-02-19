'use client';

import React, { useState, useEffect } from 'react';

// 文章大纲组件 - 优化版
function ArticleOutline({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Array<{ level: number; text: string; id: string }>>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // 提取Markdown中的标题
  useEffect(() => {
    const extractedHeadings: Array<{ level: number; text: string; id: string }> = [];
    const lines = content.split('\n');

    lines.forEach(line => {
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        extractedHeadings.push({ level, text, id });
      }
    });

    setHeadings(extractedHeadings);
  }, [content]);

  // 监听滚动，更新当前活动标题
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let current = '';

      // 找到当前可见的最高级标题
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            current = heading.id;
          } else {
            break;
          }
        }
      }

      setActiveHeading(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // 平滑滚动到标题
  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // 顶部偏移量
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="hidden lg:block">
      <div className="sticky top-24">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-catppuccin-surface0 dark:to-catppuccin-surface1 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-catppuccin-surface2">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-600 dark:text-catppuccin-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <h3 className="text-base font-semibold text-gray-900 dark:text-catppuccin-text">
              目录
            </h3>
          </div>
          <nav className="text-sm">
            <ul className="space-y-0.5">
              {headings.map((heading) => {
                const isActive = activeHeading === heading.id;
                const paddingLeft = (heading.level - 1) * 12;

                return (
                  <li key={heading.id} style={{ paddingLeft: `${paddingLeft}px` }}>
                    <a
                      href={`#${heading.id}`}
                      onClick={(e) => scrollToHeading(e, heading.id)}
                      className={`block py-2 px-3 rounded-md transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-100 dark:bg-catppuccin-blue/20 text-blue-700 dark:text-catppuccin-blue font-medium border-l-2 border-blue-600 dark:border-catppuccin-blue'
                          : 'text-gray-600 dark:text-catppuccin-subtext0 hover:bg-gray-100 dark:hover:bg-catppuccin-surface0 hover:text-gray-900 dark:hover:text-catppuccin-text border-l-2 border-transparent'
                      }`}
                      title={heading.text}
                    >
                      <span className="line-clamp-2">{heading.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* 返回顶部按钮 */}
        {activeHeading && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-catppuccin-surface0 text-gray-700 dark:text-catppuccin-text rounded-lg shadow-sm border border-gray-200 dark:border-catppuccin-surface2 hover:bg-gray-50 dark:hover:bg-catppuccin-surface1 transition-colors"
            title="返回顶部"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-sm font-medium">返回顶部</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ArticleOutline;
