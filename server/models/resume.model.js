import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
      enum: ["pdf"],
      lowercase: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    aiSummary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model(
  "Resume",
  resumeSchema
);

export default Resume;