import type { VerifyOtpInputDTO } from "../../../dto/auth/verify-otp.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IVerifyOtpUseCase extends IBaseUseCase<VerifyOtpInputDTO> {}