import { type NextRequest } from 'next/server';
import { postStore } from '../data';
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rate-limit';
import { createSuccessResponse, createErrorResponse, UnauthorizedError, handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

// 获取所有标签
export async function GET(request: NextRequest) {
  try {
    // 速率限制检查
    const rateLimitCheck = await checkRateLimit(request, RATE_LIMITS.read);
    if (!rateLimitCheck.allowed) {
      return createErrorResponse(
        new UnauthorizedError('Rate limit exceeded'), 
        request
      );
    }
    
    logger.debug('Fetching tags');
    const tags = await postStore.getAllTags();
    logger.debug(`Found ${tags.length} tags`);
    
    const response = createSuccessResponse(tags);
    
    // 添加速率限制头
    if (rateLimitCheck.result) {
      const headers = getRateLimitHeaders(rateLimitCheck.result);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    return response;
  } catch (error) {
    logger.apiError(request, 'GET /api/tags failed', error instanceof Error ? error : new Error(String(error)));
    return handleApiError(error, request);
  }
}
