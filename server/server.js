import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";

import DirectMessage from "./models/directMessage.model.js";

dotenv.config();

const PORT = process.env.PORT || 7000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  },
});

// ======================================================
// ONLINE USERS
// ======================================================

const onlineUsers = new Map();

// ======================================================
// SOCKET CONNECTION
// ======================================================

io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id
  );

  // ====================================================
  // JOIN
  // ====================================================

  socket.on("join", (userId) => {
    if (!userId) {
      return;
    }

    const id = userId.toString();

    onlineUsers.set(id, socket.id);

    socket.userId = id;

    console.log(
      `User ${id} joined chat`
    );

    io.emit(
      "online-users",
      Array.from(onlineUsers.keys())
    );
  });

  // ====================================================
  // SEND DIRECT MESSAGE
  // ====================================================

  socket.on(
    "send-direct-message",
    async (data) => {
      try {
        const {
          messageId,
          senderId,
          receiverId,
          message,
        } = data || {};

        if (
          !messageId ||
          !senderId ||
          !receiverId ||
          !message?.trim()
        ) {
          return;
        }

        const receiverSocketId =
          onlineUsers.get(
            receiverId.toString()
          );

        // =================================================
        // RECEIVER ONLINE
        // =================================================

        if (receiverSocketId) {
          // Mark as delivered
          await DirectMessage.findOneAndUpdate(
            {
              _id: messageId,
              sender: senderId,
              receiver: receiverId,
            },
            {
              $set: {
                delivered: true,
              },
            }
          );

          // Send message to receiver
          io.to(receiverSocketId).emit(
            "receive-direct-message",
            {
              _id: messageId,

              senderId:
                senderId.toString(),

              receiverId:
                receiverId.toString(),

              message:
                message.trim(),

              delivered: true,

              read: false,

              createdAt:
                new Date(),
            }
          );

          // Tell sender that message is delivered
          socket.emit(
            "message-delivered",
            {
              messageId:
                messageId.toString(),

              receiverId:
                receiverId.toString(),
            }
          );
        }
      } catch (error) {
        console.error(
          "Socket message error:",
          error.message
        );
      }
    }
  );

  // ====================================================
  // MESSAGE DELIVERED
  // ====================================================

  socket.on(
    "message-delivered",
    async (data) => {
      try {
        const {
          messageId,
          senderId,
          receiverId,
        } = data || {};

        if (!messageId) {
          return;
        }

        await DirectMessage.findByIdAndUpdate(
          messageId,
          {
            $set: {
              delivered: true,
            },
          }
        );

        const senderSocketId =
          senderId
            ? onlineUsers.get(
                senderId.toString()
              )
            : null;

        if (senderSocketId) {
          io.to(senderSocketId).emit(
            "message-delivered",
            {
              messageId:
                messageId.toString(),

              receiverId:
                receiverId?.toString(),
            }
          );
        }
      } catch (error) {
        console.error(
          "Delivery status error:",
          error.message
        );
      }
    }
  );

  // ====================================================
  // MESSAGES READ / SEEN
  // ====================================================

  socket.on(
    "messages-read",
    async (data) => {
      try {
        const {
          senderId,
          receiverId,
        } = data || {};

        if (!senderId || !receiverId) {
          return;
        }

        // Current receiver ne sender ke messages read kiye
        await DirectMessage.updateMany(
          {
            sender: senderId,
            receiver: receiverId,
            read: false,
          },
          {
            $set: {
              delivered: true,
              read: true,
            },
          }
        );

        // Original sender ko blue tick update bhejo
        const senderSocketId =
          onlineUsers.get(
            senderId.toString()
          );

        if (senderSocketId) {
          io.to(senderSocketId).emit(
            "messages-read",
            {
              senderId:
                senderId.toString(),

              receiverId:
                receiverId.toString(),
            }
          );
        }
      } catch (error) {
        console.error(
          "Read status error:",
          error.message
        );
      }
    }
  );

  // ====================================================
  // DISCONNECT
  // ====================================================

  socket.on(
    "disconnect",
    () => {
      if (socket.userId) {
        onlineUsers.delete(
          socket.userId
        );

        io.emit(
          "online-users",
          Array.from(
            onlineUsers.keys()
          )
        );
      }

      console.log(
        "Socket disconnected:",
        socket.id
      );
    }
  );
});

// ======================================================
// START SERVER
// ======================================================

const startServer = async () => {
  try {
    await connectDB();

    server.listen(
      PORT,
      () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );

        console.log(
          "Socket.IO server is ready"
        );
      }
    );
  } catch (error) {
    console.error(
      `Server failed: ${error.message}`
    );

    process.exit(1);
  }
};

startServer();