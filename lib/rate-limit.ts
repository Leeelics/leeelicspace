import { kv } from "@vercel/kv";
import { logger } from "./logger";

interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Default rate limit configurations
export const RATE_LIMITS = {
  // Strict limits for write operations
  write: { maxRequests: 10, windowSeconds: 60 },
  // Moderate limits for read operations
  read: { maxRequests: 100, windowSeconds: 60 },
  // Very strict for authentication attempts
  auth: { maxRequests: 5, windowSeconds: 60 },
} as const;

/**
 * Check if the request should be rate limited
 * Uses sliding window algorithm with Redis/KV
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.read,
): Promise<RateLimitResult> {
  const { maxRequests, windowSeconds } = config;
  const key = `rate_limit:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - windowSeconds;

  try {
    // If KV is not configured, allow the request (fail open)
    if (!process.env.KV_REST_API_URL) {
      logger.warn("KV not configured, skipping rate limit check");
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests,
        reset: now + windowSeconds,
      };
    }

    // Clean old entries and add current request in a pipeline
    const pipeline = kv.pipeline();

    // Remove entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Add current request
    pipeline.zadd(key, { score: now, member: `${now}:${Math.random()}` });

    // Count requests in current window
    pipeline.zcard(key);

    // Set expiry on the key
    pipeline.expire(key, windowSeconds);

    const results = await pipeline.exec();
    const currentCount = results[2] as number;

    const remaining = Math.max(0, maxRequests - currentCount);
    const success = currentCount <= maxRequests;

    return {
      success,
      limit: maxRequests,
      remaining,
      reset: now + windowSeconds,
    };
  } catch (error) {
    logger.error(
      "Rate limit check failed",
      error instanceof Error ? error : new Error(String(error)),
    );
    // Fail open - allow request if rate limiting fails
    return {
      success: true,
      limit: maxRequests,
      remaining: 1,
      reset: now + windowSeconds,
    };
  }
}

/**
 * Get client identifier from request
 * Uses IP address as primary identifier
 */
export function getClientIdentifier(request: Request): string {
  // Get IP from various headers (Vercel specific)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    // Get first IP from the list
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a default identifier
  return "unknown";
}

/**
 * Create a rate-limited API handler wrapper
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  config: RateLimitConfig = RATE_LIMITS.read,
) {
  return async (request: Request): Promise<Response> => {
    const identifier = getClientIdentifier(request);
    const result = await rateLimit(identifier, config);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: result.reset,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.reset),
            "Retry-After": String(result.reset - Math.floor(Date.now() / 1000)),
          },
        },
      );
    }

    // Execute the handler
    const response = await handler(request);

    // Add rate limit headers to successful responses
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    newResponse.headers.set("X-RateLimit-Limit", String(result.limit));
    newResponse.headers.set("X-RateLimit-Remaining", String(result.remaining));
    newResponse.headers.set("X-RateLimit-Reset", String(result.reset));

    return newResponse;
  };
}

/**
 * Check rate limit for API routes (Next.js specific)
 */
export async function checkRateLimit(
  request: Request,
  config: RateLimitConfig = RATE_LIMITS.read,
): Promise<{ allowed: boolean; result?: RateLimitResult }> {
  const identifier = getClientIdentifier(request);
  const result = await rateLimit(identifier, config);

  return {
    allowed: result.success,
    result: result.success ? result : undefined,
  };
}

/**
 * Get rate limit headers for successful responses
 */
export function getRateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  };
}
