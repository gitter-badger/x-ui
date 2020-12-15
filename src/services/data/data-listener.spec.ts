jest.mock('../logging');

import { getProvider, clearProviders } from './provider-factory';
import { DataListener } from './data-listener';
import { DATA_COMMANDS, DATA_TOPIC, IDataProvider, DataProviderRegistration } from './interfaces';
import { InMemoryProvider } from './provider-memory';
import { ActionEvent } from '..';

type Listener = (ev:{ type: string, detail: ActionEvent<DataProviderRegistration>}) => void

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
  let listeners:Array<Listener> = [];

  beforeEach(() => {
    mockDataProvider = new MockDataProvider();
    clearProviders();
    listeners = [];
    subject = new DataListener();
    mockWindow = {
      document:{
        addEventListener: (evt:string, func:Listener, _opts) => {
          expect(evt).toBe(DATA_TOPIC);
          listeners.push(func);
        },
        removeEventListener: (evt:string, func: Listener, _opts) => {
          expect(evt).toBe(DATA_TOPIC);
          listeners = listeners.filter(f => f !== func);
        }
      },
      sessionStorage: mockDataProvider,
      localStorage: mockDataProvider,
    };
  });


  it('detects session', async () => {
    subject.initialize(mockWindow);
    const session = getProvider('session');
    expect(session).toBeDefined();
  });


  it('detects session failed', async () => {
    delete mockWindow.sessionStorage;
    subject.initialize(mockWindow);
    const session = getProvider('session');
    expect(session).toBeNull();
  });


  it('detects storage', async () => {
    subject.initialize(mockWindow);
    const storage = getProvider('storage');
    expect(storage).toBeDefined();
  });


  it('detects storage failed', async () => {
    delete mockWindow.localStorage;
    subject.initialize(mockWindow);
    const storage = getProvider('storage');
    expect(storage).toBeNull();
  });

  it('eventListener: registers listeners events', async () => {
    subject.initialize(mockWindow);
    expect(listeners.length).toBe(1);
  });

  it('eventListener: handles listeners events', async () => {
    subject.initialize(mockWindow);
    expect(listeners.length).toBe(1);
    const event = new CustomEvent<ActionEvent<DataProviderRegistration>>(
      DATA_TOPIC,
      {
        detail: {
          topic: DATA_TOPIC,
          command: DATA_COMMANDS.RegisterDataProvider,
          data: {
            name: 'mock',
            provider: mockDataProvider,
          },
        }
      });

    let listener = listeners[0];
    listener.call(subject, event);

    const mock = getProvider('mock');
    expect(mock).toBeDefined();
    expect(mock).toBe(mockDataProvider);

  });

  it('eventListener: destroys', async () => {

    mockWindow.localStorage = mockDataProvider;

    subject.initialize(mockWindow);

    expect(listeners.length).toBe(1);

    subject.destroy();

    expect(listeners.length).toBe(0);
  });

});
