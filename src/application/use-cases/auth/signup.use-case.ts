import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import {
  SignupInputDTO,
  SignupOutputDTO,
} from "@/application/dto/auth/signup.dto";
import { IPendingRegistrationRepository } from "@/application/ports/repositories/pending-registration.repository.interface";
import { IUserRepository } from "@/application/ports/repositories/user.repository.interface";
import { IEmailService } from "@/application/ports/services/email.service.interface";
import { ISignupUseCase } from "@/application/ports/use-cases/auth/signup.use-case.interface";
import { PendingRegistration } from "@/domain/entities/pendingRegistration.entity";
import { IPasswordHasher } from "@/domain/ports/services/password-hasher.service.interface";
import { OtpGeneratorService } from "@/domain/services/otp-generator.service";
import { Email } from "@/domain/value-objects/email.value-object";
import { Password } from "@/domain/value-objects/password.value-object";
import { AUTH_ERRORS } from "@/shared/constants/messages.constants";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class SignupUseCase implements ISignupUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.IPendingRegistrationRepository)
    private readonly _pendingRepo: IPendingRegistrationRepository,

    @inject(TOKENS.IPasswordHasher)
    private readonly _hasher: IPasswordHasher,

    @inject(TOKENS.IEmailService)
    private readonly _emailService: IEmailService,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.AUTH_USE_CASE);
  }

  async execute(input: SignupInputDTO): Promise<SignupOutputDTO> {
    const email = new Email(input.email);

    this.log.attempt(LOG_ACTION.SIGNUP, { email: email.getValue() });

    const existingUser = await this._userRepository.findByEmail(
      email.getValue(),
    );
    if (existingUser) {
      this.log.failed(LOG_ACTION.SIGNUP, LOG_REASONS.AUTH.USER_ALREADY_EXISTS, {
        email: email.getValue(),
      });
      throw new AppError(AUTH_ERRORS.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    const password = await Password.create(input.password, this._hasher);
    const { code, expiresAt } = OtpGeneratorService.generateRaw();

    const pending = new PendingRegistration(
      null,
      input.firstName,
      input.lastName,
      email.getValue(),
      password.getHashedValue(),
      code,
      expiresAt,
    );

    await this._pendingRepo.save(pending);
    await this._emailService.sendOtp(email.getValue(), code);

    this.log.success(LOG_ACTION.SIGNUP, {
      email: email.getValue(),
      expiresAt,
    });

    return { email: email.getValue() };
  }
}