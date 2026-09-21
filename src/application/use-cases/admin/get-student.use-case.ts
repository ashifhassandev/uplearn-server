import { inject, injectable } from "tsyringe";

import { AUTH_ERRORS } from "../../../shared/constants/messages.constants";
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
import type {
  GetStudentInputDTO,
  StudentResponseDTO,
} from "../../dto/admin/get-students.dto";
import type { IUserRepository } from "../../ports/repositories/user.repository.interface";
import type { IGetStudentUseCase } from "../../ports/use-cases/admin/get-student.use-case.interface";

@injectable()
export class GetStudentUseCase implements IGetStudentUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.ADMIN_STUDENT_USE_CASE);
  }

  async execute(input: GetStudentInputDTO): Promise<StudentResponseDTO> {
    this.log.attempt(LOG_ACTION.GET_STUDENT, { studentId: input.studentId });

    const result = await this._userRepository.findStudentById(input.studentId);
    if (!result) {
      this.log.failed(LOG_ACTION.GET_STUDENT, LOG_REASONS.AUTH.USER_NOT_FOUND, {
        studentId: input.studentId,
      });
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    this.log.success(LOG_ACTION.GET_STUDENT, { studentId: input.studentId });

    return result;
  }
}