import type { ILogger } from "./logger.interface";
import type { ContextLogger, LogReason } from "./logger-context.type";

export const createLogger = (
  logger: ILogger,
  context: string,
): ContextLogger => {
  return {
    attempt: (action, meta): void => {
      logger.info(`${context} - ${action} attempt`, meta);
    },
    success: (action, meta): void => {
      logger.info(`${context} - ${action} successful`, meta);
    },
    failed: (action, reason: LogReason, meta): void => {
      logger.warn(`${context} - ${action} failed`, {
        ...meta,
        reasonCode: reason.code,
        reasonMessage: reason.message,
      });
    },
    error: (action, err, meta): void => {
      logger.error(`${context} - ${action} failed unexpectedly`, {
        ...meta,
        error: (err as Error).message,
        stack: (err as Error).stack,
      });
    },
    debug: (action, meta): void => {
      logger.debug(`${context} - ${action}`, meta);
    },
  };
};