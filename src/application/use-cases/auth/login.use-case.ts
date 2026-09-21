import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import {
  LoginInputDTO,
  LoginOutputDTO,
} from "@/application/dto/auth/login.dto";
import { IInstructorDetailsRepository } from "@/application/ports/repositories/instructor-details.repository.interface";
import { IRefreshTokenRepository } from "@/application/ports/repositories/refresh-token.repository.interface";
import { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import { ITokenService } from "@/application/ports/services/token.service.interface";
import { ILoginUseCase } from "@/application/ports/use-cases/auth/login.use-case.interface";
import { UserStatus } from "@/domain/enums/user-status.enum";
import { IPasswordHasher } from "@/domain/ports/services/password-hasher.service.interface";
import { Email } from "@/domain/value-objects/email.value-object";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class LoginUseCase implements ILoginUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.IRefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,

    @inject(TOKENS.IInstructorDetailsRepository)
    private readonly _instructorRepo: IInstructorDetailsRepository,

    @inject(TOKENS.IPasswordHasher)
    private readonly _hasher: IPasswordHasher,

    @inject(TOKENS.ITokenService)
    private readonly _tokenService: ITokenService,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.AUTH_USE_CASE);
  }

  async execute(input: LoginInputDTO): Promise<LoginOutputDTO> {
    const email = new Email(input.email);

    this.log.attempt(LOG_ACTION.LOGIN, { email: email.getValue() });

    const user = await this._userRepository.findByEmail(email.getValue());
    if (!user) {
      this.log.failed(LOG_ACTION.LOGIN, LOG_REASONS.AUTH.EMAIL_NOT_FOUND, {
        email: email.getValue(),
      });
      throw new AppError(
        AUTH_ERRORS.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValid = await user.verifyPassword(input.password, this._hasher);
    if (!isValid) {
      this.log.failed(LOG_ACTION.LOGIN, LOG_REASONS.AUTH.INVALID_PASSWORD, {
        email: email.getValue(),
      });
      throw new AppError(
        AUTH_ERRORS.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.status === UserStatus.SUSPENDED) {
      this.log.failed(LOG_ACTION.LOGIN, LOG_REASONS.ADMIN.ACCOUNT_SUSPENDED, {
        email: email.getValue(),
      });
      throw new AppError(AUTH_ERRORS.ACCOUNT_SUSPENDED, HttpStatus.FORBIDDEN);
    }

    if (user.status === UserStatus.DELETED) {
      this.log.failed(LOG_ACTION.LOGIN, LOG_REASONS.ADMIN.ACCOUNT_DELETED, {
        email: email.getValue(),
      });
      throw new AppError(AUTH_ERRORS.ACCOUNT_DELETED, HttpStatus.FORBIDDEN);
    }

    const userId = user.id;
    if (!userId) {
      this.log.error(
        LOG_ACTION.LOGIN,
        new Error(LOG_REASONS.STATE.USER_ID_NULL.message),
        {
          email: input.email,
        },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const instructor = await this._instructorRepo.findByUserId(userId);
    const applicationStatus = instructor?.applicationStatus ?? null;
    const rejectionReason = instructor?.rejectionReason ?? null;

    const accessToken = this._tokenService.generateAccessToken({
      id: userId,
      email: email.getValue(),
      role: user.role,
      status: user.status,
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      id: userId,
    });

    await this._refreshTokenRepository.save(userId, refreshToken);
    await this._userRepository.updateLastLogin(userId);

    this.log.success(LOG_ACTION.LOGIN, {
      userId,
      role: user.role,
      lastLogin: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: email.getValue(),
        role: user.role,
        status: user.status,
        profileImage: user.profileImage ?? null,
        applicationStatus,
        rejectionReason,
      },
    };
  }
}