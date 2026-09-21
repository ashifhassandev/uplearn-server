import nodemailer from "nodemailer";
import { injectable } from "tsyringe";

import { IEmailService } from "../../application/ports/services/email.service.interface";

@injectable()
export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SEND_OTP_EMAIL,
      pass: process.env.SEND_OTP_EMAIL_PASS,
    },
  });

  async sendOtp(to: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"UpLearn" <${process.env.SEND_OTP_EMAIL}>`,
      to,
      subject: "Your verification code",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
          <h2>Verify your email</h2>
          <p>Your one-time verification code is:</p>
          <h1 style="letter-spacing: 8px; color: #22c55e;">${otp}</h1>
          <p>This code expires in <strong>1 minute</strong>.</p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  }
}