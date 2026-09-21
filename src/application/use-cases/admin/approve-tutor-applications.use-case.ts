import { inject, injectable } from "tsyringe";

import { createLogger } from "../../../shared/logger/create-logger";
import { ILogger } from "../../../shared/logger/logger.interface";
import { ContextLogger } from "../../../shared/logger/logger-context.type";
import { TOKENS } from "../../constants/injection-token.constants";
import { LOG_ACTION, LOG_CONTEXT } from "../../constants/logger.constants";
import type { IAdminRepository } from "../../ports/repositories/admin.repository.interface";
import type {
  ApproveTutorApplicationInputDTO,
  ApproveTutorApplicationOutputDTO,
  IApproveTutorApplicationUseCase,
} from "../../ports/use-cases/admin/approve-tutor-application.use-case.interface";

@injectable()
export class ApproveTutorApplicationUseCase implements IApproveTutorApplicationUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IAdminRepository)
    private readonly _adminRepository: IAdminRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(
      this._logger,
      LOG_CONTEXT.ADMIN_APPLICATION_USE_CASE,
    );
  }

  async execute(
    input: ApproveTutorApplicationInputDTO,
  ): Promise<ApproveTutorApplicationOutputDTO> {
    this.log.attempt(LOG_ACTION.APPROVE_TUTOR, {
      applicationId: input.applicationId,
    });

    await this._adminRepository.approveTutor(input.applicationId);

    this.log.success(LOG_ACTION.APPROVE_TUTOR, {
      applicationId: input.applicationId,
    });
  }
}