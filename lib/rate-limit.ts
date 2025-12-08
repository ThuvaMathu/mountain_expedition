/**
 * Simple in-memory rate limiting
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Check if a request should be rate limited
 * Returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute default
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // If no entry or expired, create new one
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime,
    };
  }

  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit for order creation
 * Stricter limits: 5 requests per 5 minutes per user
 */
export function checkOrderCreationRateLimit(userId: string) {
  return checkRateLimit(`order:${userId}`, 5, 5 * 60 * 1000);
}

/**
 * Rate limit by IP address
 * Prevents abuse from same IP: 20 requests per minute
 */
export function checkIpRateLimit(ipAddress: string) {
  return checkRateLimit(`ip:${ipAddress}`, 20, 60 * 1000);
}

/**
 * Rate limit for payment verification
 * Very strict: 3 attempts per minute per order
 */
export function checkPaymentVerificationRateLimit(orderId: string) {
  return checkRateLimit(`verify:${orderId}`, 3, 60 * 1000);
}
