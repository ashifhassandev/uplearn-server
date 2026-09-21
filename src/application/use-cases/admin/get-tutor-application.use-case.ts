import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import type {
  GetTutorApplicationInputDTO,
  GetTutorApplicationOutputDTO,
} from "@/application/dto/admin/get-tutor-application.dto";
import type { IAdminRepository } from "@/application/ports/repositories/admin.repository.interface";
import type { IGetTutorApplicationUseCase } from "@/application/ports/use-cases/admin/get-tutor-application.use-case.interface";
import { ADMIN_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class GetTutorApplicationUseCase implements IGetTutorApplicationUseCase {
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
    input: GetTutorApplicationInputDTO,
  ): Promise<GetTutorApplicationOutputDTO> {
    this.log.attempt(LOG_ACTION.GET_TUTOR_APPLICATION, {
      applicationId: input.applicationId,
    });

    const result = await this._adminRepository.findApplicationById(
      input.applicationId,
    );
    if (!result) {
      this.log.failed(
        LOG_ACTION.GET_TUTOR_APPLICATION,
        LOG_REASONS.ADMIN.APPLICATION_NOT_FOUND,
        {
          applicationId: input.applicationId,
        },
      );
      throw new AppError(
        ADMIN_ERRORS.APPLICATION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    this.log.success(LOG_ACTION.GET_TUTOR_APPLICATION, {
      applicationId: input.applicationId,
    });

    return result;
  }
}