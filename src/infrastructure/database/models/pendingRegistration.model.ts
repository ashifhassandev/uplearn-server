import mongoose from "mongoose";

const PendingRegistrationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    otpCode: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// TTL index — MongoDB automatically deletes documents 1 hour after expiresAt
PendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export const PendingRegistrationModel = mongoose.model(
  "PendingRegistration",
  PendingRegistrationSchema,
);