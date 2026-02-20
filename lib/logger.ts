/**
 * 结构化日志工具
 *
 * 提供统一的日志格式，支持环境敏感的日志级别
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

const LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
  [LogLevel.SILENT]: "SILENT",
};

// 根据环境确定日志级别
function getDefaultLogLevel(): LogLevel {
  if (process.env.NODE_ENV === "production") {
    // 生产环境可以通过环境变量控制日志级别
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case "DEBUG":
        return LogLevel.DEBUG;
      case "INFO":
        return LogLevel.INFO;
      case "WARN":
        return LogLevel.WARN;
      case "ERROR":
        return LogLevel.ERROR;
      case "SILENT":
        return LogLevel.SILENT;
      default:
        return LogLevel.WARN; // 生产环境默认只显示警告和错误
    }
  }
  return LogLevel.DEBUG; // 开发环境显示所有日志
}

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = getDefaultLogLevel();
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level: LEVEL_NAMES[level],
      message,
      context,
    };
  }

  private output(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.formatMessage(level, message, context);

    // 生产环境可以考虑发送到日志服务（如 Sentry、LogDNA 等）
    if (process.env.NODE_ENV === "production") {
      // 这里可以集成第三方日志服务
      // 例如: Sentry.captureMessage(message, { level, extra: context });

      // 生产环境使用更简洁的输出
      const output = error
        ? `[${entry.timestamp}] ${entry.level}: ${entry.message}`
        : `[${entry.timestamp}] ${entry.level}: ${entry.message}`;

      switch (level) {
        case LogLevel.ERROR:
          console.error(output, error || "", context || "");
          break;
        case LogLevel.WARN:
          console.warn(output);
          break;
        case LogLevel.INFO:
          console.info(output);
          break;
        default:
          // DEBUG 级别在生产环境不输出
          break;
      }
      return;
    }

    // 开发环境使用彩色输出和完整信息
    const styles: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: "\x1b[36m%s\x1b[0m", // 青色
      [LogLevel.INFO]: "\x1b[32m%s\x1b[0m", // 绿色
      [LogLevel.WARN]: "\x1b[33m%s\x1b[0m", // 黄色
      [LogLevel.ERROR]: "\x1b[31m%s\x1b[0m", // 红色
      [LogLevel.SILENT]: "", // 空字符串，不会使用
    };

    const prefix = `[${entry.timestamp}] ${entry.level}:`;
    const styledPrefix = styles[level]
      ? styles[level].replace("%s", prefix)
      : prefix;

    if (error) {
      console.group(styledPrefix, message);
      if (context) console.log("Context:", context);
      console.error("Error:", error);
      console.groupEnd();
    } else if (context) {
      console.log(styledPrefix, message, context);
    } else {
      console.log(styledPrefix, message);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.output(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.output(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.output(LogLevel.WARN, message, context);
  }

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): void {
    this.output(LogLevel.ERROR, message, context, error);
  }

  // API 路由专用日志方法
  api(
    request: Request,
    message: string,
    context?: Record<string, unknown>,
  ): void {
    const url = new URL(request.url);
    this.info(`[API] ${message}`, {
      method: request.method,
      path: url.pathname,
      ...context,
    });
  }

  apiError(
    request: Request,
    message: string,
    error: Error,
    context?: Record<string, unknown>,
  ): void {
    const url = new URL(request.url);
    this.error(`[API] ${message}`, error, {
      method: request.method,
      path: url.pathname,
      ...context,
    });
  }
}

// 单例实例
export const logger = new Logger();

// 便捷导出
export const debug = (message: string, context?: Record<string, unknown>) =>
  logger.debug(message, context);
export const info = (message: string, context?: Record<string, unknown>) =>
  logger.info(message, context);
export const warn = (message: string, context?: Record<string, unknown>) =>
  logger.warn(message, context);
export const error = (
  message: string,
  err?: Error,
  context?: Record<string, unknown>,
) => logger.error(message, err, context);
