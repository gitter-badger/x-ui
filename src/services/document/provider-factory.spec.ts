jest.mock('../logging');

import { setDocumentProvider, getDocumentProvider } from './provider-factory';
import { InMemoryDocumentProvider } from './provider-memory';

describe('provider-factory', () => {

  var custom: InMemoryDocumentProvider;

  beforeEach(() => {
    custom = new InMemoryDocumentProvider();

  });

  it('getProvider: incorrect name should return null', async () => {
    let provider = getDocumentProvider();
    expect(provider).toBe(null);
  });


  it('getProvider: returns custom provider', async () => {
    setDocumentProvider(custom);
    let provider = getDocumentProvider();
    expect(provider).toBe(custom);
  });

});
