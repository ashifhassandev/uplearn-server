import { injectable } from "tsyringe";

import { IPendingRegistrationRepository } from "../../application/ports/repositories/pending-registration.repository.interface";
import { PendingRegistration } from "../../domain/entities/pendingRegistration.entity";
import { PendingRegistrationModel } from "../database/models/pendingRegistration.model";

@injectable()
export class PendingRegistrationRepositoryImpl implements IPendingRegistrationRepository {
  async save(registration: PendingRegistration): Promise<PendingRegistration> {
    // upsert — if the user retries signup with the same email, replace the old record
    const doc = await PendingRegistrationModel.findOneAndUpdate(
      { email: registration.email },
      {
        firstName: registration.firstName,
        lastName: registration.lastName,
        hashedPassword: registration.hashedPassword,
        otpCode: registration.otpCode,
        expiresAt: registration.expiresAt,
      },
      { upsert: true, new: true },
    );

    return new PendingRegistration(
      doc._id.toString(),
      doc.firstName,
      doc.lastName,
      doc.email,
      doc.hashedPassword,
      doc.otpCode,
      doc.expiresAt,
    );
  }

  async findByEmail(email: string): Promise<PendingRegistration | null> {
    const doc = await PendingRegistrationModel.findOne({ email });
    if (!doc) return null;

    return new PendingRegistration(
      doc._id.toString(),
      doc.firstName,
      doc.lastName,
      doc.email,
      doc.hashedPassword,
      doc.otpCode,
      doc.expiresAt,
    );
  }

  async updateOtp(
    email: string,
    data: { otpCode: string; expiresAt: Date },
  ): Promise<void> {
    await PendingRegistrationModel.findOneAndUpdate(
      { email },
      {
        otpCode: data.otpCode,
        expiresAt: data.expiresAt,
      },
    );
  }

  async deleteByEmail(email: string): Promise<void> {
    await PendingRegistrationModel.deleteOne({ email });
  }
}