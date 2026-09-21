import type { TutorDetailsResponseDTO } from "@/application/dto/admin/get-tutors.dto";

import type { IBaseUseCase } from "../base.use-case.interface";

export interface IGetTutorByIdUseCase extends IBaseUseCase<
  string,
  TutorDetailsResponseDTO
> {}