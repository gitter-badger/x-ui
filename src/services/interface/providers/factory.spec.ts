jest.mock('../../logging');

import { setInterfaceProvider, getInterfaceProvider } from './factory';
import { DefaultInterfaceProvider } from './default';

describe('provider-factory', () => {

  var custom: DefaultInterfaceProvider;

  beforeEach(() => {
    custom = new DefaultInterfaceProvider();

  });

  it('getProvider: incorrect name should return null', async () => {
    let provider = getInterfaceProvider();
    expect(provider).toBe(null);
  });


  it('getProvider: returns custom provider', async () => {
    setInterfaceProvider(custom);
    let provider = getInterfaceProvider();
    expect(provider).toBe(custom);
  });

});
