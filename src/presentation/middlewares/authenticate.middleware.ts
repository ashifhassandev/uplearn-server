import type { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

import type { ITokenService } from "@/application/ports/services/token.service.interface";
import { HttpStatus } from "@/shared/enums/http-status.enum";

// Resolved once at module load, not on every request
const tokenService = container.resolve<ITokenService>("ITokenService");

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ success: false, message: "Access token required" });
    return;
  }

  // TokenResult discriminated union — distinguish expired vs invalid
  const result = tokenService.verifyAccessToken(authHeader.split(" ")[1]);

  if (!result.success) {
    const message =
      result.reason === "expired"
        ? "Access token expired"
        : "Invalid access token";
    res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message });
    return;
  }

  if (result.payload.status === "suspended") {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ success: false, message: "User suspended" });
    return;
  }

  req.user = result.payload;
  next();
};

export const authorizeRoles =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ success: false, message: "Insufficient permissions" });
      return;
    }
    next();
  };