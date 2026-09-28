import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
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

// HTTP response gzip compression
app.use(compression());

app.use(
    cors({
        origin: process.env.NODE_ENV === "production" ? (process.env.CLIENT_URL || true) : "http://localhost:5173",
        credentials: true // allow frontend to send cookies
    })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Apply global rate limiting to all /api routes
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../../Frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../../Frontend/dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    connectRedis();
});
