import type { RefreshTokenOutputDTO } from "../../../dto/auth/refresh-token.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IRefreshTokenUseCase extends IBaseUseCase<
  string,
  RefreshTokenOutputDTO
> {}