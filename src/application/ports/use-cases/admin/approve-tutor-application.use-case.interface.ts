import type { IBaseUseCase } from "../base.use-case.interface";

export type ApproveTutorApplicationInputDTO = {
  applicationId: string;
};

export type ApproveTutorApplicationOutputDTO = void;

export interface IApproveTutorApplicationUseCase extends IBaseUseCase<
  ApproveTutorApplicationInputDTO,
  ApproveTutorApplicationOutputDTO
> {}