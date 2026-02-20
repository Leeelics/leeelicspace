import { NextRequest, NextResponse } from "next/server";
import { postStore } from "../../data";
import { isAuthenticated, getAuthDebugInfo } from "@/lib/auth";
import { validateUpdatePost } from "@/lib/validation";
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";

// Helper for consistent logging
function logError(context: string, postId: string | undefined, error: unknown) {
  console.error(`[API] ${context} (postId: ${postId || 'unknown'}):`, 
    error instanceof Error ? error.message : 'Unknown error'
  );
}

// Helper for error response
function errorResponse(message: string, status: number, details?: unknown) {
  const response: { error: string; details?: unknown } = { error: message };
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }
  return NextResponse.json(response, { status });
}

// 获取单篇文章
export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  let postId: string | undefined;
  
  try {
    // 速率限制检查（读操作）
    const rateLimitCheck = await checkRateLimit(request, RATE_LIMITS.read);
    if (!rateLimitCheck.allowed) {
      return errorResponse('Too Many Requests', 429);
    }
    
    const paramsData = await params;
    postId = paramsData.postId;
    
    // Validate postId format (should be alphanumeric)
    if (!postId || !/^[a-zA-Z0-9_-]+$/.test(postId)) {
      return errorResponse('Invalid post ID format', 400);
    }
    
    const post = await postStore.getPostById(postId);
    const response = post 
      ? NextResponse.json(post)
      : NextResponse.json({ error: 'Post not found' }, { status: 404 });
    
    // 添加速率限制头
    if (rateLimitCheck.result) {
      const headers = getRateLimitHeaders(rateLimitCheck.result);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    return response;
  } catch (error) {
    logError('GET /api/posts/[postId]', postId, error);
    return errorResponse('Failed to fetch post', 500);
  }
}

// 更新文章
export async function PUT(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  let postId: string | undefined;
  
  try {
    // 速率限制检查（写操作）
    const rateLimitCheck = await checkRateLimit(request, RATE_LIMITS.write);
    if (!rateLimitCheck.allowed) {
      return errorResponse('Too Many Requests', 429);
    }
    
    const paramsData = await params;
    postId = paramsData.postId;
    
    // Validate postId format
    if (!postId || !/^[a-zA-Z0-9_-]+$/.test(postId)) {
      return errorResponse('Invalid post ID format', 400);
    }
    
    // 获取请求体
    const data = await request.json();
    
    // Debug info only in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`PUT /api/posts/${postId} - Auth debug:`, getAuthDebugInfo(request));
    }
    
    // 权限验证
    if (!isAuthenticated(request)) {
      console.log(`[AUTH] PUT /api/posts/${postId} - Authentication failed`);
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Missing or invalid authentication credentials'
      }, { status: 401 });
    }
    
    // 验证输入数据
    const validationResult = validateUpdatePost(data);
    if (!validationResult.success) {
      console.log(`[VALIDATION] PUT /api/posts/${postId} - Validation failed:`, validationResult.error.format());
      return NextResponse.json({ 
        error: 'Invalid input',
        details: validationResult.error.format()
      }, { status: 400 });
    }
    
    const validatedData = validationResult.data;
    
    // Build update data (only include provided fields)
    const updateData: Record<string, unknown> = {};
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.content !== undefined) updateData.content = validatedData.content;
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags;
    if (validatedData.coverImage !== undefined) updateData.coverImage = validatedData.coverImage;
    if (validatedData.publishStatus !== undefined) updateData.publishStatus = validatedData.publishStatus;
    if (validatedData.channelConfig !== undefined) updateData.channelConfig = validatedData.channelConfig;
    
    const updatedPost = await postStore.updatePost(postId, updateData);
    
    const response = updatedPost
      ? NextResponse.json(updatedPost)
      : NextResponse.json({ error: 'Post not found' }, { status: 404 });
    
    // 添加速率限制头
    if (rateLimitCheck.result) {
      const headers = getRateLimitHeaders(rateLimitCheck.result);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    return response;
  } catch (error) {
    logError('PUT /api/posts/[postId]', postId, error);
    return errorResponse('Failed to update post', 500);
  }
}

// 删除文章
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  let postId: string | undefined;
  
  try {
    // 速率限制检查（写操作）
    const rateLimitCheck = await checkRateLimit(request, RATE_LIMITS.write);
    if (!rateLimitCheck.allowed) {
      return errorResponse('Too Many Requests', 429);
    }
    
    const paramsData = await params;
    postId = paramsData.postId;
    
    // Validate postId format
    if (!postId || !/^[a-zA-Z0-9_-]+$/.test(postId)) {
      return errorResponse('Invalid post ID format', 400);
    }
    
    // Debug info only in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`DELETE /api/posts/${postId} - Auth debug:`, getAuthDebugInfo(request));
    }
    
    // 权限验证
    if (!isAuthenticated(request)) {
      console.log(`[AUTH] DELETE /api/posts/${postId} - Authentication failed`);
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Missing or invalid authentication credentials'
      }, { status: 401 });
    }
    
    // 删除文章
    const success = await postStore.deletePost(postId);
    
    const response = success
      ? NextResponse.json({ message: 'Post deleted' })
      : NextResponse.json({ error: 'Post not found' }, { status: 404 });
    
    // 添加速率限制头
    if (rateLimitCheck.result) {
      const headers = getRateLimitHeaders(rateLimitCheck.result);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    return response;
  } catch (error) {
    logError('DELETE /api/posts/[postId]', postId, error);
    return errorResponse('Failed to delete post', 500);
  }
}
