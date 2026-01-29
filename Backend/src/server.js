import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"

import { connectDB } from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

// CHANGE 1: CORS me localhost ke sath-sath apne Vercel URL ko bhi allow karein
app.use(
    cors({
       origin: process.env.FRONTEND_URL || "http://localhost:5173",
       credentials: true 
    })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Database connection helper (Serverless ke liye zaruri)
let isConnected = false;
const connect = async () => {
    if (isConnected) return;
    await connectDB();
    isConnected = true;
};

// CHANGE 2: Root route for Health Check
app.get("/", (req, res) => res.send("Connectify API is running..."));

// Local Development ke liye listen
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        connect();
    });
}

// CHANGE 3: Vercel ke liye export zaruri hai
export default app;