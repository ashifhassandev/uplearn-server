import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import {
  ApplyTutorInputDTO,
  ApplyTutorOutputDTO,
} from "@/application/dto/tutor/apply-tutor.dto";
import { IInstructorDetailsRepository } from "@/application/ports/repositories/instructor-details.repository.interface";
import { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import { IApplyTutorUseCase } from "@/application/ports/use-cases/tutor/apply-tutor.use-case.interface";
import { InstructorDetails } from "@/domain/entities/instructor-details.entity";
import { ApplicationStatus } from "@/domain/enums/application-status.enum";
import { UserRole } from "@/domain/enums/user-role.enum";
import {
  AUTH_ERRORS,
  TUTOR_ERRORS,
  TUTOR_SUCCESS,
} from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class ApplyTutorUseCase implements IApplyTutorUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.IInstructorDetailsRepository)
    private readonly _instructorDetailsRepository: IInstructorDetailsRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.TUTOR_USE_CASE);
  }

  async execute(input: ApplyTutorInputDTO): Promise<ApplyTutorOutputDTO> {
    this.log.attempt(LOG_ACTION.APPLY_TUTOR, { userId: input.userId });

    const user = await this._userRepository.findById(input.userId);
    if (!user) {
      this.log.failed(LOG_ACTION.APPLY_TUTOR, LOG_REASONS.AUTH.USER_NOT_FOUND, {
        userId: input.userId,
      });
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.role !== UserRole.STUDENT) {
      this.log.failed(
        LOG_ACTION.APPLY_TUTOR,
        LOG_REASONS.VALIDATION.NOT_A_STUDENT,
        {
          userId: input.userId,
          role: user.role,
        },
      );
      throw new AppError(
        TUTOR_ERRORS.ONLY_STUDENTS_CAN_APPLY,
        HttpStatus.FORBIDDEN,
      );
    }

    const existing = await this._instructorDetailsRepository.findByUserId(
      input.userId,
    );
    if (existing) {
      if (existing.isPending()) {
        this.log.failed(
          LOG_ACTION.APPLY_TUTOR,
          LOG_REASONS.VALIDATION.ALREADY_APPLIED,
          {
            userId: input.userId,
          },
        );
        throw new AppError(TUTOR_ERRORS.UNDER_REVIEW, HttpStatus.CONFLICT);
      }

      if (existing.isApproved()) {
        this.log.failed(
          LOG_ACTION.APPLY_TUTOR,
          LOG_REASONS.ADMIN.ALREADY_APPROVED,
          {
            userId: input.userId,
          },
        );
        throw new AppError(TUTOR_ERRORS.ALREADY_TUTOR, HttpStatus.CONFLICT);
      }

      if (existing.canReapply()) {
        const reapplied = existing.withReapplication(
          input.bio,
          input.headline,
          input.education,
          input.certificates,
          input.experiences,
          input.skills,
          input.links,
        );

        await this._instructorDetailsRepository.updateByUserId(
          input.userId,
          reapplied,
        );

        this.log.success(LOG_ACTION.APPLY_TUTOR, {
          userId: input.userId,
          reApplied: true,
        });

        return {
          message: TUTOR_SUCCESS.APPLICATION_RESUBMITTED,
          applicationStatus: ApplicationStatus.PENDING,
        };
      }
    }

    const newApplication = new InstructorDetails(
      null,
      input.userId,
      input.bio,
      input.headline,
      input.education,
      input.certificates,
      input.experiences,
      input.skills,
      input.links,
      ApplicationStatus.PENDING,
    );

    const saved =
      await this._instructorDetailsRepository.create(newApplication);

    this.log.success(LOG_ACTION.APPLY_TUTOR, {
      userId: input.userId,
      applicationStatus: saved.applicationStatus,
    });

    return {
      message: TUTOR_SUCCESS.APPLICATION_SUBMITTED,
      applicationStatus: saved.applicationStatus,
    };
  }
}