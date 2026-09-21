import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
} from "@/application/constants/logger.constants";
import type {
  GetTutorsInputDTO,
  GetTutorsOutputDTO,
} from "@/application/dto/admin/get-tutors.dto";
import type { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import type { IGetTutorsUseCase } from "@/application/ports/use-cases/admin/get-tutors.use-case.interface";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class GetTutorsUseCase implements IGetTutorsUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.ADMIN_TUTOR_USE_CASE);
  }

  async execute(input: GetTutorsInputDTO): Promise<GetTutorsOutputDTO> {
    this.log.attempt(LOG_ACTION.GET_TUTORS, {
      page: input.page,
      limit: input.limit,
      search: input.search,
      status: input.status,
      verified: input.verified,
    });

    const result = await this._userRepository.findTutors(input);

    this.log.success(LOG_ACTION.GET_TUTORS, {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });

    return result;
  }
}