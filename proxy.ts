import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limit configuration
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  '/api/contact': { maxRequests: 5, windowMs: 60 * 1000 }, // 5 requests per minute
  '/api/chat': { maxRequests: 30, windowMs: 60 * 1000 }, // 30 requests per minute
};

// In-memory store for rate limiting (resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Clean up expired entry if it exists
  if (record && now > record.resetTime) {
    rateLimitStore.delete(key);
  }

  const currentRecord = rateLimitStore.get(key);

  if (!currentRecord) {
    // Create new window
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (currentRecord.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: currentRecord.resetTime };
  }

  // Increment count
  currentRecord.count++;
  rateLimitStore.set(key, currentRecord);
  return {
    allowed: true,
    remaining: maxRequests - currentRecord.count,
    resetTime: currentRecord.resetTime,
  };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this path needs rate limiting
  const rateLimitConfig = Object.entries(RATE_LIMITS).find(([path]) =>
    pathname.startsWith(path)
  );

  if (rateLimitConfig) {
    const [path, config] = rateLimitConfig;
    const clientIP = getClientIP(request);
    const rateLimitKey = `${path}:${clientIP}`;

    const { allowed, remaining, resetTime } = checkRateLimit(
      rateLimitKey,
      config.maxRequests,
      config.windowMs
    );

    if (!allowed) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set(
      'X-RateLimit-Reset',
      String(Math.ceil(resetTime / 1000))
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/contact/:path*', '/api/chat/:path*'],
};
