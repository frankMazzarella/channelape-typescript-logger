import * as util from 'util';
import * as winston from 'winston';
import LogLevel from '../model/LogLevel';

const LOG_FORMAT = '%s - %s';

export default class LoggerService {
  private readonly logger: winston.LoggerInstance;
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

// import Secrets from '../util/Secrets';
// import { LogLevel } from '../models/LogLevel.model';

// export default class Logger {
//   private loggerName: string;
//   private logLevel = this.getLogLevel();

//   constructor(loggerName: string) {
//     this.loggerName = loggerName;
//   }

//   public error(log: string): void {
//     const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
//     if (this.logLevel !== LogLevel.OFF && levels.indexOf(this.logLevel) !== -1) {
//       process.stderr.write(this.logFormatter(log, LogLevel.ERROR));
//     }
//   }

//   public warn(log: string): void {
//     const levels = [LogLevel.DEBUG, LogLevel.WARN, LogLevel.INFO];
//     if (this.logLevel !== LogLevel.OFF && levels.indexOf(this.logLevel) !== -1) {
//       process.stdout.write(this.logFormatter(log, LogLevel.WARN));
//     }
//   }

//   public info(log: string): void {
//     const levels = [LogLevel.INFO, LogLevel.DEBUG];
//     if (this.logLevel !== LogLevel.OFF && levels.indexOf(this.logLevel) !== -1) {
//       process.stdout.write(this.logFormatter(log, LogLevel.INFO));
//     }
//   }

//   public debug(log: string): void {
//     const levels = [LogLevel.DEBUG];
//     if (this.logLevel !== LogLevel.OFF && levels.indexOf(this.logLevel) !== -1) {
//       process.stderr.write(this.logFormatter(log, LogLevel.DEBUG));
//     }
//   }

//   private logFormatter(log: string, logLevel: LogLevel): string {
//     const now = new Date();
//     return `[${now.toISOString()}] [${logLevel}] [${this.loggerName}] - ${log}\n`;
//   }

//   private getLogLevel(): LogLevel {
//     const logLevelEnvar = Secrets.env.LOG_LEVEL.toUpperCase();
//     let logLevel: LogLevel;
//     switch (logLevelEnvar) {
//       case LogLevel.ERROR: logLevel = LogLevel.ERROR; break;
//       case LogLevel.WARN: logLevel = LogLevel.WARN; break;
//       case LogLevel.INFO: logLevel = LogLevel.INFO; break;
//       case LogLevel.DEBUG: logLevel = LogLevel.DEBUG; break;
//       case LogLevel.OFF: logLevel = LogLevel.OFF; break;
//       default: logLevel = LogLevel.INFO; break;
//     }
//     return logLevel;
//   }
// }
//    ========================


//    import { expect } from 'chai';
// import sinon from 'sinon';
// import LoggerService from '../../src/services/Logger.service';
// import Secrets from '../../src/util/Secrets';

// describe('Logger', () => {
//   let sandbox: sinon.SinonSandbox;
//   let errStub: sinon.SinonSpy;
//   let outStub: sinon.SinonSpy;

//   beforeEach(() => {
//     sandbox = sinon.createSandbox();
//     sandbox.stub(Date.prototype, 'toISOString').returns('iso_formatted_time');
//     errStub = sandbox.spy(process.stderr, 'write');
//     outStub = sandbox.spy(process.stdout, 'write');
//     Secrets.env.LOG_LEVEL = 'info';
//   });

//   afterEach(() => {
//     sandbox.restore();
//   });

//   it('creates error logs', () => {
//     const logger = new LoggerService('logger name');
//     logger.error('test');
//     const logStr = errStub.getCall(0).args[0];
//     expect(errStub.callCount).to.equal(1);
//     expect(logStr).to.equal('[iso_formatted_time] [ERROR] [logger name] - test\n');
//   });

//   it('creates warn logs', () => {
//     const logger = new LoggerService('logger name');
//     logger.warn('test');
//     const logStr = outStub.getCall(0).args[0];
//     expect(outStub.callCount).to.equal(1);
//     expect(logStr).to.equal('[iso_formatted_time] [WARN] [logger name] - test\n');
//   });

//   it('creates info logs', () => {
//     const logger = new LoggerService('logger name');
//     logger.info('test');
//     const logStr = outStub.getCall(0).args[0];
//     expect(outStub.callCount).to.equal(1);
//     expect(logStr).to.equal('[iso_formatted_time] [INFO] [logger name] - test\n');
//   });

//   it('creates debug logs', () => {
//     Secrets.env.LOG_LEVEL = 'debug';
//     const logger = new LoggerService('logger name');
//     logger.debug('test');
//     const logStr = errStub.getCall(0).args[0];
//     expect(errStub.callCount).to.equal(1);
//     expect(logStr).to.equal('[iso_formatted_time] [DEBUG] [logger name] - test\n');
//   });

//   it('will use log level info when log level is blank', () => {
//     Secrets.env.LOG_LEVEL = '';
//     const logger = new LoggerService('logger name');
//     logger.error('test');
//     logger.warn('test');
//     logger.info('test');
//     logger.debug('test');
//     expect(outStub.callCount).to.equal(2);
//     expect(errStub.callCount).to.equal(1);
//   });

//   it('will use log level info when log level do not match a predefined level', () => {
//     Secrets.env.LOG_LEVEL = 'something_else';
//     const logger = new LoggerService('logger name');
//     logger.error('test');
//     logger.warn('test');
//     logger.info('test');
//     logger.debug('test');
//     expect(outStub.callCount).to.equal(2);
//     expect(errStub.callCount).to.equal(1);
//   });

//   it('does not log at all on log level off', () => {
//     Secrets.env.LOG_LEVEL = 'off';
//     const logger = new LoggerService('logger name');
//     logger.error('test');
//     logger.warn('test');
//     logger.info('test');
//     logger.debug('test');
//     expect(outStub.callCount).to.equal(0);
//     expect(errStub.callCount).to.equal(0);
//   });

//   it('only logs error logs on log level error', () => {
//     Secrets.env.LOG_LEVEL = 'error';
//     const logger = new LoggerService('logger name');
//     logger.error('test');
//     logger.warn('test');
//     logger.info('test');
//     logger.debug('test');
//     expect(outStub.callCount).to.equal(0);
//     expect(errStub.callCount).to.equal(1);
//   });

//   it('only logs error and warn logs on log level warn', () => {
//     Secrets.env.LOG_LEVEL = 'warn';
//     const logger = new LoggerService('logger name');
//     logger.error('test');
//     logger.warn('test');
//     logger.info('test');
//     logger.debug('test');
//     expect(outStub.callCount).to.equal(1);
//     expect(errStub.callCount).to.equal(1);
//   });

//   it('only logs error, warn, and info logs on log level info', () => {
//     Secrets.env.LOG_LEVEL = 'info';
//     const logger = new LoggerService('logger name');
//     logger.error('test');
//     logger.warn('test');
//     logger.info('test');
//     logger.debug('test');
//     expect(outStub.callCount).to.equal(2);
//     expect(errStub.callCount).to.equal(1);
//   });

//   it('logs error, warn, info, and debug logs on log level debug', () => {
//     Secrets.env.LOG_LEVEL = 'debug';
//     const logger = new LoggerService('logger name');
//     logger.error('test');
//     logger.warn('test');
//     logger.info('test');
//     logger.debug('test');
//     expect(outStub.callCount).to.equal(2);
//     expect(errStub.callCount).to.equal(2);
//   });
// });
