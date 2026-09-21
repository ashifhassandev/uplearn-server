import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
} from "@/application/constants/logger.constants";
import type {
  GetTutorApplicationsInputDTO,
  GetTutorApplicationsOutputDTO,
} from "@/application/dto/admin/get-tutor-applications.dto";
import type { IAdminRepository } from "@/application/ports/repositories/admin.repository.interface";
import type { IGetTutorApplicationsUseCase } from "@/application/ports/use-cases/admin/get-tutor-applications.use-case.interface";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class GetTutorApplicationsUseCase implements IGetTutorApplicationsUseCase {
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
    input: GetTutorApplicationsInputDTO,
  ): Promise<GetTutorApplicationsOutputDTO> {
    this.log.attempt(LOG_ACTION.GET_TUTOR_APPLICATIONS, {
      page: input.page,
      limit: input.limit,
      search: input.search,
      status: input.status,
    });

    const result = await this._adminRepository.findApplications(input);

    this.log.success(LOG_ACTION.GET_TUTOR_APPLICATIONS, {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });

    return result;
  }
}