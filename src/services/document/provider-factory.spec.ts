jest.mock('../logging');

import { setProvider, getProvider } from './provider-factory';
import { InMemoryDocumentProvider } from './provider-memory';

describe('provider-factory', () => {

  var custom: InMemoryDocumentProvider;

  beforeEach(() => {
    custom = new InMemoryDocumentProvider();
    setProvider('custom', custom);
  });

  it('getProvider: incorrect name should return null', async () => {
    let provider = getProvider('bad');
    expect(provider).toBe(null);
  });


  it('getProvider: returns custom provider', async () => {
    let provider = getProvider('custom');
    expect(provider).toBe(custom);
  });

});
