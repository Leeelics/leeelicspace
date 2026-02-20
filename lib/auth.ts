import { NextRequest } from 'next/server';
import { logger } from './logger';

/**
 * Simple authentication utility for API routes
 * In production, consider using JWT tokens or OAuth
 */

export interface AuthConfig {
  secret?: string;
  headerName?: string;
  queryParamName?: string;
}

// Secure secret configuration - no default fallback
function getSecret(config?: AuthConfig): string | null {
  // Priority: config > environment variable
  const secret = config?.secret || process.env.API_SECRET;
  
  if (!secret) {
    logger.error('API_SECRET environment variable is not set');
    return null;
  }
  
  // Minimum secret length check
  if (secret.length < 16) {
    logger.error('API_SECRET must be at least 16 characters long');
    return null;
  }
  
  return secret;
}

/**
 * Check if the request has valid authentication
 * Supports both header and query parameter authentication
 */
export function isAuthenticated(
  request: NextRequest, 
  config: AuthConfig = {}
): boolean {
  const secret = getSecret(config);
  
  // If no valid secret is configured, reject all requests
  if (!secret) {
    return false;
  }

  const {
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

    return false;
  } catch (error) {
    logger.error('Auth check failed', error instanceof Error ? error : new Error(String(error)));
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
 * WARNING: Only use in development environment
 */
export function getAuthDebugInfo(request: NextRequest): Record<string, unknown> | null {
  // Only return debug info in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  const url = new URL(request.url);
  const secret = getSecret();
  
  return {
    hasHeaderSecret: !!request.headers.get('X-API-Secret'),
    hasQuerySecret: !!url.searchParams.get('secret'),
    headerSecretLength: request.headers.get('X-API-Secret')?.length || 0,
    querySecretLength: url.searchParams.get('secret')?.length || 0,
    method: request.method,
    url: request.url,
    hasConfiguredSecret: !!secret,
    secretLength: secret?.length || 0,
  };
}

/**
 * Validate that authentication is properly configured
 * Call this during application startup
 */
export function validateAuthConfig(): { valid: boolean; error?: string } {
  const secret = process.env.API_SECRET;
  
  if (!secret) {
    return { 
      valid: false, 
      error: 'API_SECRET environment variable is required. Please set a secure secret key (min 16 characters).' 
    };
  }
  
  if (secret.length < 16) {
    return { 
      valid: false, 
      error: 'API_SECRET must be at least 16 characters long for security.' 
    };
  }
  
  if (secret === 'admin-secret' || secret === 'password' || secret === '123456') {
    return { 
      valid: false, 
      error: 'API_SECRET is using a common weak password. Please use a strong random string.' 
    };
  }
  
  return { valid: true };
}
