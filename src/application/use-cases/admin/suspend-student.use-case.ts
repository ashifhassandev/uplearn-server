import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import { UpdateUserStatusInputDTO } from "@/application/dto/admin/update-user-status.dto";
import { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import { ISuspendStudentUseCase } from "@/application/ports/use-cases/admin/suspend-student.use-case.interface";
import { UserStatus } from "@/domain/enums/user-status.enum";
import {
  ADMIN_ERRORS,
  AUTH_ERRORS,
} from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class SuspendStudentUseCase implements ISuspendStudentUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.ADMIN_STUDENT_USE_CASE);
  }

  async execute(input: UpdateUserStatusInputDTO): Promise<void> {
    this.log.attempt(LOG_ACTION.SUSPEND_STUDENT, { userId: input.userId });

    const user = await this._userRepository.findById(input.userId);
    if (!user) {
      this.log.failed(
        LOG_ACTION.SUSPEND_STUDENT,
        LOG_REASONS.AUTH.USER_NOT_FOUND,
        {
          userId: input.userId,
        },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.status === UserStatus.SUSPENDED) {
      this.log.failed(
        LOG_ACTION.SUSPEND_STUDENT,
        LOG_REASONS.ADMIN.ALREADY_SUSPENDED,
        {
          userId: input.userId,
          currentStatus: user.status,
        },
      );
      throw new AppError(ADMIN_ERRORS.ALREADY_SUSPENDED, HttpStatus.CONFLICT);
    }

    await this._userRepository.updateStatus(input.userId, UserStatus.SUSPENDED);

    this.log.success(LOG_ACTION.SUSPEND_STUDENT, { userId: input.userId });
  }
}