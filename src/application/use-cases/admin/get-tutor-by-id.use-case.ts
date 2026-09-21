import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import type { TutorDetailsResponseDTO } from "@/application/dto/admin/get-tutors.dto";
import type { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import type { IGetTutorByIdUseCase } from "@/application/ports/use-cases/admin/get-tutor-by-id.use-case.interface";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class GetTutorByIdUseCase implements IGetTutorByIdUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.ADMIN_TUTOR_USE_CASE);
  }

  async execute(tutorId: string): Promise<TutorDetailsResponseDTO> {
    this.log.attempt(LOG_ACTION.GET_TUTOR_BY_ID, { tutorId });

    const result = await this._userRepository.findTutorById(tutorId);
    if (!result) {
      this.log.failed(LOG_ACTION.GET_TUTOR_BY_ID, LOG_REASONS.TUTOR.NOT_FOUND, {
        tutorId,
      });
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    this.log.success(LOG_ACTION.GET_TUTOR_BY_ID, { tutorId });

    return result;
  }
}