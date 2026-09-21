type LogContext = Record<string, unknown>;

export type LogReason = {
  code: string;
  message: string;
};

export type ContextLogger = {
  attempt: (action: string, meta?: LogContext) => void;
  success: (action: string, meta?: LogContext) => void;
  failed: (action: string, reason: LogReason, meta?: LogContext) => void;
  error: (action: string, err: unknown, meta?: LogContext) => void;
  debug: (action: string, meta?: LogContext) => void;
};