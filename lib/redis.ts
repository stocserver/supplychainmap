import Redis from 'ioredis';

// Redis connection with graceful error handling
// If Redis is unavailable, operations will return null and app falls back to Supabase

const REDIS_URL = process.env.REDIS_URL || 'redis://default:HDvuHCKtZWhSprrdZYCzbU7mUABaMG7V@redis-10654.c74.us-east-1-4.ec2.cloud.redislabs.com:10654';

const redis = new Redis(REDIS_URL, {
    // Don't crash if Redis is unreachable - fail gracefully
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
        if (times > 3) {
            console.warn('[Redis] Max retries reached, giving up');
            return null; // Stop retrying
        }
        return Math.min(times * 100, 2000);
    },
    enableOfflineQueue: false, // Don't queue commands when offline
    connectTimeout: 5000, // 5 second connection timeout
    lazyConnect: true, // Don't connect immediately
});

// Suppress unhandled error events - log them instead
redis.on('error', (err) => {
    console.warn('[Redis] Connection error (will fall back to Supabase):', err.message);
});

redis.on('connect', () => {
    console.log('[Redis] Connected successfully');
});

export default redis;
