import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';

let redisClient;

function createStore(prefix) {
  if (!redisClient) {
    return undefined;
  }

  return new RedisStore({
    prefix,
    sendCommand: (...args) => redisClient.sendCommand(args),
  });
}

export async function initializeRateLimiters() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('REDIS_URL is required in production for shared rate limiting.');
    }
    console.warn('REDIS_URL is not set; using per-process rate limits for local development.');
  } else {
    redisClient = createClient({ url: redisUrl });
    redisClient.on('error', (error) => {
      console.error('Rate-limit Redis connection error:', error);
    });
    await redisClient.connect();
  }

  const createLimiter = (prefix, limit) => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(prefix),
    handler: (_req, res) => {
      res.status(429).json({ message: 'Too many requests. Please try again later.' });
    },
  });

  return {
    api: createLimiter('rate-limit:express:api:', 100),
    auth: createLimiter('rate-limit:express:auth:', 10),
  };
}
