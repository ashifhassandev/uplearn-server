import type {
  GetTutorApplicationsInputDTO,
  GetTutorApplicationsOutputDTO,
} from "../../../dto/admin/get-tutor-applications.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IGetTutorApplicationsUseCase extends IBaseUseCase<
  GetTutorApplicationsInputDTO,
  GetTutorApplicationsOutputDTO
> {}