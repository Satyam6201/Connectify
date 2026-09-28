import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import compression from "compression";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";
import { connectRedis } from "./lib/redis.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Enable trust proxy for Render / reverse proxies (needed for secure cookies and rate limiting)
app.set("trust proxy", 1);

// HTTP response gzip compression
app.use(compression());

// CORS configuration supporting single URL, comma-separated URLs, and Vercel previews
const rawClientUrls = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : [];
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    ...rawClientUrls
].map(origin => origin.trim().replace(/\/+$/, "")).filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, server-to-server)
            if (!origin) return callback(null, true);

            const normalizedOrigin = origin.replace(/\/+$/, "");

            // Allow defined origins, or all origins if in development or CLIENT_URL not restricted
            if (
                allowedOrigins.includes(normalizedOrigin) ||
                (process.env.NODE_ENV !== "production") ||
                (normalizedOrigin.endsWith(".vercel.app") && (!process.env.CLIENT_URL || process.env.CLIENT_URL === "*"))
            ) {
                return callback(null, true);
            }

            // In production, if CLIENT_URL is defined, check allowed origins
            if (allowedOrigins.length > 0) {
                if (allowedOrigins.includes(normalizedOrigin)) {
                    return callback(null, true);
                }
                // Also support vercel preview domains if FRONTEND is on vercel
                if (normalizedOrigin.endsWith(".vercel.app")) {
                    return callback(null, true);
                }
                return callback(new Error(`CORS policy error: Origin ${origin} not allowed`));
            }

            return callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Health check endpoint for Render monitoring
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Apply global rate limiting to all /api routes
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// If running in a monolith container / production build where frontend dist exists
const distPath = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.status(200).json({
            status: "active",
            message: "Connectify API is running successfully on Render."
        });
    });

    app.use("*", (req, res) => {
        res.status(404).json({
            error: "Not Found",
            message: `Route ${req.originalUrl} not found on this API server.`
        });
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    connectRedis();
});
