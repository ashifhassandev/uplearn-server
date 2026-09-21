export const TOKENS = {
  // Repositories
  IUserRepository: "IUserRepository",
  IAdminRepository: "IAdminRepository",
  IPendingRegistrationRepository: "IPendingRegistrationRepository",
  IOtpRepository: "IOtpRepository",
  IRefreshTokenRepository: "IRefreshTokenRepository",
  IStudentDetailsRepository: "IStudentDetailsRepository",
  IInstructorDetailsRepository: "IInstructorDetailsRepository",

  // Services
  IPasswordHasher: "IPasswordHasher",
  IEmailService: "IEmailService",
  ITokenService: "ITokenService",
  IStorageService: "IStorageService",
  ILogger: "ILogger",
  ICacheService: "ICacheService",

  // Use Cases: Auth
  ISignupUseCase: "ISignupUseCase",
  ILoginUseCase: "ILoginUseCase",
  IGoogleAuthUseCase: "IGoogleAuthUseCase",
  IResendSignupOtpUseCase: "IResendSignupOtpUseCase",
  IVerifyOtpUseCase: "IVerifyOtpUseCase",
  IVerifyResetOtpUseCase: "IVerifyResetOtpUseCase",
  IForgotPasswordUseCase: "IForgotPasswordUseCase",
  IResetPasswordUseCase: "IResetPasswordUseCase",
  IRefreshTokenUseCase: "IRefreshTokenUseCase",
  ILogoutUseCase: "ILogoutUseCase",
  IUploadFileUseCase: "IUploadFileUseCase",
  IGetStudentsUseCase: "IGetStudentsUseCase",
  IGetStudentUseCase: "IGetStudentUseCase",

  // Use Cases: Student
  IGetStudentProfileUseCase: "IGetStudentProfileUseCase",

  // Use Cases: Tutor
  IApplyTutorUseCase: "IApplyTutorUseCase",
  ISubmitDocumentUseCase: "ISubmitDocumentUseCase",
  IGetTutorProfileUseCase: "IGetTutorProfileUseCase",

  // Use Cases: Admin
  IGetTutorApplicationsUseCase: "IGetTutorApplicationsUseCase",
  IGetTutorApplicationUseCase: "IGetTutorApplicationUseCase",
  IApproveTutorUseCase: "IApproveTutorUseCase",
  IRejectTutorUseCase: "IRejectTutorUseCase",
  ISuspendStudentUseCase: "ISuspendStudentUseCase",
  IActivateStudentUseCase: "IActivateStudentUseCase",
  IDeleteStudentUseCase: "IDeleteStudentUseCase",
  IGetTutorUseCase: "IGetTutorUseCase",
  IGetTutorByIdUseCase: "IGetTutorByIdUseCase",
  ISuspendTutorUseCase: "ISuspendTutorUseCase",
  IActivateTutorUseCase: "IActivateTutorUseCase",
  IDeleteTutorUseCase: "IDeleteTutorUseCase",
} as const;