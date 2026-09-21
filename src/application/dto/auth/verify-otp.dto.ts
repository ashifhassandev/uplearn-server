export type VerifyOtpInputDTO = {
  email: string;
  code: string;
}

export type VerifyResetOtpOutputDTO = {
  code: string;
}