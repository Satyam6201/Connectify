import Redis from "ioredis";
import "dotenv/config";

const redisUrl = process.env.REDIS_URI || "redis://localhost:6379";

export const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
});

redis.on("connect", () => {
    console.log("Redis Connected Successfully");
});

redis.on("error", (error) => {
    console.log("Redis Connection Error:", error.message);
});

export const connectRedis = async () => {
    try {
        await redis.connect();
    } catch (error) {
        console.log("Error connecting to Redis:", error.message);
    }
};
