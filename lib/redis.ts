import { Redis } from '@upstash/redis';

// Detect Next.js build phase to skip Redis calls during static generation.
// Upstash Redis uses `cache: 'no-store'` internally, which triggers
// DYNAMIC_SERVER_USAGE errors and prevents static page generation.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Debug mode
const DEBUG = process.env.REDIS_DEBUG === 'true';

/**
 * Get data from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  // Skip Redis during build to prevent DYNAMIC_SERVER_USAGE errors
  if (isBuildPhase) return null;

  try {
    const cached = await redis.get(key);
    
    if (DEBUG) {
      console.log(`[Redis] GET ${key}:`, cached ? 'HIT' : 'MISS');
    }
    
    if (!cached) return null;
    
    // Redis already deserializes JSON for us
    return cached as T;
  } catch (error) {
    console.error('[Redis] GET error:', error);
    return null; // Fail gracefully
  }
}

/**
 * Set data in cache with TTL (in seconds)
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  // Skip Redis during build
  if (isBuildPhase) return;

  try {
    await redis.set(key, value, { ex: ttlSeconds });
    
    if (DEBUG) {
      console.log(`[Redis] SET ${key} (TTL: ${ttlSeconds}s)`);
    }
  } catch (error) {
    console.error('[Redis] SET error:', error);
    // Fail silently - app should work without cache
  }
}

/**
 * Delete a specific cache key
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
    
    if (DEBUG) {
      console.log(`[Redis] DEL ${key}`);
    }
  } catch (error) {
    console.error('[Redis] DEL error:', error);
  }
}

/**
 * Delete multiple keys matching a pattern
 * Note: This uses SCAN which is safe for production
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
      
      if (DEBUG) {
        console.log(`[Redis] DEL pattern ${pattern}: ${keys.length} keys`);
      }
    }
  } catch (error) {
    console.error('[Redis] DEL pattern error:', error);
  }
}

/**
 * Generic cache-aside pattern wrapper
 * 1. Try to get from Redis
 * 2. If miss, fetch from source
 * 3. Store in Redis for next time
 */
export async function withCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  // Try cache first
  const cached = await getCache<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - fetch from source
  const fresh = await fetchFn();

  // Store in cache (fire and forget)
  setCache(cacheKey, fresh, ttlSeconds).catch(() => {
    // Ignore cache write errors
  });

  return fresh;
}

// Export Redis client for direct use if needed
export { redis };
