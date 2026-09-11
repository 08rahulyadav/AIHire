import express from "express";
import {
  chatWithAI,
  getChatHistory,
  clearChatHistory,
} from "../controllers/ai.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/history", authMiddleware, getChatHistory);

router.post("/chat", authMiddleware, chatWithAI);

router.delete("/history", authMiddleware, clearChatHistory);

export default router;