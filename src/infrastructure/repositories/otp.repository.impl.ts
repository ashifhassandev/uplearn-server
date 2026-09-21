import { injectable } from "tsyringe";

import { IOtpRepository } from "../../application/ports/repositories/otp.repository.interface";
import { Otp } from "../../domain/entities/otp.entity";
import { OtpModel } from "../database/models/otp.model";

@injectable()
export class OtpRepositoryImpl implements IOtpRepository {
  async save(otp: Otp): Promise<void> {
    await OtpModel.findOneAndUpdate(
      { userId: otp.userId },
      { code: otp.code, expiresAt: otp.expiresAt },
      { upsert: true, new: true },
    );
  }

  async findByUserId(userId: string): Promise<Otp | null> {
    const doc = await OtpModel.findOne({ userId });
    if (!doc) return null;
    
    return new Otp(doc.userId, doc.code, doc.expiresAt);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await OtpModel.deleteOne({ userId });
  }
}