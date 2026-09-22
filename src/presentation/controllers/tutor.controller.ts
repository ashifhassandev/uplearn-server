import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import { IStorageService } from "@/application/ports/services/storage.service.interface";
import type { IApplyTutorUseCase } from "@/application/ports/use-cases/tutor/apply-tutor.use-case.interface";
import type { IGetTutorProfileUseCase } from "@/application/ports/use-cases/tutor/get-tutor-profile.use-case.interface";
import { applyTutorSchema } from "@/presentation/validations/apply-tutor.schema";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import type { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class TutorController {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IApplyTutorUseCase)
    private readonly _applyTutorUseCase: IApplyTutorUseCase,

    @inject(TOKENS.IGetTutorProfileUseCase)
    private readonly _getTutorProfileUseCase: IGetTutorProfileUseCase,

    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.TUTOR_CONTROLLER);
  }

  public async applyForTutor(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.APPLY_TUTOR);

    if (!req.user) {
      this.log.failed(LOG_ACTION.APPLY_TUTOR, LOG_REASONS.AUTH.USER_NOT_FOUND);
      throw new AppError(AUTH_ERRORS.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const validatedData = applyTutorSchema.parse(req.body);

    const result = await this._applyTutorUseCase.execute({
      userId: req.user.id,
      bio: validatedData.bio,
      headline: validatedData.headline,
      education: validatedData.education,
      certificates: validatedData.certificates ?? [],
      experiences: validatedData.experiences ?? [],
      skills: validatedData.skills,
      links: validatedData.links ?? {},
    });

    this.log.success(LOG_ACTION.APPLY_TUTOR, {
      userId: req.user.id,
      applicationStatus: result.applicationStatus,
    });

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: result.message,
      data: { applicationStatus: result.applicationStatus },
    });
  }

  public async getTutorProfile(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.GET_TUTOR_PROFILE);

    if (!req.user) {
      this.log.failed(
        LOG_ACTION.GET_TUTOR_PROFILE,
        LOG_REASONS.AUTH.USER_NOT_FOUND,
      );
      throw new AppError(AUTH_ERRORS.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const userId = req.user.id;
    const result = await this._getTutorProfileUseCase.execute(userId);

    this.log.success(LOG_ACTION.GET_TUTOR_PROFILE, { userId });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }

  public async getCertificateUrl(
    req: Request,
    res: Response,
  ): Promise<Response> {
    this.log.attempt(LOG_ACTION.UPLOAD_FILE);

    if (!req.user) {
      this.log.failed(LOG_ACTION.UPLOAD_FILE, LOG_REASONS.AUTH.USER_NOT_FOUND);
      throw new AppError(AUTH_ERRORS.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const { key } = req.query;
    if (!key || typeof key !== "string") {
      throw new AppError("Invalid key", HttpStatus.BAD_REQUEST);
    }

    const url = await this._storageService.getSignedUrl(key, 300);

    this.log.success(LOG_ACTION.UPLOAD_FILE, { key });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: { url },
    });
  }
}