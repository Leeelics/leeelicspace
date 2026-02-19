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
    <div className="py-2">
      <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] mb-6">
        目录
      </h3>
      
      <nav className="text-[15px] leading-relaxed">
        <ul className="space-y-3">
          {headings.map((heading) => {
            const isActive = activeHeading === heading.id;
            // 层级缩进：每级 20px
            const paddingLeft = (heading.level - 1) * 20;

            return (
              <li key={heading.id} style={{ paddingLeft: `${paddingLeft}px` }}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => scrollToHeading(e, heading.id)}
                  className={`block transition-colors duration-200 ${
                    isActive
                      ? 'text-[var(--accent)] font-medium'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                  title={heading.text}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

    </div>
  );
}

export default ArticleOutline;
