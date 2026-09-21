import mongoose from "mongoose";

const StudentDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    coins: {
      type: Number,
      default: 0,
      min: 0,
    },
    badges: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Badge",
      default: [],
    },
    isPlatformVerified: {
      type: Boolean,
      default: false,
    },
    platformVerifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const StudentDetailsModel = mongoose.model(
  "StudentDetails",
  StudentDetailsSchema,
);