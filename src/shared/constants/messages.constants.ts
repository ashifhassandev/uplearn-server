export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_NOT_FOUND: "No account found with this email",
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  INVALID_TOKEN: "Invalid or expired token",
  TOKEN_REUSE_DETECTED: "Session expired. Please login again.",
  OTP_NOT_FOUND: "OTP not found. Request for a new one.",
  INVALID_OTP: "Invalid OTP",
  OTP_EXPIRED: "OTP has expired. Please request a new one.",
  NO_PENDING_REGISTRATION:
    "No pending registration found. Please sign up again.",
  OTP_SIGNUP_EXPIRED: "OTP has expired. Please sign up again.",
  ACCOUNT_SUSPENDED: "Your account has been suspended. Please contact support.",
  ACCOUNT_DELETED: "This account no longer exists.",
} as const;

export const AUTH_SUCCESS = {
  FORGOT_PASSWORD: "An OTP has been sent to your email.",
  RESEND_OTP: "An OTP has been resend to your email.",
  RESET_PASSWORD: "Password reset successfully. Please login.",
  LOGOUT: "Logged out successfully",
  SIGNUP: "OTP sent to your email. Please verify to complete registration.",
  VERIFY_OTP: "Email verified successfully. You can now log in.",
} as const;

export const ADMIN_ERRORS = {
  ALREADY_SUSPENDED: "User is already suspended",
  ALREADY_ACTIVE: "User is already active",
  ALREADY_DELETED: "User is already deleted",
  APPLICATION_NOT_FOUND: "Application not found",
} as const;

export const ADMIN_SUCCESS = {
  SUSPEND_STUDENT: "Student suspended successfully",
  ACTIVATE_STUDENT: "Student activated successfully",
  DELETE_STUDENT: "Student deleted successfully",
  SUSPEND_TUTOR: "Tutor suspended successfully",
  ACTIVATE_TUTOR: "Tutor activated successfully",
  DELETE_TUTOR: "Tutor deleted successfully",
  APPROVE_TUTOR: "Tutor application approved successfully",
  REJECT_TUTOR: "Tutor application rejected successfully",
} as const;

export const TUTOR_ERRORS = {
  ONLY_STUDENTS_CAN_APPLY: "Only students can apply to become a tutor",
  ALREADY_APPLIED: "You have already submitted a tutor application",
  UNDER_REVIEW: "Your application is still under review",
  ALREADY_TUTOR: "You are already a tutor",
  TUTOR_NOT_FOUND: "Tutor not found",
} as const;

export const TUTOR_SUCCESS = {
  APPLICATION_SUBMITTED:
    "Your tutor application has been submitted successfully. Please wait for admin approval.",
  APPLICATION_RESUBMITTED: "Application resubmitted successfully",
} as const;

export const VALIDATION_ERRORS = {
  NO_FILE_PROVIDED: "No file provided",
  INVALID_FOLDER: "Invalid upload folder",
  FILE_TOO_LARGE: "File too large",
  FILE_TYPE_NOT_ALLOWED: "File type not allowed",
} as const;

export const DB_ERRORS = {
  CORRUPTED_USER_RECORD: "Corrupted user record in database",
  CORRUPTED_STUDENT_DETAILS_RECORD: "Corrupted student details record",
  CORRUPTED_INSTRUCTOR_DETAILS_RECORD: "Corrupted instructor details record",
} as const;