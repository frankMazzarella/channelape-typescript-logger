import { expect } from 'chai';
import * as ChannelApeLogger from '../src/index';

describe('Index', () => {

  it('Expect LogLevel to be exported', () => {
    expect(ChannelApeLogger.LogLevel).to.equal(ChannelApeLogger.LogLevel);
  });

  it('Expect Logger to be exported', () => {
    expect(ChannelApeLogger.Logger).to.equal(ChannelApeLogger.Logger);
  });


});
