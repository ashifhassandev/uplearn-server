import type { UserRole } from "../enums/user-role.enum";
import type { UserStatus } from "../enums/user-status.enum";

export type AccessTokenPayload = {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
};

export type RefreshTokenPayload = {
  readonly id: string;
};