import type { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ZodError } from "zod";

import { TOKENS } from "../../application/constants/injection-token.constants";
import { HttpStatus } from "../../shared/enums/http-status.enum";
import { AppError } from "../../shared/errors/app.error";
import type { ILogger } from "../../shared/logger/logger.interface";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  const logger = container.resolve<ILogger>(TOKENS.ILogger);

  // Custom App Error
  if (err instanceof AppError) {
    logger.warn("Operational error", {
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    logger.warn("Validation error", { errors: err.issues });

    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: err.issues[0].message,
      errors: err.issues,
    });
  }

  // Unknown Error
  logger.error("Unexpected error", {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    path: req.path,
  });

  return res.status(HttpStatus.SERVER_ERROR).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : (err as Error).message,
  });
};