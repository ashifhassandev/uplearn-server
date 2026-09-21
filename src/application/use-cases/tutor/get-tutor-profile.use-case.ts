import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import type { GetTutorProfileResponseDTO } from "@/application/dto/tutor/tutor-profile.dto";
import type { IInstructorDetailsRepository } from "@/application/ports/repositories/instructor-details.repository.interface";
import type { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import type { IGetTutorProfileUseCase } from "@/application/ports/use-cases/tutor/get-tutor-profile.use-case.interface";
import {
  AUTH_ERRORS,
  TUTOR_ERRORS,
} from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class GetTutorProfileUseCase implements IGetTutorProfileUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IInstructorDetailsRepository)
    private readonly _instructorDetailsRepository: IInstructorDetailsRepository,

    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.TUTOR_USE_CASE);
  }

  async execute(tutorId: string): Promise<GetTutorProfileResponseDTO> {
    this.log.attempt(LOG_ACTION.GET_TUTOR_PROFILE, { tutorId });

    const [details, user] = await Promise.all([
      this._instructorDetailsRepository.findByUserId(tutorId),
      this._userRepository.findById(tutorId),
    ]);

    if (!details) {
      this.log.failed(
        LOG_ACTION.GET_TUTOR_PROFILE,
        LOG_REASONS.TUTOR.NOT_FOUND,
        { tutorId },
      );
      throw new AppError(TUTOR_ERRORS.TUTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!user) {
      this.log.failed(
        LOG_ACTION.GET_TUTOR_PROFILE,
        LOG_REASONS.AUTH.USER_NOT_FOUND,
        { tutorId },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const detailsId = details.id;
    if (!detailsId) {
      this.log.error(
        LOG_ACTION.GET_TUTOR_PROFILE,
        new Error(LOG_REASONS.STATE.TUTOR_ID_NULL.message),
        { tutorId },
      );
      throw new AppError(TUTOR_ERRORS.TUTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    this.log.success(LOG_ACTION.GET_TUTOR_PROFILE, { tutorId, detailsId });

    return {
      id: detailsId,
      userId: details.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage ?? null,
      bio: details.bio,
      headline: details.headline,
      education: details.education,
      certificates: details.certificates,
      experiences: details.experiences,
      skills: details.skills,
      links: details.links,
      applicationStatus: details.applicationStatus,
      rejectionReason: details.rejectionReason,
      isPlatformVerified: details.isPlatformVerified,
      platformVerifiedAt: details.platformVerifiedAt,
    };
  }
}