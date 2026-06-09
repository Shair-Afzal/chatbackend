import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    text: {
      type: String,
      trim: true,
      default: "",
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    fileUrl: {
      type: String,
      default: "",
    },

    isSeen: {
      type: Boolean,
      default: false,
    },

    seenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", MessageSchema);