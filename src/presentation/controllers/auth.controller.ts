import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
} from "@/application/constants/logger.constants";
import { LoginInputDTO } from "@/application/dto/auth/login.dto";
import { SignupInputDTO } from "@/application/dto/auth/signup.dto";
import { IForgotPasswordUseCase } from "@/application/ports/use-cases/auth/forgot-password.use-case.interface";
import { ILoginUseCase } from "@/application/ports/use-cases/auth/login.use-case.interface";
import { ILogoutUseCase } from "@/application/ports/use-cases/auth/logout.use-case.interface";
import { IRefreshTokenUseCase } from "@/application/ports/use-cases/auth/refresh-token.use-case.interface";
import { IResendSignupOtpUseCase } from "@/application/ports/use-cases/auth/resend-signup-otp.use-case.interface";
import { IResetPasswordUseCase } from "@/application/ports/use-cases/auth/reset-password.use-case.interface";
import { ISignupUseCase } from "@/application/ports/use-cases/auth/signup.use-case.interface";
import { IVerifyOtpUseCase } from "@/application/ports/use-cases/auth/verify-otp.use-case.interface";
import { IVerifyResetOtpUseCase } from "@/application/ports/use-cases/auth/verify-reset-otp.use-case.interface";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
} from "@/presentation/constants/cookie.constants";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/presentation/validations/forgot-password.schema";
import { loginSchema } from "@/presentation/validations/login.schema";
import { signupSchema } from "@/presentation/validations/signup.schema";
import { verifyOtpSchema } from "@/presentation/validations/verify.otp.schema";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export default class AuthController {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.ISignupUseCase)
    private readonly _signupUseCase: ISignupUseCase,

    @inject(TOKENS.ILoginUseCase)
    private readonly _loginUseCase: ILoginUseCase,

    @inject(TOKENS.IResendSignupOtpUseCase)
    private readonly _resendSignupOtpUseCase: IResendSignupOtpUseCase,

    @inject(TOKENS.IVerifyOtpUseCase)
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,

    @inject(TOKENS.IVerifyResetOtpUseCase)
    private readonly _verifyResetOtpUseCase: IVerifyResetOtpUseCase,

    @inject(TOKENS.IForgotPasswordUseCase)
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,

    @inject(TOKENS.IResetPasswordUseCase)
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,

    @inject(TOKENS.IRefreshTokenUseCase)
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,

    @inject(TOKENS.ILogoutUseCase)
    private readonly _logoutUseCase: ILogoutUseCase,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.AUTH_CONTROLLER);
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.SIGNUP);

    const validatedData = signupSchema.parse(req.body);

    const input: SignupInputDTO = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: validatedData.password,
    };

    const result = await this._signupUseCase.execute(input);

    this.log.success(LOG_ACTION.SIGNUP, { email: result.email });

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email: result.email,
    });
  }

  public async resendOtp(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.RESEND_OTP);

    const { email } = forgotPasswordSchema.parse(req.body);

    await this._resendSignupOtpUseCase.execute({ email });

    this.log.success(LOG_ACTION.RESEND_OTP, { email });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "OTP resent successfully.",
    });
  }

  public async verifyOtp(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.VERIFY_OTP);

    const { email, code } = verifyOtpSchema.parse(req.body);

    await this._verifyOtpUseCase.execute({ email, code });

    this.log.success(LOG_ACTION.VERIFY_OTP, { email });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  }

  public async verifyResetOtp(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.VERIFY_RESET_OTP);

    const { email, code } = verifyOtpSchema.parse(req.body);

    const result = await this._verifyResetOtpUseCase.execute({ email, code });

    this.log.success(LOG_ACTION.VERIFY_RESET_OTP, { email });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "OTP verified. You may now reset your password.",
      code: result.code,
    });
  }

  public async loginUser(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.LOGIN);

    const validatedData = loginSchema.parse(req.body);

    const input: LoginInputDTO = {
      email: validatedData.email,
      password: validatedData.password,
    };

    const result = await this._loginUseCase.execute(input);

    this.log.success(LOG_ACTION.LOGIN, { email: input.email });

    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, COOKIE_OPTIONS);

    return res.status(HttpStatus.OK).json({
      success: true,
      accessToken: result.accessToken,
      user: result.user,
    });
  }

  public async refreshToken(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.REFRESH_TOKEN);

    const token = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];
    if (!token) {
      this.log.failed(LOG_ACTION.REFRESH_TOKEN, {
        code: "AUTH_009",
        message: "Refresh token not found in cookie",
      });
      throw new AppError("Refresh token not found", HttpStatus.UNAUTHORIZED);
    }

    const result = await this._refreshTokenUseCase.execute(token);

    this.log.success(LOG_ACTION.REFRESH_TOKEN);

    return res.status(HttpStatus.OK).json({
      success: true,
      accessToken: result.accessToken,
    });
  }

  public async forgotPassword(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.FORGOT_PASSWORD);

    const { email } = forgotPasswordSchema.parse(req.body);

    await this._forgotPasswordUseCase.execute({ email });

    this.log.success(LOG_ACTION.FORGOT_PASSWORD, { email });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "If that email is registered, an OTP has been sent.",
      email,
    });
  }

  public async resetPassword(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.RESET_PASSWORD);

    const validated = resetPasswordSchema.parse(req.body);

    await this._resetPasswordUseCase.execute({
      email: validated.email,
      code: validated.code,
      newPassword: validated.newPassword,
    });

    this.log.success(LOG_ACTION.RESET_PASSWORD, { email: validated.email });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.LOGOUT);

    const userId = (req.user as { id: string } | undefined)?.id;

    if (userId) {
      await this._logoutUseCase.execute(userId);
      this.log.success(LOG_ACTION.LOGOUT, { userId });
    }

    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, COOKIE_OPTIONS);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Logged out successfully.",
    });
  }
}