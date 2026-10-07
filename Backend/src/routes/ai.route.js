import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  chatWithAIPartner,
  checkGrammarAndTone,
  translateMessage,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/translate", translateMessage);
router.post("/grammar-check", checkGrammarAndTone);
router.post("/partner-chat", chatWithAIPartner);

export default router;
