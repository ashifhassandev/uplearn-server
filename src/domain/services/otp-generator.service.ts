import { OTP_CONSTANTS } from "@/shared/constants/otp.constants";

import { Otp } from "../entities/otp.entity";

export class OtpGeneratorService {
  // Forgot Password
  static generate(userId: string): Otp {
    const { code, expiresAt } = OtpGeneratorService.generateRaw();
    return new Otp(userId, code, expiresAt);
  }

  // PendingRegistration
  static generateRaw(): { code: string; expiresAt: Date } {
    const min = Math.pow(10, OTP_CONSTANTS.DIGITS - 1);
    const max = Math.pow(10, OTP_CONSTANTS.DIGITS) - 1;
    const code = Math.floor(min + Math.random() * (max - min + 1)).toString();
    const expiresAt = new Date(Date.now() + OTP_CONSTANTS.EXPIRY_MINUTES * 60 * 1000);
    return { code, expiresAt };
  }
}