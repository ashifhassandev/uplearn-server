export const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB) || 0,

  // Reconnect on failure
  retryStrategy: (times: number): number | null => {
    if (times > 5) {
      return null;
    }
    // Exponential backoff — 200ms, 400ms, 800ms...
    return Math.min(times * 200, 2000);
  },

  // Connection health
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  connectTimeout: 10_000,
  lazyConnect: true,
} as const;