import express from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getMyNotifications
);

router.patch(
  "/:notificationId/read",
  authMiddleware,
  markNotificationAsRead
);

export default router;