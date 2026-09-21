import type {
  LoginInputDTO,
  LoginOutputDTO,
} from "../../../dto/auth/login.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface ILoginUseCase extends IBaseUseCase<
  LoginInputDTO,
  LoginOutputDTO
> {}