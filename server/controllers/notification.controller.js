import Notification from "../models/notification.model.js";

// Get my notifications
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    }).sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// Mark one notification as read
const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};