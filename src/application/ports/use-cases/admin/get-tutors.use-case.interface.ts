import type {
  GetTutorsInputDTO,
  GetTutorsOutputDTO,
} from "../../../dto/admin/get-tutors.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IGetTutorsUseCase extends IBaseUseCase<
  GetTutorsInputDTO,
  GetTutorsOutputDTO
> {}