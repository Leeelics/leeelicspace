import { NextRequest } from 'next/server';

/**
 * Simple authentication utility for API routes
 * In production, consider using JWT tokens or OAuth
 */

export interface AuthConfig {
  secret?: string;
  headerName?: string;
  queryParamName?: string;
}

/**
 * Check if the request has valid authentication
 * Supports both header and query parameter authentication
 */
export function isAuthenticated(
  request: NextRequest, 
  config: AuthConfig = {}
): boolean {
  const {
    secret = process.env.API_SECRET || 'admin-secret',
    headerName = 'X-API-Secret',
    queryParamName = 'secret'
  } = config;

  try {
    // Check header authentication
    const headerSecret = request.headers.get(headerName);
    if (headerSecret && headerSecret === secret) {
      return true;
    }

    // Check query parameter authentication
    const url = new URL(request.url);
    const querySecret = url.searchParams.get(queryParamName);
    if (querySecret && querySecret === secret) {
      return true;
    }

    // Check body authentication (for POST requests)
    // This is handled separately in each route to avoid parsing body multiple times

    return false;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

/**
 * Middleware-style authentication wrapper
 */
export function requireAuth(
  handler: (request: NextRequest) => Promise<Response>,
  config?: AuthConfig
) {
  return async (request: NextRequest): Promise<Response> => {
    if (!isAuthenticated(request, config)) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Missing or invalid authentication credentials'
        }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(request);
  };
}

/**
 * Get authentication info for debugging
 */
export function getAuthDebugInfo(request: NextRequest): Record<string, any> {
  const url = new URL(request.url);
  
  return {
    hasHeaderSecret: !!request.headers.get('X-API-Secret'),
    hasQuerySecret: !!url.searchParams.get('secret'),
    headerSecretLength: request.headers.get('X-API-Secret')?.length || 0,
    querySecretLength: url.searchParams.get('secret')?.length || 0,
    method: request.method,
    url: request.url
  };
}