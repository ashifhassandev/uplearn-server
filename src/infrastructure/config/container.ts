import { container } from "tsyringe";

import type { ICacheService } from "@/application/ports/services/cache.service.interface";
import { GetTutorByIdUseCase } from "@/application/use-cases/admin/get-tutor-by-id.use-case";
import { ResendSignupOtpUseCase } from "@/application/use-cases/auth/resend-signup-otp.use-case";
import { VerifyResetOtpUseCase } from "@/application/use-cases/auth/verify-reset-otp.use-case";
import { GetTutorProfileUseCase } from "@/application/use-cases/tutor/get-tutor-profile.use-case";

import { TOKENS } from "../../application/constants/injection-token.constants";
import type { IStorageService } from "../../application/ports/services/storage.service.interface";
import { ActivateStudentUseCase } from "../../application/use-cases/admin/activate-student.use-case";
import { ActivateTutorUseCase } from "../../application/use-cases/admin/activate-tutor.use-case";
import { ApproveTutorApplicationUseCase } from "../../application/use-cases/admin/approve-tutor-applications.use-case";
import { DeleteStudentUseCase } from "../../application/use-cases/admin/delete-student.use-case";
import { DeleteTutorUseCase } from "../../application/use-cases/admin/delete-tutor.use-case";
import { GetStudentUseCase } from "../../application/use-cases/admin/get-student.use-case";
import { GetStudentsUseCase } from "../../application/use-cases/admin/get-students.use-case";
import { GetTutorApplicationUseCase } from "../../application/use-cases/admin/get-tutor-application.use-case";
import { GetTutorApplicationsUseCase } from "../../application/use-cases/admin/get-tutor-applications.use-case";
import { GetTutorsUseCase } from "../../application/use-cases/admin/get-tutors.use-case";
import { RejectTutorApplicationUseCase } from "../../application/use-cases/admin/reject-tutor-applications.use-case";
import { SuspendStudentUseCase } from "../../application/use-cases/admin/suspend-student.use-case";
import { SuspendTutorUseCase } from "../../application/use-cases/admin/suspend-tutor.use-case";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/forgot-password.use-case";
import { GoogleAuthUseCase } from "../../application/use-cases/auth/google-auth.usecase";
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case";
import { LogoutUseCase } from "../../application/use-cases/auth/logout.usecase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refresh-token.usecase";
import { ResetPasswordUseCase } from "../../application/use-cases/auth/reset-password.usecase";
import { SignupUseCase } from "../../application/use-cases/auth/signup.use-case";
import { VerifyOtpUseCase } from "../../application/use-cases/auth/verify-otp.use-case";
import { UploadFileUseCase } from "../../application/use-cases/storage/upload-file.use-case";
import { GetStudentProfileUseCase } from "../../application/use-cases/student/get-student-profile.use-case";
import { ApplyTutorUseCase } from "../../application/use-cases/tutor/apply-tutor.use-case";
import { RedisCacheService } from "../cache/redis-cache.service";
import { WinstonLogger } from "../logger/winston.logger";
import { AdminRepositoryImpl } from "../repositories/admin.repository.impl";
import { InstructorDetailsRepositoryImpl } from "../repositories/instructor-details.repository.impl";
import { OtpRepositoryImpl } from "../repositories/otp.repository.impl";
import { PendingRegistrationRepositoryImpl } from "../repositories/pending-registration.repository.impl";
import { RefreshTokenRepositoryImpl } from "../repositories/refresh-token.repository.impl";
import { StudentDetailsRepositoryImpl } from "../repositories/student-details.repository.impl";
import { UserRepositoryImpl } from "../repositories/user.repository.impl";
import { BcryptHasher } from "../services/BcryptHasher";
import { EmailService } from "../services/email.service";
import { JWTService } from "../services/jwt.service";
import { S3StorageService } from "../services/s3-storage.service";

// Repositories
container.registerSingleton(TOKENS.IUserRepository, UserRepositoryImpl);
container.registerSingleton(TOKENS.IAdminRepository, AdminRepositoryImpl);
container.registerSingleton(TOKENS.IOtpRepository, OtpRepositoryImpl);
container.registerSingleton(
  TOKENS.IPendingRegistrationRepository,
  PendingRegistrationRepositoryImpl,
);
container.registerSingleton(
  TOKENS.IRefreshTokenRepository,
  RefreshTokenRepositoryImpl,
);
container.registerSingleton(
  TOKENS.IStudentDetailsRepository,
  StudentDetailsRepositoryImpl,
);
container.registerSingleton(
  TOKENS.IInstructorDetailsRepository,
  InstructorDetailsRepositoryImpl,
);

// Services
container.registerSingleton(TOKENS.IEmailService, EmailService);
container.registerSingleton(TOKENS.IPasswordHasher, BcryptHasher);
container.registerSingleton(TOKENS.ITokenService, JWTService);
container.registerSingleton(TOKENS.ILogger, WinstonLogger);
container.registerSingleton<IStorageService>(
  TOKENS.IStorageService,
  S3StorageService,
);
container.registerSingleton<ICacheService>(
  TOKENS.ICacheService,
  RedisCacheService,
);

// Use cases
container.registerSingleton(TOKENS.ISignupUseCase, SignupUseCase);
container.registerSingleton(
  TOKENS.IResendSignupOtpUseCase,
  ResendSignupOtpUseCase,
);
container.registerSingleton(TOKENS.IVerifyOtpUseCase, VerifyOtpUseCase);
container.registerSingleton(
  TOKENS.IVerifyResetOtpUseCase,
  VerifyResetOtpUseCase,
);
container.registerSingleton(TOKENS.ILoginUseCase, LoginUseCase);
container.registerSingleton(TOKENS.IRefreshTokenUseCase, RefreshTokenUseCase);
container.registerSingleton(
  TOKENS.IForgotPasswordUseCase,
  ForgotPasswordUseCase,
);
container.registerSingleton(TOKENS.IResetPasswordUseCase, ResetPasswordUseCase);
container.registerSingleton(TOKENS.ILogoutUseCase, LogoutUseCase);
container.registerSingleton(TOKENS.IGoogleAuthUseCase, GoogleAuthUseCase);
container.registerSingleton(TOKENS.IApplyTutorUseCase, ApplyTutorUseCase);
container.registerSingleton(TOKENS.IUploadFileUseCase, UploadFileUseCase);
container.registerSingleton(TOKENS.IGetStudentsUseCase, GetStudentsUseCase);
container.registerSingleton(TOKENS.IGetStudentUseCase, GetStudentUseCase);
container.registerSingleton(
  TOKENS.IGetStudentProfileUseCase,
  GetStudentProfileUseCase,
);
container.registerSingleton(
  TOKENS.IActivateStudentUseCase,
  ActivateStudentUseCase,
);
container.registerSingleton(TOKENS.IDeleteStudentUseCase, DeleteStudentUseCase);
container.registerSingleton(
  TOKENS.ISuspendStudentUseCase,
  SuspendStudentUseCase,
);
container.registerSingleton(
  TOKENS.IGetTutorApplicationsUseCase,
  GetTutorApplicationsUseCase,
);
container.registerSingleton(
  TOKENS.IGetTutorApplicationUseCase,
  GetTutorApplicationUseCase,
);
container.registerSingleton(
  TOKENS.IApproveTutorUseCase,
  ApproveTutorApplicationUseCase,
);
container.registerSingleton(
  TOKENS.IRejectTutorUseCase,
  RejectTutorApplicationUseCase,
);
container.registerSingleton(TOKENS.IGetTutorUseCase, GetTutorsUseCase);
container.registerSingleton(TOKENS.IGetTutorByIdUseCase, GetTutorByIdUseCase);
container.registerSingleton(
  TOKENS.IGetTutorProfileUseCase,
  GetTutorProfileUseCase,
);
container.registerSingleton(TOKENS.IActivateTutorUseCase, ActivateTutorUseCase);
container.registerSingleton(TOKENS.IDeleteTutorUseCase, DeleteTutorUseCase);
container.registerSingleton(TOKENS.ISuspendTutorUseCase, SuspendTutorUseCase);