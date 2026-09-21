import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "tutor", "student"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ lastLogin: 1 });

export const UserModel = mongoose.model("User", UserSchema);