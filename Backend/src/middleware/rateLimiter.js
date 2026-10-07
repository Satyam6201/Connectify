import { redis } from "../lib/redis.js";

const memoryStore = new Map();

export const rateLimit = ({
  windowSeconds = 60,
  maxRequests = 100,
  message = "Too many requests, please try again later.",
} = {}) => {
  return async (req, res, next) => {
    try {
      const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "anonymous";
      const identifier = req.user?._id?.toString() || clientIp;
      const key = `ratelimit:${identifier}:${req.baseUrl || ""}${req.path}`;

      if (redis.status === "ready") {
        const currentRequests = await redis.incr(key);

        if (currentRequests === 1) {
          await redis.expire(key, windowSeconds);
        }

        const ttl = await redis.ttl(key);

        res.setHeader("X-RateLimit-Limit", maxRequests);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - currentRequests));
        res.setHeader("X-RateLimit-Reset", ttl > 0 ? ttl : windowSeconds);

        if (currentRequests > maxRequests) {
          return res.status(429).json({
            message,
            retryAfterSeconds: ttl > 0 ? ttl : windowSeconds,
          });
        }

        return next();
      }

      const now = Date.now();
      const record = memoryStore.get(key) || { count: 0, resetTime: now + windowSeconds * 1000 };

      if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + windowSeconds * 1000;
      } else {
        record.count += 1;
      }

      memoryStore.set(key, record);

      const remainingSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - record.count));
      res.setHeader("X-RateLimit-Reset", remainingSeconds);

      if (record.count > maxRequests) {
        return res.status(429).json({
          message,
          retryAfterSeconds: remainingSeconds,
        });
      }

      next();
    } catch (error) {
      console.error("Rate limiter error:", error.message);
      next();
    }
  };
};

export const apiLimiter = rateLimit({
  windowSeconds: 60,
  maxRequests: 100,
  message: "Too many requests to the API. Please wait a minute and try again.",
});

export const authLimiter = rateLimit({
  windowSeconds: 15 * 60,
  maxRequests: 10,
  message: "Too many login/signup attempts. Please try again after 15 minutes.",
});
