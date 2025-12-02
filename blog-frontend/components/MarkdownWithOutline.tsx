'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useRef } from 'react';

// Markdown渲染组件，带有大纲功能
function MarkdownWithOutline({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Array<{ level: number; text: string; id: string }>>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);
  
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
      if (!contentRef.current) return;
      
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
  
  // 自定义标题渲染组件
  const Heading = ({ level, children }: { level: number; children: React.ReactNode }) => {
    const text = React.Children.toArray(children).join('');
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    
    return (
      <HeadingTag 
        id={id} 
        className={`font-bold mb-4 mt-8 scroll-mt-20 ${level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'}`}
      >
        {children}
      </HeadingTag>
    );
  };
  
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 文章内容 */}
        <div ref={contentRef} className="lg:w-3/4">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            components={{
              h1: (props) => <Heading level={1} {...props} />,
              h2: (props) => <Heading level={2} {...props} />,
              h3: (props) => <Heading level={3} {...props} />,
              h4: (props) => <Heading level={4} {...props} />,
              h5: (props) => <Heading level={5} {...props} />,
              h6: (props) => <Heading level={6} {...props} />,
            }}
            wrapperProps={{
              className: "prose prose-lg max-w-none dark:prose-invert"
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        
        {/* 右侧：大纲 */}
        {headings.length > 0 && (
          <div className="lg:w-1/4 lg:sticky lg:top-24 self-start">
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
        )}
      </div>
    </>
  );
}

export default MarkdownWithOutline;