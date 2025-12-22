import { NextResponse } from 'next/server';
import { postStore } from '../data';

// RSS订阅功能
export async function GET() {
  try {
    // 获取排序后的文章
    const sortedPosts = await postStore.getSortedPosts();
    
    // 创建RSS XML内容
    let rssContent = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>我的博客</title>
    <link>http://localhost:3000</link>
    <description>使用Next.js构建的个人博客</description>`;
    
    // 添加文章项
    for (const post of sortedPosts.slice(0, 10)) {  // 只显示最新的10篇文章
      // 转换为RSS标准格式（RFC 822）
      const pubDate = new Date(post.created_at).toUTCString();
      
      // 处理内容，确保XML安全
      let content = post.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      
      // 截取前200个字符作为描述
      const description = content.length > 200 ? `${content.slice(0, 200)}...` : content;
      
      rssContent += `
    <item>
      <title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
      <link>http://localhost:3000/posts/${post.id}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${post.id}</guid>
    </item>`;
    }
    
    rssContent += `
  </channel>
</rss>`;
    
    // 返回RSS响应
    return new NextResponse(rssContent, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
  }
}
