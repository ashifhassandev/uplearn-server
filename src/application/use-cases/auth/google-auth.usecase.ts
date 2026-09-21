import crypto from "crypto";
import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import {
  GoogleAuthInputDTO,
  GoogleAuthOutputDTO,
} from "@/application/dto/auth/google-auth.dto";
import { IInstructorDetailsRepository } from "@/application/ports/repositories/instructor-details.repository.interface";
import { IRefreshTokenRepository } from "@/application/ports/repositories/refresh-token.repository.interface";
import { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import { ITokenService } from "@/application/ports/services/token.service.interface";
import { IGoogleAuthUseCase } from "@/application/ports/use-cases/auth/google-auth.use-case.interface";
import { User } from "@/domain/entities/user.entity";
import { UserRole } from "@/domain/enums/user-role.enum";
import { UserStatus } from "@/domain/enums/user-status.enum";
import { IPasswordHasher } from "@/domain/ports/services/password-hasher.service.interface";
import { Email } from "@/domain/value-objects/email.value-object";
import { Password } from "@/domain/value-objects/password.value-object";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.IInstructorDetailsRepository)
    private readonly _instructorRepository: IInstructorDetailsRepository,

    @inject(TOKENS.IRefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,

    @inject(TOKENS.ITokenService)
    private readonly _tokenService: ITokenService,

    @inject(TOKENS.IPasswordHasher)
    private readonly _hasher: IPasswordHasher,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.AUTH_USE_CASE);
  }

  async execute(input: GoogleAuthInputDTO): Promise<GoogleAuthOutputDTO> {
    this.log.attempt(LOG_ACTION.GOOGLE_AUTH, { email: input.email });

    let user = await this._userRepository.findByEmail(input.email);
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const password = await Password.create(randomPassword, this._hasher);

      const newUser = new User(
        null,
        input.firstName,
        input.lastName,
        new Email(input.email),
        password,
        UserRole.STUDENT,
        undefined,
        input.profileImage ?? null,
      );

      user = await this._userRepository.save(newUser);

      this.log.success(LOG_ACTION.CREATE_USER_GOOGLE, {
        userId: user.id,
        email: input.email,
      });
    } else {
      if (user.status === UserStatus.SUSPENDED) {
        this.log.failed(
          LOG_ACTION.GOOGLE_AUTH,
          LOG_REASONS.ADMIN.ACCOUNT_SUSPENDED,
          {
            email: input.email,
          },
        );
        throw new AppError(AUTH_ERRORS.ACCOUNT_SUSPENDED, HttpStatus.FORBIDDEN);
      }

      if (user.status === UserStatus.DELETED) {
        this.log.failed(
          LOG_ACTION.GOOGLE_AUTH,
          LOG_REASONS.ADMIN.ACCOUNT_DELETED,
          {
            email: input.email,
          },
        );
        throw new AppError(AUTH_ERRORS.ACCOUNT_DELETED, HttpStatus.FORBIDDEN);
      }

      if (!user.profileImage && input.profileImage) {
        const existingUserId = user.id;
        if (existingUserId) {
          await this._userRepository.updateProfileImage(
            existingUserId,
            input.profileImage,
          );
          user = user.updateProfileImage(input.profileImage);
        }
      }

      this.log.success(LOG_ACTION.FIND_USER_GOOGLE, {
        userId: user.id,
        email: input.email,
      });
    }

    const userId = user.id;
    if (!userId) {
      this.log.error(
        LOG_ACTION.GOOGLE_AUTH,
        new Error(LOG_REASONS.STATE.USER_ID_NULL.message),
        {
          email: input.email,
        },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const instructor = await this._instructorRepository.findByUserId(userId);
    const applicationStatus = instructor ? instructor.applicationStatus : null;
    const rejectionReason = instructor ? instructor.rejectionReason : null;

    const accessToken = this._tokenService.generateAccessToken({
      id: userId,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      id: userId,
    });

    await this._refreshTokenRepository.save(userId, refreshToken);
    await this._userRepository.updateLastLogin(userId);

    this.log.success(LOG_ACTION.GOOGLE_AUTH, {
      userId,
      role: user.role,
      applicationStatus,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage ?? null,
        applicationStatus,
        rejectionReason,
      },
    };
  }
}