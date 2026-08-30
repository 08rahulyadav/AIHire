import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model(
  "ChatMessage",
  chatMessageSchema
);

export default ChatMessage;