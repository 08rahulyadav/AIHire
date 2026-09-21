import mongoose from "mongoose";

const directMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Message receiver ke socket/device tak pahunch gaya
    delivered: {
      type: Boolean,
      default: false,
    },

    // Receiver ne chat open karke message dekh liya
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DirectMessage = mongoose.model(
  "DirectMessage",
  directMessageSchema
);

export default DirectMessage;