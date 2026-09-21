import DirectMessage from "../models/directMessage.model.js";
import User from "../models/user.model.js";
import Application from "../models/application.model.js";

// =====================================================
// CHECK WHETHER TWO USERS CAN CHAT
// =====================================================

const canUsersChat = async (senderId, receiverId) => {
  const sender = await User.findById(senderId).select("role");
  const receiver = await User.findById(receiverId).select("role");

  if (!sender || !receiver) {
    return false;
  }

  // Candidate -> Recruiter
  if (
    sender.role === "candidate" &&
    receiver.role === "recruiter"
  ) {
    const application = await Application.findOne({
      candidate: senderId,
      recruiter: receiverId,
    });

    return !!application;
  }

  // Recruiter -> Candidate
  if (
    sender.role === "recruiter" &&
    receiver.role === "candidate"
  ) {
    const application = await Application.findOne({
      candidate: receiverId,
      recruiter: senderId,
    });

    return !!application;
  }

  return false;
};

// =====================================================
// SEND DIRECT MESSAGE
// =====================================================

const sendDirectMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;

    const { receiverId, message } = req.body;

    // Validation
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Cannot message yourself
    if (
      senderId.toString() === receiverId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot message yourself",
      });
    }

    // Check chat permission
    const allowed = await canUsersChat(
      senderId,
      receiverId
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message:
          "You can only chat with users connected through an application",
      });
    }

    // Create message
    const newMessage = await DirectMessage.create({
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),

      // New message is unread initially
      read: false,
    });

    // Populate users
    const populatedMessage =
      await DirectMessage.findById(newMessage._id)
        .populate(
          "sender",
          "name email role"
        )
        .populate(
          "receiver",
          "name email role"
        );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET CHAT HISTORY
// =====================================================

const getDirectChatHistory = async (
  req,
  res,
  next
) => {
  try {
    const currentUserId = req.user._id;

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check permission
    const allowed = await canUsersChat(
      currentUserId,
      userId
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to access this conversation",
      });
    }

    // =================================================
    // FIRST MARK RECEIVED MESSAGES AS READ
    // =================================================

    await DirectMessage.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    // =================================================
    // THEN GET CHAT HISTORY
    // =================================================

    const messages =
      await DirectMessage.find({
        $or: [
          {
            sender: currentUserId,
            receiver: userId,
          },
          {
            sender: userId,
            receiver: currentUserId,
          },
        ],
      })
        .populate(
          "sender",
          "name email role"
        )
        .populate(
          "receiver",
          "name email role"
        )
        .sort({
          createdAt: 1,
        });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// MARK MESSAGES AS READ
// =====================================================

const markMessagesAsRead = async (
  req,
  res,
  next
) => {
  try {
    const currentUserId = req.user._id;

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check permission
    const allowed = await canUsersChat(
      currentUserId,
      userId
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to access this conversation",
      });
    }

    // Mark all messages received from userId as read
    const result =
      await DirectMessage.updateMany(
        {
          sender: userId,
          receiver: currentUserId,
          read: false,
        },
        {
          $set: {
            read: true,
          },
        }
      );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL CONVERSATIONS
// =====================================================

const getDirectConversations = async (
  req,
  res,
  next
) => {
  try {
    const currentUserId = req.user._id;

    const messages =
      await DirectMessage.find({
        $or: [
          {
            sender: currentUserId,
          },
          {
            receiver: currentUserId,
          },
        ],
      })
        .populate(
          "sender",
          "name email role"
        )
        .populate(
          "receiver",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    const conversations = [];

    const conversationUsers = new Set();

    for (const message of messages) {
      const senderId =
        message.sender?._id?.toString();

      const receiverId =
        message.receiver?._id?.toString();

      const currentId =
        currentUserId.toString();

      const otherUser =
        senderId === currentId
          ? message.receiver
          : message.sender;

      if (!otherUser?._id) {
        continue;
      }

      const otherUserId =
        otherUser._id.toString();

      // Only latest message per user
      if (
        conversationUsers.has(otherUserId)
      ) {
        continue;
      }

      conversationUsers.add(otherUserId);

      // =================================================
      // UNREAD COUNT
      // =================================================

      const unreadCount =
        await DirectMessage.countDocuments({
          sender: otherUser._id,
          receiver: currentUserId,
          read: false,
        });

      conversations.push({
        user: otherUser,

        lastMessage: message,

        unreadCount,
      });
    }

    return res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

export {
  sendDirectMessage,
  getDirectChatHistory,
  getDirectConversations,
  markMessagesAsRead,
};