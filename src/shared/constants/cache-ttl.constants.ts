export const CACHE_TTL = {
  ACCESS_TOKEN_BLOCKLIST: 15 * 60,
  REFRESH_TOKEN_BLOCKLIST: 7 * 24 * 60 * 60,
  OTP: 1 * 60,
} as const;