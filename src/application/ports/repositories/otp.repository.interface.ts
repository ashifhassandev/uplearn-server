import type { Otp } from "../../../domain/entities/otp.entity";
import type { IUserOwnedRepository } from "./base.repository.interface";

export interface IOtpRepository extends IUserOwnedRepository<Otp> {
  save(otp: Otp): Promise<void>;
}