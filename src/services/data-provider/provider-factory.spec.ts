import { addProvider, getProvider } from './provider-factory';
import { InMemoryProvider } from "./provider-memory";

describe('provider-factory', () => {

  var custom: InMemoryProvider;

  beforeEach(() => {
    custom = new InMemoryProvider();
    addProvider('custom', custom);
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
