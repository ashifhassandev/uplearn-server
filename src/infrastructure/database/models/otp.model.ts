import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const OtpModel = mongoose.model("Otp", OtpSchema);