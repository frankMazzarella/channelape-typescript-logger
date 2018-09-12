import { expect } from 'chai';
import * as ChannelApeLogger from '../src/index';

describe('Index', () => {
  it('Expect LogLevel to be exported', () => {
    expect(ChannelApeLogger.LogLevel).not.to.be.undefined;
  });

  it('Expect Logger to be exported', () => {
    expect(ChannelApeLogger.Logger).not.to.be.undefined;
  });
});
