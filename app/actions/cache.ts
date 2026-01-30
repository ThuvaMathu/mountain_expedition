'use server';

import { deleteCache, deleteCachePattern } from '@/lib/redis';

/**
 * Server action to invalidate specific cache keys
 * Call this from admin panel after updating content
 */
export async function invalidateCache(type: 'stats' | 'testimonials' | 'success-stories' | 'all') {
  try {
    switch (type) {
      case 'stats':
        await deleteCachePattern('stats:*');
        break;
      case 'testimonials':
        await deleteCachePattern('testimonials:*');
        break;
      case 'success-stories':
        await deleteCachePattern('success-stories:*');
        break;
      case 'all':
        await Promise.all([
          deleteCachePattern('stats:*'),
          deleteCachePattern('testimonials:*'),
          deleteCachePattern('success-stories:*'),
        ]);
        break;
    }
    
    return { success: true, message: `Cache invalidated for: ${type}` };
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return { success: false, message: 'Failed to invalidate cache' };
  }
}

/**
 * Invalidate cache for a specific key
 */
export async function invalidateCacheKey(key: string) {
  try {
    await deleteCache(key);
    return { success: true, message: `Cache key deleted: ${key}` };
  } catch (error) {
    console.error('Cache key deletion error:', error);
    return { success: false, message: 'Failed to delete cache key' };
  }
}
