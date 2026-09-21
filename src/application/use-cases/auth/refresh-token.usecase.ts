import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import { RefreshTokenOutputDTO } from "@/application/dto/auth/refresh-token.dto";
import { IRefreshTokenRepository } from "@/application/ports/repositories/refresh-token.repository.interface";
import { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import { ITokenService } from "@/application/ports/services/token.service.interface";
import { IRefreshTokenUseCase } from "@/application/ports/use-cases/auth/refresh-token.use-case.interface";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.IRefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,

    @inject(TOKENS.ITokenService)
    private readonly _tokenService: ITokenService,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.AUTH_USE_CASE);
  }

  async execute(refreshToken: string): Promise<RefreshTokenOutputDTO> {
    this.log.attempt(LOG_ACTION.REFRESH_TOKEN);

    const result = this._tokenService.verifyRefreshToken(refreshToken);
    if (!result.success) {
      this.log.failed(
        LOG_ACTION.REFRESH_TOKEN,
        LOG_REASONS.AUTH.INVALID_REFRESH_TOKEN,
      );
      throw new AppError(AUTH_ERRORS.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    const storedToken = await this._refreshTokenRepository.findByUserId(
      result.payload.id,
    );
    if (!storedToken || storedToken !== refreshToken) {
      this.log.failed(
        LOG_ACTION.REFRESH_TOKEN,
        LOG_REASONS.AUTH.TOKEN_REUSE_DETECTED,
        {
          userId: result.payload.id,
        },
      );
      throw new AppError(AUTH_ERRORS.INVALID_TOKEN, HttpStatus.GONE);
    }

    const user = await this._userRepository.findById(result.payload.id);
    if (!user) {
      this.log.failed(
        LOG_ACTION.REFRESH_TOKEN,
        LOG_REASONS.AUTH.USER_NOT_FOUND,
        {
          userId: result.payload.id,
        },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    }

    const userId = user.id;
    if (!userId) {
      this.log.error(
        LOG_ACTION.REFRESH_TOKEN,
        new Error(LOG_REASONS.STATE.USER_ID_NULL.message),
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const accessToken = this._tokenService.generateAccessToken({
      id: userId,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    this.log.success(LOG_ACTION.REFRESH_TOKEN, { userId });

    return { accessToken };
  }
}