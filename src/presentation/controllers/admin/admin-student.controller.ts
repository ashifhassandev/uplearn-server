import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import { IActivateStudentUseCase } from "@/application/ports/use-cases/admin/activate-student.use-case.interface";
import { IDeleteStudentUseCase } from "@/application/ports/use-cases/admin/delete-student.use-case.interface";
import { IGetStudentUseCase } from "@/application/ports/use-cases/admin/get-student.use-case.interface";
import { IGetStudentsUseCase } from "@/application/ports/use-cases/admin/get-students.use-case.interface";
import { ISuspendStudentUseCase } from "@/application/ports/use-cases/admin/suspend-student.use-case.interface";
import {
  ADMIN_SUCCESS,
  AUTH_ERRORS,
} from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class AdminStudentController {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IGetStudentsUseCase)
    private readonly _getStudentsUseCase: IGetStudentsUseCase,

    @inject(TOKENS.IGetStudentUseCase)
    private readonly _getStudentUseCase: IGetStudentUseCase,

    @inject(TOKENS.ISuspendStudentUseCase)
    private readonly _suspendStudentUseCase: ISuspendStudentUseCase,

    @inject(TOKENS.IActivateStudentUseCase)
    private readonly _activateStudentUseCase: IActivateStudentUseCase,

    @inject(TOKENS.IDeleteStudentUseCase)
    private readonly _deleteStudentUseCase: IDeleteStudentUseCase,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.ADMIN_STUDENT_CONTROLLER);
  }

  public async getStudents(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.GET_STUDENTS);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || null;
    const status = (req.query.status as string) || null;

    const result = await this._getStudentsUseCase.execute({
      page,
      limit,
      search,
      status,
    });

    this.log.success(LOG_ACTION.GET_STUDENTS, {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }

  public async getStudent(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.GET_STUDENT);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.GET_STUDENT,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { userId: id },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const result = await this._getStudentUseCase.execute({ studentId: id });

    this.log.success(LOG_ACTION.GET_STUDENT, { studentId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }

  public async suspendStudent(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.SUSPEND_STUDENT);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.SUSPEND_STUDENT,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { userId: id },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._suspendStudentUseCase.execute({ userId: id });

    this.log.success(LOG_ACTION.SUSPEND_STUDENT, { userId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_SUCCESS.SUSPEND_STUDENT,
    });
  }

  public async activateStudent(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.ACTIVATE_STUDENT);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.ACTIVATE_STUDENT,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { userId: id },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._activateStudentUseCase.execute({ userId: id });

    this.log.success(LOG_ACTION.ACTIVATE_STUDENT, { userId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_SUCCESS.ACTIVATE_STUDENT,
    });
  }

  public async deleteStudent(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.DELETE_STUDENT);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.DELETE_STUDENT,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { userId: id },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._deleteStudentUseCase.execute({ userId: id });

    this.log.success(LOG_ACTION.DELETE_STUDENT, { userId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_SUCCESS.DELETE_STUDENT,
    });
  }
}