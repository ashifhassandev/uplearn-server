import type {
  GoogleAuthInputDTO,
  GoogleAuthOutputDTO,
} from "../../../dto/auth/google-auth.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IGoogleAuthUseCase extends IBaseUseCase<
  GoogleAuthInputDTO,
  GoogleAuthOutputDTO
> {}