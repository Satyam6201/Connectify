import Redis from "ioredis";
import "dotenv/config";

const redisUrl = process.env.REDIS_URI;

export const redis = redisUrl
    ? new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          lazyConnect: true,
      })
    : { status: "disconnected" };

if (redisUrl) {
    redis.on("connect", () => {
        console.log("Redis Connected Successfully");
    });

    redis.on("error", (error) => {
        console.warn("Redis Connection Warning:", error.message);
    });
}

export const connectRedis = async () => {
    if (!redisUrl) {
        console.log("No REDIS_URI configured. Rate limiting is running with in-memory fallback.");
        return;
    }
    try {
        await redis.connect();
    } catch (error) {
        console.warn("Could not connect to Redis, running with in-memory fallback:", error.message);
    }
};
