import type { PendingRegistration } from "../../../domain/entities/pendingRegistration.entity";

export interface IPendingRegistrationRepository {
  save(registration: PendingRegistration): Promise<PendingRegistration>;
  findByEmail(email: string): Promise<PendingRegistration | null>;
  updateOtp(
    email: string,
    data: { otpCode: string; expiresAt: Date },
  ): Promise<void>;
  deleteByEmail(email: string): Promise<void>;
}