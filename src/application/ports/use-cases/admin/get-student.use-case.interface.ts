import type {
  GetStudentInputDTO,
  StudentResponseDTO,
} from "../../../dto/admin/get-students.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IGetStudentUseCase extends IBaseUseCase<
  GetStudentInputDTO,
  StudentResponseDTO
> {}