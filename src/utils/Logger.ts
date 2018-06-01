import * as util from 'util';
import * as winston from 'winston';
import LogLevel from '../model/LogLevel';

const LOG_FORMAT = '[%s] - %s';

export default class Logger {
  private logger: winston.LoggerInstance;
  private readonly logLevel: LogLevel;

  constructor(private readonly loggerName: string, logLevel: LogLevel | string) {
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
      const time = `${getHours(date)}:${getMinutes(date)}:${getSeconds(date)}.${getMilliseconds(date)}`;
      return `${yyyMmDd} ${time}`;
    }

    function getMonth(date: Date): string {
      return pad(date.getMonth() + 1, -2, '0');
    }

    function getDay(date: Date): string {
      return pad(date.getDate(), -2, '0');
    }

    function getHours(date: Date): string {
      return pad(date.getHours(), -2, '0');
    }

    function getMinutes(date: Date): string {
      return pad(date.getMinutes(), -2, '0');
    }

    function getSeconds(date: Date): string {
      return pad(date.getSeconds(), -2, '0');
    }

    function getMilliseconds(date: Date): string {
      return pad(date.getMilliseconds(), -3, '00');
    }

    function pad(value: number, length: number, leftPad: string): string {
      return (`${leftPad}${value.toString()}`.slice(length));
    }
  }
}
