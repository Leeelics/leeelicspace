'use client';

import React, { useState, useEffect, useRef } from 'react';

// 文章大纲组件
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
      const scrollPosition = window.scrollY + 100;
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);
  
  if (headings.length === 0) {
    return null;
  }
  
  return (
    <div className="hidden lg:block lg:sticky lg:top-24 self-start">
      <div className="bg-gray-50 rounded-lg p-4 dark:bg-catppuccin-surface0">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-catppuccin-text">文章大纲</h3>
        <nav className="text-sm">
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id} className={`ml-${(heading.level - 1) * 4}`}>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1 px-2 rounded transition-colors ${activeHeading === heading.id
                    ? 'text-blue-600 dark:text-catppuccin-blue font-medium'
                    : 'text-gray-600 dark:text-catppuccin-subtext0 hover:text-blue-500 dark:hover:text-catppuccin-blue'}`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default ArticleOutline;
