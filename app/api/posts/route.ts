import { type NextRequest } from "next/server";
import { postStore } from "../data";
import { isAuthenticated, getAuthDebugInfo } from "@/lib/auth";
import type { Post } from "@/types";
import { validateCreatePost, validatePagination } from "@/lib/validation";
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { 
  createSuccessResponse, 
  createErrorResponse, 
  ValidationError, 
  UnauthorizedError,
  handleApiError 
} from "@/lib/errors";
import { logger } from "@/lib/logger";

// 获取所有文章，支持分页、标签筛选和关键词搜索
export async function GET(request: NextRequest) {
  try {
    // 速率限制检查（读操作）
    const rateLimitCheck = await checkRateLimit(request, RATE_LIMITS.read);
    if (!rateLimitCheck.allowed) {
      return createErrorResponse(
        new UnauthorizedError('Rate limit exceeded'), 
        request
      );
    }
    
    // 获取并验证查询参数
    const searchParams = request.nextUrl.searchParams;
    const paramsResult = validatePagination({
      page: searchParams.get('page'),
      per_page: searchParams.get('per_page'),
      tag: searchParams.get('tag') || undefined,
      search: searchParams.get('search') || undefined,
    });
    
    if (!paramsResult.success) {
      return createErrorResponse(
        new ValidationError('Invalid query parameters', { 
          errors: paramsResult.error.format() 
        }), 
        request
      );
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
    const response = createSuccessResponse(
      { posts: paginatedPosts },
      {
        page,
        per_page,
        total,
        total_pages
      }
    );
    
    // 添加速率限制头
    if (rateLimitCheck.result) {
      const headers = getRateLimitHeaders(rateLimitCheck.result);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    return response;
  } catch (error) {
    logger.apiError(request, 'GET /api/posts failed', error instanceof Error ? error : new Error(String(error)));
    return handleApiError(error, request);
  }
}

// 创建新文章（需要管理员权限）
export async function POST(request: NextRequest) {
  try {
    // 速率限制检查（写操作）
    const rateLimitCheck = await checkRateLimit(request, RATE_LIMITS.write);
    if (!rateLimitCheck.allowed) {
      return createErrorResponse(
        new UnauthorizedError('Rate limit exceeded'), 
        request
      );
    }
    
    // 获取请求体
    const data = await request.json();
    
    // Debug info only in development
    if (process.env.NODE_ENV === 'development') {
      const debugInfo = getAuthDebugInfo(request);
      if (debugInfo) {
        logger.debug('POST /api/posts - Auth debug', debugInfo);
      }
    }
    
    // 权限验证
    if (!isAuthenticated(request)) {
      logger.warn('Authentication failed for POST /api/posts');
      return createErrorResponse(new UnauthorizedError(), request);
    }
    
    // 验证输入数据
    const validationResult = validateCreatePost(data);
    if (!validationResult.success) {
      logger.debug('POST /api/posts - Validation failed', validationResult.error.format() as Record<string, unknown>);
      return createErrorResponse(
        new ValidationError('Validation failed', { errors: validationResult.error.format() as Record<string, unknown> }), 
        request
      );
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
    
    const response = createSuccessResponse(newPost);
    
    // 添加速率限制头
    if (rateLimitCheck.result) {
      const headers = getRateLimitHeaders(rateLimitCheck.result);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    logger.api(request, 'Post created successfully', { postId: newPost.id });
    return response;
  } catch (error) {
    logger.apiError(request, 'POST /api/posts failed', error instanceof Error ? error : new Error(String(error)));
    return handleApiError(error, request);
  }
}
