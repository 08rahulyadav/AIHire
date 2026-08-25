import express from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notification.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications
router.get(
  "/",
  authMiddleware,
  getMyNotifications
);

// Mark all notifications as read
router.patch(
  "/read-all",
  authMiddleware,
  markAllNotificationsAsRead
);

// Mark one notification as read
router.patch(
  "/:notificationId/read",
  authMiddleware,
  markNotificationAsRead
);

export default router;