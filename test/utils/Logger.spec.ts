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

  it('constructor should create winston logger with correct formatter set', () => {
    const options = {
      message: 'message',
      level: 'error'
    };
    logger = new Logger('LogName', LogLevel.VERBOSE);
    expect(winstonStub.args[0][0].transports[0].formatter(options)).to.include('[ERROR] message');
  });

  it('constructor should create winston logger with correct LogLevel when sent a LogLevel string', () => {
    logger = new Logger('LogName', 'error');
    logger.error('ERROR');
    logger.warn('WARN');
    const expectedMessage = '[LogName] - ERROR';
    expect(fakeWinston.error.called).to.be.true;
    expect(fakeWinston.error.args[0][0]).to.equal(expectedMessage);
    expect(fakeWinston.warn.called).to.be.false;
  });

  it('constructor should create winston logger with default LogLevel if a bad string is passed in as LogLevel', () => {
    logger = new Logger('LogName', 'NOT_AN_ACTUAL_LEVEL');
    logger.info('INFO');
    const expectedMessage = '[LogName] - INFO';
    expect(fakeWinston.info.called).to.be.true;
    expect(fakeWinston.info.args[0][0]).to.equal(expectedMessage);
  });

  it('error() should log when logLevel is ERROR or above', () => {
    logger = new Logger('LogName', LogLevel.ERROR);
    logger.error('ERROR');
    const expectedMessage = '[LogName] - ERROR';
    expect(fakeWinston.error.called).to.be.true;
    expect(fakeWinston.error.args[0][0]).to.equal(expectedMessage);
  });

  it('warn() should log when logLevel is WARN or above', () => {
    logger = new Logger('LogName', LogLevel.WARN);
    logger.warn('WARN');
    const expectedMessage = '[LogName] - WARN';
    expect(fakeWinston.warn.called).to.be.true;
    expect(fakeWinston.warn.args[0][0]).to.equal(expectedMessage);
  });

  it('info() should log when logLevel is INFO or above', () => {
    logger = new Logger('LogName', LogLevel.INFO);
    logger.info('INFO');
    const expectedMessage = '[LogName] - INFO';
    expect(fakeWinston.info.called).to.be.true;
    expect(fakeWinston.info.args[0][0]).to.equal(expectedMessage);
  });

  it('debug() should log when logLevel is DEBUG or above', () => {
    logger = new Logger('LogName', LogLevel.DEBUG);
    logger.debug('DEBUG');
    const expectedMessage = '[LogName] - DEBUG';
    expect(fakeWinston.debug.called).to.be.true;
    expect(fakeWinston.debug.args[0][0]).to.equal(expectedMessage);
  });
});
