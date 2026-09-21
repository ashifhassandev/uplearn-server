import type { UpdateUserStatusInputDTO } from "../../../dto/admin/update-user-status.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IDeleteStudentUseCase extends IBaseUseCase<UpdateUserStatusInputDTO> {}