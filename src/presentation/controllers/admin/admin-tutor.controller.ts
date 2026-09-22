import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import { IStorageService } from "@/application/ports/services/storage.service.interface";
import { IActivateTutorUseCase } from "@/application/ports/use-cases/admin/activate-tutor.use-case.interface";
import { IApproveTutorApplicationUseCase } from "@/application/ports/use-cases/admin/approve-tutor-application.use-case.interface";
import { IDeleteTutorUseCase } from "@/application/ports/use-cases/admin/delete-tutor.use-case.interface";
import { IGetTutorApplicationUseCase } from "@/application/ports/use-cases/admin/get-tutor-application.use-case.interface";
import { IGetTutorApplicationsUseCase } from "@/application/ports/use-cases/admin/get-tutor-applications.use-case.interface";
import { IGetTutorByIdUseCase } from "@/application/ports/use-cases/admin/get-tutor-by-id.use-case.interface";
import { IGetTutorsUseCase } from "@/application/ports/use-cases/admin/get-tutors.use-case.interface";
import { IRejectTutorApplicationUseCase } from "@/application/ports/use-cases/admin/reject-tutor-application.use-case.interface";
import { ISuspendTutorUseCase } from "@/application/ports/use-cases/admin/suspend-tutor.use-case.interface";
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
export class AdminTutorController {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IGetTutorUseCase)
    private readonly _getTutorsUseCase: IGetTutorsUseCase,

    @inject(TOKENS.IGetTutorByIdUseCase)
    private readonly _getTutorByIdUseCase: IGetTutorByIdUseCase,

    @inject(TOKENS.ISuspendTutorUseCase)
    private readonly _suspendTutorUseCase: ISuspendTutorUseCase,

    @inject(TOKENS.IActivateTutorUseCase)
    private readonly _activateTutorUseCase: IActivateTutorUseCase,

    @inject(TOKENS.IDeleteTutorUseCase)
    private readonly _deleteTutorUseCase: IDeleteTutorUseCase,

    @inject(TOKENS.IGetTutorApplicationsUseCase)
    private readonly _getTutorApplicationsUseCase: IGetTutorApplicationsUseCase,

    @inject(TOKENS.IGetTutorApplicationUseCase)
    private readonly _getTutorApplicationUseCase: IGetTutorApplicationUseCase,

    @inject(TOKENS.IApproveTutorUseCase)
    private readonly _approveTutorApplicationUseCase: IApproveTutorApplicationUseCase,

    @inject(TOKENS.IRejectTutorUseCase)
    private readonly _rejectTutorApplicationUseCase: IRejectTutorApplicationUseCase,

    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.ADMIN_TUTOR_CONTROLLER);
  }

  public async getTutors(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.GET_TUTORS);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || null;
    const status = (req.query.status as string) || null;
    const verified = (req.query.verified as string) || null;

    const result = await this._getTutorsUseCase.execute({
      page,
      limit,
      search,
      status,
      verified,
    });

    this.log.success(LOG_ACTION.GET_TUTORS, {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }

  public async getTutorById(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.GET_TUTOR_BY_ID);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.GET_TUTOR_BY_ID,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { tutorId: id },
      );
      throw new AppError("Invalid tutor ID", HttpStatus.BAD_REQUEST);
    }

    const result = await this._getTutorByIdUseCase.execute(id);

    this.log.success(LOG_ACTION.GET_TUTOR_BY_ID, { tutorId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }

  public async getCertificateUrl(
    req: Request,
    res: Response,
  ): Promise<Response> {
    if (!req.user) {
      throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const { key } = req.query;
    if (!key || typeof key !== "string") {
      throw new AppError("Invalid key", HttpStatus.BAD_REQUEST);
    }

    const url = await this._storageService.getSignedUrl(key, 300);

    return res.status(HttpStatus.OK).json({
      success: true,
      data: { url },
    });
  }

  public async suspendTutor(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.SUSPEND_TUTOR);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.SUSPEND_TUTOR,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { userId: id },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._suspendTutorUseCase.execute({ userId: id });

    this.log.success(LOG_ACTION.SUSPEND_TUTOR, { userId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_SUCCESS.SUSPEND_TUTOR,
    });
  }

  public async activateTutor(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.ACTIVATE_TUTOR);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.ACTIVATE_TUTOR,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { userId: id },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._activateTutorUseCase.execute({ userId: id });

    this.log.success(LOG_ACTION.ACTIVATE_TUTOR, { userId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_SUCCESS.ACTIVATE_TUTOR,
    });
  }

  public async deleteTutor(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.DELETE_TUTOR);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.DELETE_TUTOR,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { userId: id },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._deleteTutorUseCase.execute({ userId: id });

    this.log.success(LOG_ACTION.DELETE_TUTOR, { userId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_SUCCESS.DELETE_TUTOR,
    });
  }

  public async getTutorApplications(
    req: Request,
    res: Response,
  ): Promise<Response> {
    this.log.attempt(LOG_ACTION.GET_TUTOR_APPLICATIONS);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";

    const result = await this._getTutorApplicationsUseCase.execute({
      page,
      limit,
      search,
      status,
    });

    this.log.success(LOG_ACTION.GET_TUTOR_APPLICATIONS, {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }

  public async getTutorApplication(
    req: Request,
    res: Response,
  ): Promise<Response> {
    this.log.attempt(LOG_ACTION.GET_TUTOR_APPLICATION);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.GET_TUTOR_APPLICATION,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { applicationId: id },
      );
      throw new AppError("Application ID is required", HttpStatus.BAD_REQUEST);
    }

    const result = await this._getTutorApplicationUseCase.execute({
      applicationId: id,
    });

    this.log.success(LOG_ACTION.GET_TUTOR_APPLICATION, { applicationId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }

  public async approveTutor(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.APPROVE_TUTOR);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.APPROVE_TUTOR,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { applicationId: id },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._approveTutorApplicationUseCase.execute({ applicationId: id });

    this.log.success(LOG_ACTION.APPROVE_TUTOR, { applicationId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_SUCCESS.APPROVE_TUTOR,
    });
  }

  public async rejectTutor(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.REJECT_TUTOR);

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      this.log.failed(
        LOG_ACTION.REJECT_TUTOR,
        LOG_REASONS.VALIDATION.USER_ID_NULL,
        { applicationId: id },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const { reason } = req.body;
    if (!reason || typeof reason !== "string") {
      throw new AppError(
        "Rejection reason is required",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._rejectTutorApplicationUseCase.execute({
      applicationId: id,
      reason,
    });

    this.log.success(LOG_ACTION.REJECT_TUTOR, { applicationId: id });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_SUCCESS.REJECT_TUTOR,
    });
  }
}