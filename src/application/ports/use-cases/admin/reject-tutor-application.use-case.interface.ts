import type { IBaseUseCase } from "../base.use-case.interface";

export type RejectTutorApplicationInputDTO = {
  applicationId: string;
  reason: string;
};

export type RejectTutorApplicationOutputDTO = void;

export interface IRejectTutorApplicationUseCase extends IBaseUseCase<
  RejectTutorApplicationInputDTO,
  RejectTutorApplicationOutputDTO
> {}