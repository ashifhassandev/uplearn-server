import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import type {
  VerifyOtpInputDTO,
  VerifyResetOtpOutputDTO,
} from "@/application/dto/auth/verify-otp.dto";
import type { IOtpRepository } from "@/application/ports/repositories/otp.repository.interface";
import type { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import type { IVerifyResetOtpUseCase } from "@/application/ports/use-cases/auth/verify-reset-otp.use-case.interface";
import { Email } from "@/domain/value-objects/email.value-object";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class VerifyResetOtpUseCase implements IVerifyResetOtpUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.IOtpRepository)
    private readonly _otpRepository: IOtpRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.AUTH_USE_CASE);
  }

  async execute(input: VerifyOtpInputDTO): Promise<VerifyResetOtpOutputDTO> {
    const email = new Email(input.email);

    this.log.attempt(LOG_ACTION.VERIFY_RESET_OTP, { email: email.getValue() });

    const user = await this._userRepository.findByEmail(email.getValue());
    if (!user) {
      this.log.failed(
        LOG_ACTION.VERIFY_RESET_OTP,
        LOG_REASONS.AUTH.EMAIL_NOT_FOUND,
        {
          email: email.getValue(),
        },
      );
      throw new AppError(AUTH_ERRORS.EMAIL_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    const userId = user.id;
    if (!userId) {
      this.log.error(
        LOG_ACTION.VERIFY_RESET_OTP,
        new Error(LOG_REASONS.STATE.USER_ID_NULL.message),
        {
          email: input.email,
        },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const otp = await this._otpRepository.findByUserId(userId);
    if (!otp) {
      this.log.failed(
        LOG_ACTION.VERIFY_RESET_OTP,
        LOG_REASONS.AUTH.OTP_NOT_FOUND,
        {
          userId,
        },
      );
      throw new AppError(AUTH_ERRORS.OTP_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (otp.isExpired()) {
      this.log.failed(
        LOG_ACTION.VERIFY_RESET_OTP,
        LOG_REASONS.AUTH.OTP_EXPIRED,
        {
          userId,
        },
      );
      await this._otpRepository.deleteByUserId(userId);
      throw new AppError(AUTH_ERRORS.OTP_EXPIRED, HttpStatus.GONE);
    }

    if (otp.code !== input.code) {
      this.log.failed(
        LOG_ACTION.VERIFY_RESET_OTP,
        LOG_REASONS.AUTH.INVALID_OTP,
        {
          userId,
        },
      );
      throw new AppError(AUTH_ERRORS.INVALID_OTP, HttpStatus.BAD_REQUEST);
    }

    this.log.success(LOG_ACTION.VERIFY_RESET_OTP, { userId });

    return { code: input.code };
  }
}