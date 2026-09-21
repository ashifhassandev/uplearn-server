import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";

import { ITokenService } from "@/application/ports/services/token.service.interface";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "@/domain/types/jwt-payload.type";
import { TokenResult } from "@/domain/types/token-result.type";

@injectable()
export class JWTService implements ITokenService {
  private readonly _accessSecret: string;
  private readonly _refreshSecret: string;

  constructor() {
    if (!process.env.ACCESS_TOKEN_SECRET)
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    if (!process.env.REFRESH_TOKEN_SECRET)
      throw new Error("REFRESH_TOKEN_SECRET is not defined");

    this._accessSecret = process.env.ACCESS_TOKEN_SECRET;
    this._refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  }

  generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, this._accessSecret, { expiresIn: "2m" });
  }

  generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, this._refreshSecret, { expiresIn: "7d" });
  }

  private verifyToken<T>(token: string, secret: string): TokenResult<T> {
    try {
      const payload = jwt.verify(token, secret) as T;
      return { success: true, payload };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return { success: false, reason: "expired" };
      }
      return { success: false, reason: "invalid" };
    }
  }

  verifyAccessToken(token: string): TokenResult<AccessTokenPayload> {
    return this.verifyToken<AccessTokenPayload>(token, this._accessSecret);
  }

  verifyRefreshToken(token: string): TokenResult<RefreshTokenPayload> {
    return this.verifyToken<RefreshTokenPayload>(token, this._refreshSecret);
  }
}