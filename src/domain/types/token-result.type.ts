export type TokenResult<T> =
  | { success: true; payload: T }
  | { success: false; reason: "expired" | "invalid" };