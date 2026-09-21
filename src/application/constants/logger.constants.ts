/**
 * LOG_CONTEXT → WHERE the event happened
 * Format: Domain.Role.Layer
 */
export const LOG_CONTEXT = {
  // Auth
  AUTH_USE_CASE: "Auth.UseCase",
  AUTH_CONTROLLER: "Auth.Controller",

  // Student
  STUDENT_USE_CASE: "Student.UseCase",
  STUDENT_CONTROLLER: "Student.Controller",

  // Tutor
  TUTOR_USE_CASE: "Tutor.UseCase",
  TUTOR_CONTROLLER: "Tutor.Controller",

  // Admin - Students
  ADMIN_STUDENT_USE_CASE: "Admin.Student.UseCase",
  ADMIN_STUDENT_CONTROLLER: "Admin.Student.Controller",

  // Admin - Tutors
  ADMIN_TUTOR_USE_CASE: "Admin.Tutor.UseCase",
  ADMIN_TUTOR_CONTROLLER: "Admin.Tutor.Controller",

  // Admin - Applications
  ADMIN_APPLICATION_USE_CASE: "Admin.Application.UseCase",
  ADMIN_APPLICATION_CONTROLLER: "Admin.Application.Controller",

  // Storage
  STORAGE_USE_CASE: "Storage.UseCase",
  STORAGE_CONTROLLER: "Storage.Controller",
} as const;

/**
 * LOG_ACTION → WHAT action was performed
 * Use PascalCase consistently
 */
export const LOG_ACTION = {
  // Auth
  SIGNUP: "Signup",
  LOGIN: "Login",
  LOGOUT: "Logout",
  VERIFY_OTP: "VerifyOtp",
  VERIFY_RESET_OTP: "VerifyResetOtp",
  RESEND_OTP: "ResendOtp",
  FORGOT_PASSWORD: "ForgotPassword",
  RESET_PASSWORD: "ResetPassword",
  REFRESH_TOKEN: "RefreshToken",
  GOOGLE_AUTH: "GoogleAuth",

  // Google Auth Internals
  CREATE_USER_GOOGLE: "CreateUserGoogle",
  FIND_USER_GOOGLE: "FindUserGoogle",

  // Student
  GET_STUDENT_PROFILE: "GetStudentProfile",

  // Tutor
  APPLY_TUTOR: "ApplyTutor",
  GET_TUTOR_PROFILE: "GetTutorProfile",

  // Admin - Students
  GET_STUDENTS: "GetStudents",
  GET_STUDENT: "GetStudent",
  SUSPEND_STUDENT: "SuspendStudent",
  ACTIVATE_STUDENT: "ActivateStudent",
  DELETE_STUDENT: "DeleteStudent",

  // Admin - Tutors
  GET_TUTORS: "GetTutors",
  GET_TUTOR_BY_ID: "GetTutorById",
  SUSPEND_TUTOR: "SuspendTutor",
  ACTIVATE_TUTOR: "ActivateTutor",
  DELETE_TUTOR: "DeleteTutor",

  // Tutor Applications
  GET_TUTOR_APPLICATIONS: "GetTutorApplications",
  GET_TUTOR_APPLICATION: "GetTutorApplication",
  APPROVE_TUTOR: "ApproveTutor",
  REJECT_TUTOR: "RejectTutor",

  // Storage
  UPLOAD_FILE: "UploadFile",
} as const;

/**
 * LOG_REASONS → WHY something happened (especially failures)
 * Nested by domain. Always includes:
 * - code  → machine-readable (for alerts/monitoring)
 * - message → human-readable
 */
export const LOG_REASONS = {
  AUTH: {
    USER_NOT_FOUND: {
      code: "AUTH_001",
      message: "User not found",
    },
    INVALID_PASSWORD: {
      code: "AUTH_002",
      message: "Invalid password",
    },
    OTP_NOT_FOUND: {
      code: "AUTH_003",
      message: "OTP not found",
    },
    INVALID_OTP: {
      code: "AUTH_004",
      message: "Invalid OTP",
    },
    OTP_EXPIRED: {
      code: "AUTH_005",
      message: "OTP expired",
    },
    OTP_SIGNUP_EXPIRED: {
      code: "AUTH_006",
      message: "Signup OTP expired",
    },
    USER_ALREADY_EXISTS: {
      code: "AUTH_007",
      message: "User already exists",
    },
    NO_PENDING_REGISTRATION: {
      code: "AUTH_008",
      message: "No pending registration found",
    },
    INVALID_REFRESH_TOKEN: {
      code: "AUTH_009",
      message: "Invalid refresh token",
    },
    TOKEN_REUSE_DETECTED: {
      code: "AUTH_010",
      message: "Refresh token reuse detected",
    },
    EMAIL_NOT_FOUND: {
      code: "AUTH_011",
      message: "Email not found",
    },
  },

  VALIDATION: {
    NOT_A_STUDENT: {
      code: "VAL_001",
      message: "User role must be student",
    },
    ALREADY_APPLIED: {
      code: "VAL_002",
      message: "Tutor application already exists",
    },
    LIMIT_EXCEEDED: {
      code: "VAL_003",
      message: "Rate limit exceeded",
    },
    USER_ID_NULL: {
      code: "VAL_004",
      message: "User ID is null or invalid",
    },
  },

  STATE: {
    NOT_FOUND: {
      code: "STATE_001",
      message: "Resource not found",
    },
    ALREADY_IN_STATE: {
      code: "STATE_002",
      message: "Already in requested state",
    },
    USER_ID_NULL: {
      code: "STATE_003",
      message: "User ID is null after save",
    },
    TUTOR_ID_NULL: {
      code: "STATE_004",
      message: "Tutor ID is null after save",
    },
  },

  TUTOR: {
    NOT_FOUND: {
      code: "TUTOR_001",
      message: "Tutor not found",
    },
  },

  ADMIN: {
    ALREADY_SUSPENDED: {
      code: "ADMIN_001",
      message: "User already suspended",
    },
    ALREADY_ACTIVE: {
      code: "ADMIN_002",
      message: "User already active",
    },
    ALREADY_DELETED: {
      code: "ADMIN_003",
      message: "User already deleted",
    },
    ACCOUNT_SUSPENDED: {
      code: "ADMIN_004",
      message: "Account is suspended",
    },
    ACCOUNT_DELETED: {
      code: "ADMIN_005",
      message: "Account is deleted",
    },
    APPLICATION_NOT_FOUND: {
      code: "ADMIN_006",
      message: "Tutor application not found",
    },
    ALREADY_APPROVED: {
      code: "ADMIN_007",
      message: "Application already approved",
    },
    ALREADY_REJECTED: {
      code: "ADMIN_008",
      message: "Application already rejected",
    },
  },
} as const;