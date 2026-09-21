import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "@/domain/types/jwt-payload.type";
import type { TokenResult } from "@/domain/types/token-result.type";

export interface ITokenService {
  generateAccessToken(payload: AccessTokenPayload): string;
  generateRefreshToken(payload: RefreshTokenPayload): string;
  verifyAccessToken(token: string): TokenResult<AccessTokenPayload>;
  verifyRefreshToken(token: string): TokenResult<RefreshTokenPayload>;
}