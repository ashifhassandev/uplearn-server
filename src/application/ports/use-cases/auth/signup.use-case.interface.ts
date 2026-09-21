import type {
  SignupInputDTO,
  SignupOutputDTO,
} from "../../../dto/auth/signup.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface ISignupUseCase extends IBaseUseCase<
  SignupInputDTO,
  SignupOutputDTO
> {}