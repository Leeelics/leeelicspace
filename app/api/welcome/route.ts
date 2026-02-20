import { type NextRequest } from 'next/server';
import { getGreeting } from '@/lib/edge-config';
import { createSuccessResponse, createErrorResponse, NotFoundError, handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const errorType = searchParams.get('error');
    
    const greeting = await getGreeting();
    
    if (errorType === 'not_found') {
      return createErrorResponse(new NotFoundError('Greeting'), request);
    }
    
    if (errorType === 'server_error') {
      // 模拟服务器错误
      throw new Error('Simulated server error');
    }
    
    if (greeting) {
      return createSuccessResponse({
        greeting,
        source: 'edge-config',
      });
    } else {
      return createErrorResponse(new NotFoundError('Greeting'), request);
    }
  } catch (error) {
    logger.apiError(request, 'Failed to retrieve greeting', error instanceof Error ? error : new Error(String(error)));
    return handleApiError(error, request);
  }
}
