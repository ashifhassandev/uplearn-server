import mongoose from "mongoose";

const InstructorDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, default: null },
    headline: { type: String, default: null },
    education: { type: [mongoose.Schema.Types.Mixed], default: [] },
    experiences: { type: [mongoose.Schema.Types.Mixed], default: [] },
    certificates: { type: [mongoose.Schema.Types.Mixed], default: [] },
    skills: { type: [String], default: [] },
    links: { type: mongoose.Schema.Types.Mixed, default: {} },
    isApprovedByAdmin: { type: Boolean, default: false },
    approvedByAdminAt: { type: Date, default: null },
    approvedByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isPlatformVerified: { type: Boolean, default: false },
    platformVerifiedAt: { type: Date, default: null },
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true },
);

InstructorDetailsSchema.index({ applicationStatus: 1 });
InstructorDetailsSchema.index({ isApprovedByAdmin: 1 });

export const InstructorDetailsModel = mongoose.model(
  "InstructorDetails",
  InstructorDetailsSchema,
);