

import { getProvider, clearProviders } from './provider-factory';
import { DATA_TOPIC, DATA_COMMANDS, ProviderListener, ProviderRegistration } from './provider-listener';
import { IDataProvider } from './interfaces';
import { InMemoryProvider } from './provider-memory';
import { ActionEvent } from '..';

type Listener = (ev:{ type: string, detail: ActionEvent<ProviderRegistration>}) => void

describe('data-provider-listener', () => {
  let subject: ProviderListener = null;
  let mockWindow:any;
  let mockDataProvider: IDataProvider;
  let listeners:Array<Listener> = [];

  beforeEach(() => {
    subject = new ProviderListener();
    mockWindow = {};
    mockWindow.document = {};
    mockWindow.document.addEventListener = (evt:string, func:Listener, _opts) => {
      expect(evt).toBe(DATA_TOPIC);
      listeners.push(func);
    };
    mockWindow.document.removeEventListener = (evt:string, func: Listener, _opts) => {
      expect(evt).toBe(DATA_TOPIC);
      listeners = listeners.filter(f => f !== func);
    };
    mockDataProvider = new InMemoryProvider();
    listeners = [];
    clearProviders();
  });

  it('detects session', async () => {
    mockWindow.sessionStorage = mockDataProvider;
    subject.initialize(mockWindow);
    const session = getProvider('session');
    expect(session).toBeDefined();
  });

  it('detects session failed', async () => {
    subject.initialize(mockWindow);
    const session = getProvider('session');
    expect(session).toBeNull();
  });


  it('detects storage', async () => {
    mockWindow.localStorage = mockDataProvider;
    subject.initialize(mockWindow);
    const storage = getProvider('storage');
    expect(storage).toBeDefined();
  });


  it('detects storage failed', async () => {
    subject.initialize(mockWindow);
    const storage = getProvider('storage');
    expect(storage).toBeNull();
  });

  it('eventListener: registers listeners events', async () => {
    mockWindow.localStorage = mockDataProvider;
    subject.initialize(mockWindow);
    expect(listeners.length).toBe(1);
  });

  it('eventListener: handles listeners events', async () => {
    mockWindow.localStorage = mockDataProvider;
    subject.initialize(mockWindow);
    expect(listeners.length).toBe(1);
    const event = new CustomEvent<ActionEvent<ProviderRegistration>>(
      DATA_TOPIC,
      {
        detail: {
          command: DATA_COMMANDS.RegisterDataProvider,
          data: {
            name: 'mock',
            provider: mockDataProvider,
          },
        }
      });

    let listener = listeners[0];
    listener.call(this, event);

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
