import { inject, injectable } from "tsyringe";

import { UserStatus } from "../../../domain/enums/user-status.enum";
import {
  ADMIN_ERRORS,
  AUTH_ERRORS,
} from "../../../shared/constants/messages.constants";
import { HttpStatus } from "../../../shared/enums/http-status.enum";
import { AppError } from "../../../shared/errors/app.error";
import { createLogger } from "../../../shared/logger/create-logger";
import { ILogger } from "../../../shared/logger/logger.interface";
import { ContextLogger } from "../../../shared/logger/logger-context.type";
import { TOKENS } from "../../constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "../../constants/logger.constants";
import { UpdateUserStatusInputDTO } from "../../dto/admin/update-user-status.dto";
import { IUserRepository } from "../../ports/repositories/user.repository.interface";
import { IActivateTutorUseCase } from "../../ports/use-cases/admin/activate-tutor.use-case.interface";

@injectable()
export class ActivateTutorUseCase implements IActivateTutorUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.ADMIN_TUTOR_USE_CASE);
  }

  async execute(input: UpdateUserStatusInputDTO): Promise<void> {
    this.log.attempt(LOG_ACTION.ACTIVATE_TUTOR, { userId: input.userId });

    const user = await this._userRepository.findById(input.userId);
    if (!user) {
      this.log.failed(
        LOG_ACTION.ACTIVATE_TUTOR,
        LOG_REASONS.AUTH.USER_NOT_FOUND,
        {
          userId: input.userId,
        },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.status === UserStatus.ACTIVE) {
      this.log.failed(
        LOG_ACTION.ACTIVATE_TUTOR,
        LOG_REASONS.ADMIN.ALREADY_ACTIVE,
        {
          userId: input.userId,
          currentStatus: user.status,
        },
      );
      throw new AppError(ADMIN_ERRORS.ALREADY_ACTIVE, HttpStatus.CONFLICT);
    }

    await this._userRepository.updateStatus(input.userId, UserStatus.ACTIVE);

    this.log.success(LOG_ACTION.ACTIVATE_TUTOR, { userId: input.userId });
  }
}