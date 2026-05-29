import type { BaseConfig } from "../config/env.js";

type LogLevel = BaseConfig["LOG_LEVEL"];

type LogFields = Record<string, unknown>;

const weights: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

export class Logger {
  public constructor(
    private readonly baseFields: LogFields,
    private readonly level: LogLevel
  ) {}

  public debug(message: string, fields: LogFields = {}): void {
    this.write("debug", message, fields);
  }

  public info(message: string, fields: LogFields = {}): void {
    this.write("info", message, fields);
  }

  public warn(message: string, fields: LogFields = {}): void {
    this.write("warn", message, fields);
  }

  public error(message: string, fields: LogFields = {}): void {
    this.write("error", message, fields);
  }

  private write(level: LogLevel, message: string, fields: LogFields): void {
    if (weights[level] < weights[this.level]) {
      return;
    }

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.baseFields,
      ...fields
    };

    const serialized = JSON.stringify(entry);

    if (level === "error") {
      console.error(serialized);
      return;
    }

    if (level === "warn") {
      console.warn(serialized);
      return;
    }

    console.info(serialized);
  }
}

export function createLogger(baseFields: LogFields, level: LogLevel): Logger {
  return new Logger(baseFields, level);
}
