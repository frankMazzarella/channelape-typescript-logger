import { expect } from 'chai';
import * as sinon from 'sinon';
import * as winston from 'winston';
import LogLevel from '../../src/model/LogLevel';
import Logger from '../../src/utils/Logger';

describe('Logger', () => {

  let logger: Logger;
  let sandbox: sinon.SinonSandbox;
  let winstonStub: sinon.SinonStub;
  let fakeWinston: any;

  beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Date.prototype, 'getFullYear').returns(1984);
    sandbox.stub(Date.prototype, 'getMonth').returns(4);
    sandbox.stub(Date.prototype, 'getDate').returns(7);
    sandbox.stub(Date.prototype, 'getHours').returns(3);
    sandbox.stub(Date.prototype, 'getMinutes').returns(9);
    sandbox.stub(Date.prototype, 'getSeconds').returns(5);
    sandbox.stub(Date.prototype, 'getMilliseconds').returns(8);
    fakeWinston = {
      error: sinon.spy(),
      warn: sinon.spy(),
      info: sinon.spy(),
      debug: sinon.spy()
    };
    winstonStub = sandbox.stub(winston, 'Logger').returns(fakeWinston);
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('should format the date correctly based on local time', () => {
    const options = {
      message: 'message',
      level: 'error'
    };
    logger = new Logger('LogName', LogLevel.VERBOSE);
    const expectedErrorMessage = '[1984-05-07 03:09:05.008] [ERROR] message';
    expect(winstonStub.args[0][0].transports[0].formatter(options)).to.equal(expectedErrorMessage);
  });

  it('constructor should create winston logger with correct LogLevel when sent a LogLevel string', () => {
    logger = new Logger('LogName', 'ERROR');
    logger.error('This error is being reported by a logger with a string for a LogLevel');
    const expectedMessage = 'LogName - This error is being reported by a logger with a string for a LogLevel';
    expect(fakeWinston.error.called).to.be.true;
    expect(fakeWinston.error.args[0][0]).to.equal(expectedMessage);
  });

  it('constructor should create winston logger given LogLevel', () => {
    logger = new Logger('LogName', LogLevel.ERROR);
    expect(winstonStub.args[0][0].level).to.equal(LogLevel.ERROR);
  });

  it('constructor should create winston logger with default LogLevel if a bad string is passed in as LogLevel', () => {
    logger = new Logger('LogName', 'NOT_AN_ACTUAL_LEVEL');
    expect(winstonStub.args[0][0].level).to.equal(LogLevel.INFO);
  });

  it('constructor should create winston logger with LogLevel of "OFF" when given the string "OFF"', () => {
    logger = new Logger('LogName', 'OFF');
    expect(winstonStub.args[0][0].level).to.equal(LogLevel.OFF);
  });

  it('constructor should create winston logger with LogLevel of "ERROR" when given the string "ERROR"', () => {
    logger = new Logger('LogName', 'ERROR');
    expect(winstonStub.args[0][0].level).to.equal(LogLevel.ERROR);
  });

  it('constructor should create winston logger with LogLevel of "WARN" when given the string "WARN"', () => {
    logger = new Logger('LogName', 'WARN');
    expect(winstonStub.args[0][0].level).to.equal(LogLevel.WARN);
  });

  it('constructor should create winston logger with LogLevel of "INFO" when given the string "INFO"', () => {
    logger = new Logger('LogName', 'INFO');
    expect(winstonStub.args[0][0].level).to.equal(LogLevel.INFO);
  });

  it('constructor should create winston logger with LogLevel of "VERBOSE" when given the string "VERBOSE"', () => {
    logger = new Logger('LogName', 'VERBOSE');
    expect(winstonStub.args[0][0].level).to.equal(LogLevel.VERBOSE);
  });

  it('constructor should create winston logger with LogLevel of "DEBUG" when given the string "DEBUG"', () => {
    logger = new Logger('LogName', 'DEBUG');
    expect(winstonStub.args[0][0].level).to.equal(LogLevel.DEBUG);
  });

  it('error() should log when logLevel is ERROR or above', () => {
    logger = new Logger('LogName', LogLevel.ERROR);
    logger.error('ERROR');
    const expectedMessage = 'LogName - ERROR';
    expect(fakeWinston.error.called).to.be.true;
    expect(fakeWinston.error.args[0][0]).to.equal(expectedMessage);
  });

  it('warn() should log when logLevel is WARN or above', () => {
    logger = new Logger('LogName', LogLevel.WARN);
    logger.warn('WARN');
    const expectedMessage = 'LogName - WARN';
    expect(fakeWinston.warn.called).to.be.true;
    expect(fakeWinston.warn.args[0][0]).to.equal(expectedMessage);
  });

  it('info() should log when logLevel is INFO or above', () => {
    logger = new Logger('LogName', LogLevel.INFO);
    logger.info('INFO');
    const expectedMessage = 'LogName - INFO';
    expect(fakeWinston.info.called).to.be.true;
    expect(fakeWinston.info.args[0][0]).to.equal(expectedMessage);
  });

  it('debug() should log when logLevel is DEBUG or above', () => {
    logger = new Logger('LogName', LogLevel.DEBUG);
    logger.debug('DEBUG');
    const expectedMessage = 'LogName - DEBUG';
    expect(fakeWinston.debug.called).to.be.true;
    expect(fakeWinston.debug.args[0][0]).to.equal(expectedMessage);
  });
});
