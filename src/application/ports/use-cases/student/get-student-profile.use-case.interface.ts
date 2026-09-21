import type { StudentResponseDTO } from "../../../dto/admin/get-students.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IGetStudentProfileUseCase extends IBaseUseCase<
  string,
  StudentResponseDTO
> {}