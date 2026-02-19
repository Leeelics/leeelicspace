import { type NextRequest, NextResponse } from "next/server";
import { postStore } from "../data";
import { isAuthenticated, getAuthDebugInfo } from "@/lib/auth";
import type { Post } from "@/types";

// 获取所有文章，支持分页、标签筛选和关键词搜索
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const per_page = parseInt(searchParams.get('per_page') || '5', 10);
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    
    console.log('GET /api/posts - Query params:', {
      page, per_page, tag, search,
      url: request.url
    });
    
    // 获取所有文章
    const allPosts = await postStore.getSortedPosts();
    
    // 筛选文章
    let filteredPosts = allPosts;
    
    // 标签筛选
    if (tag) {
      filteredPosts = filteredPosts.filter((post: Post) => post.tags.includes(tag));
    }
    
    // 关键词搜索
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter((post: Post) => 
        post.title.toLowerCase().includes(searchLower) || 
        post.content.toLowerCase().includes(searchLower)
      );
    }
    
    // 分页
    const start = (page - 1) * per_page;
    const end = start + per_page;
    const paginatedPosts = filteredPosts.slice(start, end);
    
    // 计算总数和页数
    const total = filteredPosts.length;
    const total_pages = Math.ceil(total / per_page);
    
    // 返回结果
    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        per_page,
        total,
        total_pages
      }
    });
  } catch (error) {
    console.error('API Error Details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      storage: 'kv-storage'
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      }, 
      { status: 500 }
    );
  }
}

// 创建新文章（需要管理员权限）
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const data = await request.json();
    
    console.log('POST /api/posts - Auth debug:', getAuthDebugInfo(request));
    
    // 权限验证
    if (!isAuthenticated(request)) {
      console.log('POST /api/posts - Authentication failed');
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Missing or invalid authentication credentials'
      }, { status: 401 });
    }
    
    // 验证必填字段
    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    
    // 创建新文章
    const newPost = await postStore.createPost({
      title: data.title,
      content: data.content,
      tags: data.tags || []
    });
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('API POST Error Details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      storage: 'kv-storage'
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create post',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      }, 
      { status: 500 }
    );
  }
}