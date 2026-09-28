import Redis from "ioredis";
import "dotenv/config";

const rawRedisUrl = process.env.REDIS_URI;

// Only enable Redis if REDIS_URI is set, non-empty, and not localhost in production
const isRedisConfigured =
    Boolean(rawRedisUrl) &&
    rawRedisUrl.trim() !== "" &&
    !(process.env.NODE_ENV === "production" && rawRedisUrl.includes("localhost"));

export const redis = isRedisConfigured
    ? new Redis(rawRedisUrl, {
          maxRetriesPerRequest: 1,
          retryStrategy(times) {
              if (times > 2) {
                  console.log("Redis unavailable. Stopped retrying, falling back to in-memory store.");
                  return null; // Stop reconnecting
              }
              return 1000;
          },
          lazyConnect: true,
          connectTimeout: 4000,
          enableOfflineQueue: false,
      })
    : {
          status: "disconnected",
          get: async () => null,
          set: async () => null,
          del: async () => null,
          incr: async () => 1,
          expire: async () => 1,
          ttl: async () => -1,
      };

if (isRedisConfigured && typeof redis.on === "function") {
    redis.on("connect", () => {
        console.log("Redis Connected Successfully");
    });

    redis.on("error", (error) => {
        // Log once cleanly without crashing
        console.warn("Redis Notice:", error.message);
    });
}

export const connectRedis = async () => {
    if (!isRedisConfigured) {
        console.log("Redis not configured. Running rate limiting with in-memory store.");
        return;
    }
    try {
        await redis.connect();
    } catch (error) {
        console.warn("Redis connection skipped:", error.message);
    }
};
