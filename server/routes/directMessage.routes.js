import express from "express";

import {
  sendDirectMessage,
  getDirectChatHistory,
  getDirectConversations,
  markMessagesAsRead,
} from "../controllers/directMessage.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// SEND MESSAGE
// POST /api/v1/direct-chat/send
// =====================================================

router.post(
  "/send",
  authMiddleware,
  sendDirectMessage
);

// =====================================================
// GET CONVERSATIONS
// GET /api/v1/direct-chat/conversations
// =====================================================

router.get(
  "/conversations",
  authMiddleware,
  getDirectConversations
);

// =====================================================
// MARK MESSAGES READ
// POST /api/v1/direct-chat/read/:userId
// =====================================================

router.post(
  "/read/:userId",
  authMiddleware,
  markMessagesAsRead
);

// =====================================================
// GET CHAT HISTORY
// GET /api/v1/direct-chat/history/:userId
// =====================================================

router.get(
  "/history/:userId",
  authMiddleware,
  getDirectChatHistory
);

export default router;