import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
} from "@/application/constants/logger.constants";
import type { IGetStudentProfileUseCase } from "@/application/ports/use-cases/student/get-student-profile.use-case.interface";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import type { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class StudentController {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IGetStudentProfileUseCase)
    private readonly _getStudentsProfileUseCase: IGetStudentProfileUseCase,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.STUDENT_CONTROLLER);
  }

  public async getStudentProfile(
    req: Request,
    res: Response,
  ): Promise<Response> {
    this.log.attempt(LOG_ACTION.GET_STUDENT_PROFILE);

    if (!req.user) {
      this.log.failed(LOG_ACTION.GET_STUDENT_PROFILE, {
        code: "AUTH_001",
        message: AUTH_ERRORS.UNAUTHORIZED,
      });
      throw new AppError(AUTH_ERRORS.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const result = await this._getStudentsProfileUseCase.execute(req.user.id);

    this.log.success(LOG_ACTION.GET_STUDENT_PROFILE, { userId: req.user.id });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }
}