import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
} from "@/application/constants/logger.constants";
import { IRefreshTokenRepository } from "@/application/ports/repositories/refresh-token.repository.interface";
import { ILogoutUseCase } from "@/application/ports/use-cases/auth/logout.use-case.interface";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IRefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.AUTH_USE_CASE);
  }

  async execute(userId: string): Promise<void> {
    this.log.attempt(LOG_ACTION.LOGOUT, { userId });

    await this._refreshTokenRepository.deleteByUserId(userId);

    this.log.success(LOG_ACTION.LOGOUT, { userId });
  }
}