jest.mock('../logging');

import { getProvider, clearProviders, getProviders } from './provider-factory';
import { DataListener } from './data-listener';
import { DATA_COMMANDS, DATA_TOPIC, IDataProvider } from './interfaces';
import { InMemoryProvider } from './provider-memory';
import { EventEmitter } from '..';

class MockDataProvider extends InMemoryProvider {
  setItem(x,y) {
    this.set(x, y);
  }
  removeItem(_x) {
    delete this.data[_x];
  }
}

describe('data-provider-listener', () => {
  let subject: DataListener = null;
  let mockWindow:any;
  let mockDataProvider: IDataProvider;
  let bus: EventEmitter;
  beforeEach(() => {
    mockDataProvider = new MockDataProvider();
    clearProviders();
    bus = new EventEmitter();
    mockWindow = {
      sessionStorage: mockDataProvider,
      localStorage: mockDataProvider,
    };
  });


  it('detects session', async () => {
    subject = new DataListener(mockWindow);
    subject.initialize(bus);
    const session = getProvider('session');
    expect(session).toBeDefined();
  });


  it('detects session failed', async () => {
    delete mockWindow.sessionStorage;
    subject = new DataListener(mockWindow);
    subject.initialize(bus);
    const session = getProvider('session');
    expect(session).toBeNull();
  });


  it('detects storage', async () => {
    subject = new DataListener(mockWindow);
    subject.initialize(bus);
    const storage = getProvider('storage');
    expect(storage).toBeDefined();
  });


  it('detects storage failed', async () => {
    delete mockWindow.localStorage;
    subject = new DataListener(mockWindow);
    subject.initialize(bus);
    const storage = getProvider('storage');
    expect(storage).toBeNull();
  });

  it('eventListener: registers listeners events', async () => {
    subject = new DataListener(mockWindow);
    subject.initialize(bus);
    const listeners = getProviders();
    expect(Object.keys(listeners).length).toBe(2);
  });

  it('eventListener: handles listeners events', async () => {
    subject = new DataListener(mockWindow);
    subject.initialize(bus);
    const listeners = getProviders();
    expect(Object.keys(listeners).length).toBe(2);

    const event = {
      command: DATA_COMMANDS.RegisterDataProvider,
      data: {
        name: 'mock',
        provider: mockDataProvider,
      },
    };

    bus.emit(DATA_TOPIC, event);

    const mock = getProvider('mock');
    expect(mock).toBeDefined();
    expect(mock).toBe(mockDataProvider);

  });

  it('eventListener: destroys', async () => {
    subject = new DataListener(mockWindow);
    subject.initialize(bus);
    const listeners = getProviders();
    expect(Object.keys(listeners).length).toBe(2);

    subject.destroy();

    expect(bus.events[DATA_TOPIC].length).toBe(0);
  });

});
