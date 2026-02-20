import type { NextRequest } from "next/server";
import { getAuthDebugInfo, isAuthenticated } from "@/lib/auth";
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors";
import { logger } from "@/lib/logger";
import {
  checkRateLimit,
  getRateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { validateUpdatePost } from "@/lib/validation";
import { postStore } from "../../data";

// 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  let postId: string | undefined;

  try {
    // 速率限制检查（读操作）
    const rateLimitCheck = await checkRateLimit(request, RATE_LIMITS.read);
    if (!rateLimitCheck.allowed) {
      return createErrorResponse(
        new UnauthorizedError("Rate limit exceeded"),
        request,
      );
    }

    const paramsData = await params;
    postId = paramsData.postId;

    // Validate postId format (should be alphanumeric)
    if (!postId || !/^[a-zA-Z0-9_-]+$/.test(postId)) {
      return createErrorResponse(
        new ValidationError("Invalid post ID format"),
        request,
      );
    }

    const post = await postStore.getPostById(postId);

    if (!post) {
      return createErrorResponse(new NotFoundError("Post"), request);
    }

    const response = createSuccessResponse(post);

    // 添加速率限制头
    if (rateLimitCheck.result) {
      const headers = getRateLimitHeaders(rateLimitCheck.result);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    return response;
  } catch (error) {
    logger.apiError(
      request,
      `GET /api/posts/${postId} failed`,
      error instanceof Error ? error : new Error(String(error)),
      { postId },
    );
    return handleApiError(error, request);
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  let postId: string | undefined;

  try {
    // 速率限制检查（写操作）
    const rateLimitCheck = await checkRateLimit(request, RATE_LIMITS.write);
    if (!rateLimitCheck.allowed) {
      return createErrorResponse(
        new UnauthorizedError("Rate limit exceeded"),
        request,
      );
    }

    const paramsData = await params;
    postId = paramsData.postId;

    // Validate postId format
    if (!postId || !/^[a-zA-Z0-9_-]+$/.test(postId)) {
      return createErrorResponse(
        new ValidationError("Invalid post ID format"),
        request,
      );
    }

    // 获取请求体
    const data = await request.json();

    // Debug info only in development
    if (process.env.NODE_ENV === "development") {
      const debugInfo = getAuthDebugInfo(request);
      if (debugInfo) {
        logger.debug(`PUT /api/posts/${postId} - Auth debug`, debugInfo);
      }
    }

    // 权限验证
    if (!isAuthenticated(request)) {
      logger.warn(`Authentication failed for PUT /api/posts/${postId}`);
      return createErrorResponse(new UnauthorizedError(), request);
    }

    // 验证输入数据
    const validationResult = validateUpdatePost(data);
    if (!validationResult.success) {
      logger.debug(
        `PUT /api/posts/${postId} - Validation failed`,
        validationResult.error.format() as Record<string, unknown>,
      );
      return createErrorResponse(
        new ValidationError("Validation failed", {
          errors: validationResult.error.format() as Record<string, unknown>,
        }),
        request,
      );
    }

    const validatedData = validationResult.data;

    // Build update data (only include provided fields)
    const updateData: Record<string, unknown> = {};
    if (validatedData.title !== undefined)
      updateData.title = validatedData.title;
    if (validatedData.content !== undefined)
      updateData.content = validatedData.content;
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags;
    if (validatedData.coverImage !== undefined)
      updateData.coverImage = validatedData.coverImage;
    if (validatedData.publishStatus !== undefined)
      updateData.publishStatus = validatedData.publishStatus;
    if (validatedData.channelConfig !== undefined)
      updateData.channelConfig = validatedData.channelConfig;

    const updatedPost = await postStore.updatePost(postId, updateData);

    if (!updatedPost) {
      return createErrorResponse(new NotFoundError("Post"), request);
    }

    const response = createSuccessResponse(updatedPost);

    // 添加速率限制头
    if (rateLimitCheck.result) {
      const headers = getRateLimitHeaders(rateLimitCheck.result);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    logger.api(request, "Post updated successfully", { postId });
    return response;
  } catch (error) {
    logger.apiError(
      request,
      `PUT /api/posts/${postId} failed`,
      error instanceof Error ? error : new Error(String(error)),
      { postId },
    );
    return handleApiError(error, request);
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  let postId: string | undefined;

  try {
    // 速率限制检查（写操作）
    const rateLimitCheck = await checkRateLimit(request, RATE_LIMITS.write);
    if (!rateLimitCheck.allowed) {
      return createErrorResponse(
        new UnauthorizedError("Rate limit exceeded"),
        request,
      );
    }

    const paramsData = await params;
    postId = paramsData.postId;

    // Validate postId format
    if (!postId || !/^[a-zA-Z0-9_-]+$/.test(postId)) {
      return createErrorResponse(
        new ValidationError("Invalid post ID format"),
        request,
      );
    }

    // Debug info only in development
    if (process.env.NODE_ENV === "development") {
      const debugInfo = getAuthDebugInfo(request);
      if (debugInfo) {
        logger.debug(`DELETE /api/posts/${postId} - Auth debug`, debugInfo);
      }
    }

    // 权限验证
    if (!isAuthenticated(request)) {
      logger.warn(`Authentication failed for DELETE /api/posts/${postId}`);
      return createErrorResponse(new UnauthorizedError(), request);
    }

    // 删除文章
    const success = await postStore.deletePost(postId);

    if (!success) {
      return createErrorResponse(new NotFoundError("Post"), request);
    }

    const response = createSuccessResponse({ message: "Post deleted" });

    // 添加速率限制头
    if (rateLimitCheck.result) {
      const headers = getRateLimitHeaders(rateLimitCheck.result);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    logger.api(request, "Post deleted successfully", { postId });
    return response;
  } catch (error) {
    logger.apiError(
      request,
      `DELETE /api/posts/${postId} failed`,
      error instanceof Error ? error : new Error(String(error)),
      { postId },
    );
    return handleApiError(error, request);
  }
}
