import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import type { StudentResponseDTO } from "@/application/dto/admin/get-students.dto";
import type { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import type { IGetStudentProfileUseCase } from "@/application/ports/use-cases/student/get-student-profile.use-case.interface";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class GetStudentProfileUseCase implements IGetStudentProfileUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.STUDENT_USE_CASE);
  }

  async execute(studentId: string): Promise<StudentResponseDTO> {
    this.log.attempt(LOG_ACTION.GET_STUDENT_PROFILE, { studentId });

    const user = await this._userRepository.findById(studentId);
    if (!user) {
      this.log.failed(
        LOG_ACTION.GET_STUDENT_PROFILE,
        LOG_REASONS.AUTH.USER_NOT_FOUND,
        { studentId },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const userId = user.id;
    if (!userId) {
      this.log.error(
        LOG_ACTION.GET_STUDENT_PROFILE,
        new Error(LOG_REASONS.STATE.USER_ID_NULL.message),
        { studentId },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const createdAt = user.createdAt;
    if (!createdAt) {
      this.log.error(
        LOG_ACTION.GET_STUDENT_PROFILE,
        new Error("createdAt is null after save"),
        { studentId, userId },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    this.log.success(LOG_ACTION.GET_STUDENT_PROFILE, { studentId, userId });

    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt,
    };
  }
}