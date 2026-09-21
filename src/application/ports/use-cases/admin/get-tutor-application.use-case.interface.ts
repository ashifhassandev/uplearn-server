import type {
  GetTutorApplicationInputDTO,
  GetTutorApplicationOutputDTO,
} from "../../../dto/admin/get-tutor-application.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IGetTutorApplicationUseCase extends IBaseUseCase<
  GetTutorApplicationInputDTO,
  GetTutorApplicationOutputDTO
> {}