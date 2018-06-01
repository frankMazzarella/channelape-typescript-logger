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
    for (const logLevelKey in LogLevel) {
      const currentLogLevel = LogLevel[logLevelKey];
      if (logLevel.toLowerCase() === currentLogLevel) {
        return currentLogLevel as LogLevel;
      }
    }
    return LogLevel.INFO;
  }

  private createLogger() {
    return new winston.Logger({
      transports: [new winston.transports.Console({ formatter: this.logFormatter })],
      level: this.logLevel
    });
  }

  private logFormatter(options: any): string {
    const now = new Date();
    const timestamp = getTimeStamp(now);
    const level = options.level.toUpperCase();
    return `[${timestamp}] [${level}] ${options.message}`;

    function getTimeStamp(date: Date): string {
      const yyyMmDd = `${date.getFullYear()}-${getMonth(date)}-${getDay(date)}`;
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
      return `${yyyMmDd} ${time}`;
    }

    function getMonth(date: Date): string {
      return ('0' + date.getMonth()).slice(-2);
    }

    function getDay(date: Date): string {
      return ('0' + date.getDate()).slice(-2);
    }
  }
}
