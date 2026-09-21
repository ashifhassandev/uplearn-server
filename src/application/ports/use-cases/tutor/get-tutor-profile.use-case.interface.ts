import type { GetTutorProfileResponseDTO } from "@/application/dto/tutor/tutor-profile.dto";

import type { IBaseUseCase } from "../base.use-case.interface";

export interface IGetTutorProfileUseCase extends IBaseUseCase<
  string,
  GetTutorProfileResponseDTO
> {}