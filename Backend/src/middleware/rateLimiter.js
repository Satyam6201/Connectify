import { redis } from "../lib/redis.js";

// In-memory fallback if Redis is temporarily unavailable
const memoryStore = new Map();

/**
 * Reusable Rate Limiter Middleware
 * @param {Object} options
 * @param {number} options.windowSeconds - Duration of rate limit window in seconds
 * @param {number} options.maxRequests - Maximum allowed requests in window
 * @param {string} options.message - Error response message
 */
export const rateLimit = ({
    windowSeconds = 60,
    maxRequests = 100,
    message = "Too many requests, please try again later."
} = {}) => {
    return async (req, res, next) => {
        try {
            // Identify client by IP address or authenticated user ID
            const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "anonymous";
            const identifier = req.user?._id?.toString() || clientIp;
            const key = `ratelimit:${identifier}:${req.baseUrl || ""}${req.path}`;

            // Check if Redis is ready
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

            // Fallback to In-Memory rate limiting if Redis isn't active
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
            // Fail open so service continues working smoothly
            next();
        }
    };
};

// General API rate limiter (100 requests per 1 minute)
export const apiLimiter = rateLimit({
    windowSeconds: 60,
    maxRequests: 100,
    message: "Too many requests to the API. Please wait a minute and try again."
});

// Strict rate limiter for Auth routes (10 attempts per 15 minutes)
export const authLimiter = rateLimit({
    windowSeconds: 15 * 60,
    maxRequests: 10,
    message: "Too many login/signup attempts from this IP. Please try again after 15 minutes."
});
