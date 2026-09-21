import type {
  UploadInputDTO,
  UploadOutputDTO,
} from "../../../dto/storage/upload.dto";
import type { IBaseUseCase } from "../base.use-case.interface";

export interface IUploadFileUseCase extends IBaseUseCase<
  UploadInputDTO,
  UploadOutputDTO
> {}