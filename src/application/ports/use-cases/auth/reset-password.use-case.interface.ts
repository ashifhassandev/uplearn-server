import type { ResetPasswordInputDTO } from "../../../dto/auth/reset-password.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IResetPasswordUseCase extends IBaseUseCase<ResetPasswordInputDTO> {}