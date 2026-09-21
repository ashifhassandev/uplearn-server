import type {
  GetStudentsInputDTO,
  GetStudentsOutputDTO,
} from "../../../dto/admin/get-students.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IGetStudentsUseCase extends IBaseUseCase<
  GetStudentsInputDTO,
  GetStudentsOutputDTO
> {}