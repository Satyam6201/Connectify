import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import {
  chatWithAI,
  checkGrammarAndTone,
  generateImage,
  translateMessage,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.use(protectRoute);
router.use(aiLimiter);

router.post("/chat", chatWithAI);
router.post("/generate-image", generateImage);
router.post("/translate", translateMessage);
router.post("/grammar-check", checkGrammarAndTone);

export default router;
