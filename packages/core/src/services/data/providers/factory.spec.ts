jest.mock('../../logging');

import { addDataProvider, getDataProvider } from './factory';
import { InMemoryProvider } from './memory';

describe('provider-factory', () => {

  var custom: InMemoryProvider;

  beforeEach(() => {
    custom = new InMemoryProvider();
    addDataProvider('custom', custom);
  });

  it('getProvider: incorrect name should return null', async () => {
    let provider = getDataProvider('bad');
    expect(provider).toBe(null);
  });


  it('getProvider: returns custom provider', async () => {
    let provider = getDataProvider('custom');
    expect(provider).toBe(custom);
  });

});
