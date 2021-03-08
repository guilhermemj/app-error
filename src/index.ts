import { v4 as uuid } from 'uuid';

export type ErrorLevel = "error" | "warn" | "info" | "debug";

export interface AppErrorOptions {
  httpStatusCode?: AppError['httpStatusCode'];
  code?: AppError['code'];
  level?: AppError['level'];
  meta?: AppError['meta'];
}

export default class AppError extends Error {
  httpStatusCode: number;
  code: string;
  level: ErrorLevel;
  meta: Record<string, any>;

  date: Date;
  id: string;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);

    this.httpStatusCode = options.httpStatusCode ?? 500;
    this.code = options.code ?? "ERR_UNCAUGHT_EXCEPTION";
    this.level = options.level ?? "error";
    this.meta = options.meta ?? {};

    this.date = new Date();
    this.id = uuid();
  }
}
