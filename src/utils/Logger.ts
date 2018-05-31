import * as util from 'util';
import * as winston from 'winston';
import LogLevel from '../model/LogLevel';

const LOG_FORMAT = '[%s] - %s';

export default class Logger {
  private logger: winston.LoggerInstance;
  private logLevel: LogLevel;

  constructor(private loggerName: string, logLevel: LogLevel | string) {
    this.logLevel = this.getLogLevel(logLevel);
    this.logger = this.createLogger();
  }

  public error(log: string): void {
    this.logger.error(util.format(LOG_FORMAT, this.loggerName, log));
  }

  public warn(log: string): void {
    this.logger.warn(util.format(LOG_FORMAT, this.loggerName, log));
  }

  public info(log: string): void {
    this.logger.info(util.format(LOG_FORMAT, this.loggerName, log));
  }

  public debug(log: string): void {
    this.logger.debug(util.format(LOG_FORMAT, this.loggerName, log));
  }

  private getLogLevel(logLevel: LogLevel | string): LogLevel {
    const loweredLogLevel = logLevel.toLowerCase();
    let retLogLevel: LogLevel;
    switch (loweredLogLevel) {
      case('off'):
        retLogLevel = LogLevel.OFF;
        break;
      case('error'):
        retLogLevel = LogLevel.ERROR;
        break;
      case('warn'):
        retLogLevel = LogLevel.WARN;
        break;
      case('verbose'):
        retLogLevel = LogLevel.VERBOSE;
        break;
      case('debug'):
        retLogLevel = LogLevel.DEBUG;
        break;
      default:
        retLogLevel = LogLevel.INFO;
        break;
    }
    return retLogLevel;
  }

  private createLogger() {
    return new winston.Logger({
      transports: [new winston.transports.Console({ formatter: this.logFormatter })],
      level: this.logLevel
    });
  }

  private logFormatter(options: any): string {
    const now = new Date();
    const level = options.level.toUpperCase();
    return `[${now.toISOString()}] [${level}] ${options.message}`;
  }
}
