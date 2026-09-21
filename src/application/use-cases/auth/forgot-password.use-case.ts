import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import {
  ForgotPasswordInputDTO,
  ForgotPasswordOutputDTO,
} from "@/application/dto/auth/forgot-password.dto";
import { IOtpRepository } from "@/application/ports/repositories/otp.repository.interface";
import { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import { IEmailService } from "@/application/ports/services/email.service.interface";
import { IForgotPasswordUseCase } from "@/application/ports/use-cases/auth/forgot-password.use-case.interface";
import { OtpGeneratorService } from "@/domain/services/otp-generator.service";
import { Email } from "@/domain/value-objects/email.value-object";
import {
  AUTH_ERRORS,
  AUTH_SUCCESS,
} from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.IOtpRepository)
    private readonly _otpRepository: IOtpRepository,

    @inject(TOKENS.IEmailService)
    private readonly _emailService: IEmailService,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.AUTH_USE_CASE);
  }

  async execute(
    input: ForgotPasswordInputDTO,
  ): Promise<ForgotPasswordOutputDTO> {
    const email = new Email(input.email);

    this.log.attempt(LOG_ACTION.FORGOT_PASSWORD, { email: email.getValue() });

    const user = await this._userRepository.findByEmail(email.getValue());
    if (!user) {
      this.log.failed(
        LOG_ACTION.FORGOT_PASSWORD,
        LOG_REASONS.AUTH.EMAIL_NOT_FOUND,
        {
          email: email.getValue(),
        },
      );
      throw new AppError(AUTH_ERRORS.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const userId = user.id;
    if (!userId) {
      this.log.error(
        LOG_ACTION.FORGOT_PASSWORD,
        new Error(LOG_REASONS.STATE.USER_ID_NULL.message),
        {
          email: input.email,
        },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const otp = OtpGeneratorService.generate(userId);

    await this._otpRepository.save(otp);
    await this._emailService.sendOtp(email.getValue(), otp.code);

    this.log.success(LOG_ACTION.FORGOT_PASSWORD, { userId });

    return { message: AUTH_SUCCESS.FORGOT_PASSWORD };
  }
}