import type {
  ApplyTutorInputDTO,
  ApplyTutorOutputDTO,
} from "../../../dto/tutor/apply-tutor.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IApplyTutorUseCase extends IBaseUseCase<
  ApplyTutorInputDTO,
  ApplyTutorOutputDTO
> {}