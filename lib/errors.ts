/**
 * 统一错误处理
 * 
 * 提供标准化的错误类型和 API 错误响应
 */

import { NextResponse } from 'next/server';
import { logger } from './logger';

// 错误代码枚举
export enum ErrorCode {
  // 认证相关
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // 请求相关
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  
  // 资源相关
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  
  // 服务器相关
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

// HTTP 状态码映射
const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.RATE_LIMITED]: 429,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,
};

// 基础应用错误
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = ERROR_STATUS_MAP[code];
    this.details = details;
    
    // 保持堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// 便捷错误类
export class UnauthorizedError extends AppError {
  constructor(message = '未授权访问', details?: Record<string, unknown>) {
    super(ErrorCode.UNAUTHORIZED, message, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '禁止访问', details?: Record<string, unknown>) {
    super(ErrorCode.FORBIDDEN, message, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = '请求数据验证失败', details?: Record<string, unknown>) {
    super(ErrorCode.VALIDATION_ERROR, message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = '资源', details?: Record<string, unknown>) {
    super(ErrorCode.NOT_FOUND, `${resource}不存在`, details);
  }
}

export class RateLimitError extends AppError {
  constructor(
    message = '请求过于频繁，请稍后再试',
    public readonly retryAfter: number = 60,
    details?: Record<string, unknown>
  ) {
    super(ErrorCode.RATE_LIMITED, message, details);
  }
}

// 统一 API 错误响应格式
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  requestId?: string;
}

// 统一 API 成功响应格式
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// 创建错误响应
export function createErrorResponse(
  error: AppError | Error,
  request?: Request
): NextResponse<ApiErrorResponse> {
  const timestamp = new Date().toISOString();
  
  // 生成请求 ID（可以集成更复杂的追踪系统）
  const requestId = crypto.randomUUID().slice(0, 8);

  // 处理不同类型的错误
  if (error instanceof AppError) {
    // 记录错误日志（除了 4xx 客户端错误）
    if (error.statusCode >= 500) {
      logger.error('Server error', error, {
        requestId,
        url: request?.url,
        code: error.code,
      });
    }

    const headers: Record<string, string> = {};
    
    // 速率限制添加 Retry-After 头
    if (error instanceof RateLimitError) {
      headers['Retry-After'] = String(error.retryAfter);
      headers['X-RateLimit-Reset'] = String(Math.floor(Date.now() / 1000) + error.retryAfter);
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        timestamp,
        requestId,
      },
      { 
        status: error.statusCode,
        headers,
      }
    );
  }

  // 未知错误
  logger.error('Unexpected error', error instanceof Error ? error : new Error(String(error)), {
    requestId,
    url: request?.url,
  });

  // 生产环境不暴露内部错误详情
  const isProd = process.env.NODE_ENV === 'production';
  
  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: isProd ? '服务器内部错误' : error.message,
        details: isProd ? undefined : { stack: error.stack },
      },
      timestamp,
      requestId,
    },
    { status: 500 }
  );
}

// 创建成功响应
export function createSuccessResponse<T>(
  data: T,
  meta?: ApiSuccessResponse<T>['meta']
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
    meta,
  });
}

// 安全的错误消息处理
export function sanitizeErrorMessage(message: string): string {
  // 移除可能包含敏感信息的路径
  return message
    .replace(/\/home\/[^\/]+/g, '[HOME]')
    .replace(/\/Users\/[^\/]+/g, '[USER]')
    .replace(/C:\\Users\\[^\\]+/g, '[USER]')
    .replace(/([a-f0-9]{32,})/gi, '[HASH]') // 隐藏可能的密钥
    .replace(/(password|secret|key|token)["']?\s*[:=]\s*["']?[^\s"']+/gi, '$1=[REDACTED]');
}

// API 路由错误处理器
export async function handleApiError(
  error: unknown,
  request: Request
): Promise<NextResponse<ApiErrorResponse>> {
  if (error instanceof AppError) {
    return createErrorResponse(error, request);
  }

  if (error instanceof Error) {
    return createErrorResponse(error, request);
  }

  return createErrorResponse(new Error(String(error)), request);
}
