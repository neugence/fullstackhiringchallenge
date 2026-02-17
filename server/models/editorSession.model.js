import mongoose from "mongoose";

const editorSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    lastSavedAt: {
      type: Date,
      default: Date.now,
    },

    saveStatus: {
      type: String,
      enum: ["saving", "saved", "error"],
      default: "saved",
    },

    aiLastUsedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const EditorSession = mongoose.model(
  "EditorSession",
  editorSessionSchema
);
