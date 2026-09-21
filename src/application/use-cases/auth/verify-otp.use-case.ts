import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import { VerifyOtpInputDTO } from "@/application/dto/auth/verify-otp.dto";
import { IPendingRegistrationRepository } from "@/application/ports/repositories/pending-registration.repository.interface";
import { IStudentDetailsRepository } from "@/application/ports/repositories/student-details.repository.interface";
import { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import { IVerifyOtpUseCase } from "@/application/ports/use-cases/auth/verify-otp.use-case.interface";
import { User } from "@/domain/entities/user.entity";
import { Email } from "@/domain/value-objects/email.value-object";
import { Password } from "@/domain/value-objects/password.value-object";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IPendingRegistrationRepository)
    private readonly _pendingRepo: IPendingRegistrationRepository,

    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.IStudentDetailsRepository)
    private readonly _studentDetailsRepository: IStudentDetailsRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.AUTH_USE_CASE);
  }

  async execute(input: VerifyOtpInputDTO): Promise<void> {
    this.log.attempt(LOG_ACTION.VERIFY_OTP, { email: input.email });

    const pending = await this._pendingRepo.findByEmail(input.email);
    if (!pending) {
      this.log.failed(
        LOG_ACTION.VERIFY_OTP,
        LOG_REASONS.AUTH.NO_PENDING_REGISTRATION,
        {
          email: input.email,
        },
      );
      throw new AppError(
        AUTH_ERRORS.NO_PENDING_REGISTRATION,
        HttpStatus.NOT_FOUND,
      );
    }

    if (pending.isExpired()) {
      this.log.failed(
        LOG_ACTION.VERIFY_OTP,
        LOG_REASONS.AUTH.OTP_SIGNUP_EXPIRED,
        {
          email: input.email,
        },
      );
      throw new AppError(AUTH_ERRORS.OTP_EXPIRED, HttpStatus.GONE);
    }

    if (pending.otpCode !== input.code) {
      this.log.failed(LOG_ACTION.VERIFY_OTP, LOG_REASONS.AUTH.INVALID_OTP, {
        email: input.email,
      });
      throw new AppError(AUTH_ERRORS.INVALID_OTP, HttpStatus.BAD_REQUEST);
    }

    const user = new User(
      null,
      pending.firstName,
      pending.lastName,
      new Email(pending.email),
      Password.fromHashed(pending.hashedPassword),
    );

    const savedUser = await this._userRepository.save(user);

    const userId = savedUser.id;
    if (!userId) {
      this.log.error(
        LOG_ACTION.VERIFY_OTP,
        new Error(LOG_REASONS.STATE.USER_ID_NULL.message),
        {
          email: input.email,
        },
      );
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._studentDetailsRepository.create(userId);
    await this._pendingRepo.deleteByEmail(input.email);

    this.log.success(LOG_ACTION.VERIFY_OTP, { email: input.email });
  }
}