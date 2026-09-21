import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    token: { type: String, required: true },
  },
  { timestamps: true },
);

export const RefreshTokenModel = mongoose.model(
  "RefreshToken",
  RefreshTokenSchema,
);