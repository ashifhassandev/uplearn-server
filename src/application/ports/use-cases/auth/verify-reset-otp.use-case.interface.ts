import type {
  VerifyOtpInputDTO,
  VerifyResetOtpOutputDTO,
} from "@/application/dto/auth/verify-otp.dto";

import type { IBaseUseCase } from "../base.use-case.interface";

export interface IVerifyResetOtpUseCase extends IBaseUseCase<
  VerifyOtpInputDTO,
  VerifyResetOtpOutputDTO
> {}