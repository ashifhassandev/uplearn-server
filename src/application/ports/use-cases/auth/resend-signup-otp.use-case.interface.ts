import type {
  ForgotPasswordInputDTO,
  ForgotPasswordOutputDTO,
} from "../../../dto/auth/forgot-password.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IResendSignupOtpUseCase extends IBaseUseCase<
  ForgotPasswordInputDTO,
  ForgotPasswordOutputDTO
> {}