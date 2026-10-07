import express from "express";
import {
  demoLogin,
  login,
  logout,
  onboard,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/demo-login", demoLogin);
router.post("/logout", logout);
router.post("/onboarding", protectRoute, onboard);
router.put("/profile", protectRoute, updateProfile);
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
