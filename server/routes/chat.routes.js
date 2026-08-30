import express from "express";

import {
  sendMessage,
  getChatHistory,
} from "../controllers/chat.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Send message
router.post("/send", authMiddleware, sendMessage);

// Get chat history
router.get("/history", authMiddleware, getChatHistory);

export default router;