import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
} from "@/application/constants/logger.constants";
import type { IAdminRepository } from "@/application/ports/repositories/admin.repository.interface";
import type {
  IRejectTutorApplicationUseCase,
  RejectTutorApplicationInputDTO,
  RejectTutorApplicationOutputDTO,
} from "@/application/ports/use-cases/admin/reject-tutor-application.use-case.interface";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class RejectTutorApplicationUseCase implements IRejectTutorApplicationUseCase {
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
    input: RejectTutorApplicationInputDTO,
  ): Promise<RejectTutorApplicationOutputDTO> {
    this.log.attempt(LOG_ACTION.REJECT_TUTOR, {
      applicationId: input.applicationId,
      reason: input.reason,
    });

    await this._adminRepository.rejectTutor(input.applicationId, input.reason);

    this.log.success(LOG_ACTION.REJECT_TUTOR, {
      applicationId: input.applicationId,
    });
  }
}