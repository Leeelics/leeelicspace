import { type NextRequest, NextResponse } from "next/server";
import { postStore } from "../data";
import { isAuthenticated, getAuthDebugInfo } from "@/lib/auth";
import type { Post } from "@/types";
import { validateCreatePost, validatePagination } from "@/lib/validation";

// Helper for consistent error logging
function logError(context: string, error: unknown, request: NextRequest) {
  console.error(`[API] ${context}:`, {
    error: error instanceof Error ? error.message : 'Unknown error',
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  });
}

// Helper for error response
function errorResponse(message: string, status: number, details?: unknown) {
  const response: { error: string; details?: unknown } = { error: message };
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }
  return NextResponse.json(response, { status });
}

// 获取所有文章，支持分页、标签筛选和关键词搜索
export async function GET(request: NextRequest) {
  try {
    // 获取并验证查询参数
    const searchParams = request.nextUrl.searchParams;
    const paramsResult = validatePagination({
      page: searchParams.get('page'),
      per_page: searchParams.get('per_page'),
      tag: searchParams.get('tag') || undefined,
      search: searchParams.get('search') || undefined,
    });
    
    if (!paramsResult.success) {
      return errorResponse('Invalid query parameters', 400, paramsResult.error.format());
    }
    
    const { page, per_page, tag, search } = paramsResult.data;
    
    // 获取所有文章
    const allPosts = await postStore.getSortedPosts();
    
    // 筛选文章
    let filteredPosts = allPosts;
    
    // 标签筛选
    if (tag) {
      filteredPosts = filteredPosts.filter((post: Post) => post.tags.includes(tag));
    }
    
    // 关键词搜索（安全的字符串匹配）
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
    logError('GET /api/posts error', error, request);
    return errorResponse('Failed to fetch posts', 500);
  }
}

// 创建新文章（需要管理员权限）
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const data = await request.json();
    
    // Debug info only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('POST /api/posts - Auth debug:', getAuthDebugInfo(request));
    }
    
    // 权限验证
    if (!isAuthenticated(request)) {
      console.log('[AUTH] POST /api/posts - Authentication failed');
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Missing or invalid authentication credentials'
      }, { status: 401 });
    }
    
    // 验证输入数据
    const validationResult = validateCreatePost(data);
    if (!validationResult.success) {
      console.log('[VALIDATION] POST /api/posts - Validation failed:', validationResult.error.format());
      return NextResponse.json({ 
        error: 'Invalid input',
        details: validationResult.error.format()
      }, { status: 400 });
    }
    
    const validatedData = validationResult.data;
    
    // 创建新文章
    const newPost = await postStore.createPost({
      title: validatedData.title,
      content: validatedData.content,
      tags: validatedData.tags,
      ...(validatedData.coverImage && { coverImage: validatedData.coverImage }),
      ...(validatedData.publishStatus && { publishStatus: validatedData.publishStatus }),
      ...(validatedData.channelConfig && { channelConfig: validatedData.channelConfig }),
    });
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    logError('POST /api/posts error', error, request);
    return errorResponse('Failed to create post', 500);
  }
}
