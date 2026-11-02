import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT Secret missing in environment");
      return res.status(500).json({ message: "Authentication configuration error" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - Token expired. Please log in again." });
      }
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    if (!decoded?.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token payload" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};