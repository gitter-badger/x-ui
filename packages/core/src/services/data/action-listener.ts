import {
  DATA_COMMANDS,
  DATA_PROVIDER,
  DATA_TOPIC,
  IDataProvider,
  DATA_EVENTS,
  DataProviderRegistration,
  SetData,
} from './interfaces';
import { addDataProvider, getDataProvider } from './providers/factory';
import { SessionProvider } from './providers/session';
import { StorageProvider } from './providers/storage';
import { IEventActionListener, EventAction } from '../actions';
import { warn, debugIf } from '../logging';
import { state } from '../interface/state';
import { storageAvailable } from '../routing/utils/browser-utils';
import { EventEmitter } from '../actions/event-emitter';

export class DataListener implements IEventActionListener {
  bus: EventEmitter;
  window: Window;
  eventOptions: EventListenerOptions = { capture: false };
  unsubscribe: () => void;
  constructor(win?: Window) {
    this.window = win || window;
  }

  public initialize(bus: EventEmitter) {
    this.bus = bus;
    this.registerBrowserProviders(this.window);
    this.unsubscribe = bus.on(DATA_TOPIC, (e) => this.handleEvent(e));
  }

  registerBrowserProviders(win: Window) {
    if (storageAvailable(win, 'sessionStorage')) {
      this.registerProvider(DATA_PROVIDER.SESSION, new SessionProvider());
    } else warn('data-provider: session not supported');
    if (storageAvailable(win, 'localStorage')) {
      this.registerProvider(DATA_PROVIDER.STORAGE, new StorageProvider());
    } else warn('data-provider: storage not supported');
  }

  registerProvider(name: string, provider: IDataProvider) {
    const self = this;
    provider.changed.on(DATA_EVENTS.DataChanged, () => {
      debugIf(state.debug, `data-provider: ${name} changed`);
      self.dispatchDataChangedEvent();
    });
    addDataProvider(name, provider as IDataProvider);
  }

  private dispatchDataChangedEvent() {
    this.bus.emit(DATA_EVENTS.DataChanged);
  }

  handleEvent(actionEvent: EventAction<DataProviderRegistration|SetData>) {
    debugIf(state.debug, `data-listener: action received {command:${actionEvent.command}}`);
    if (actionEvent.command === DATA_COMMANDS.RegisterDataProvider) {
      const { name, provider } = actionEvent.data as DataProviderRegistration;
      if (name && provider) {
        this.registerProvider(name, provider);
      }
    } else if (actionEvent.command === DATA_COMMANDS.SetData) {
      const { provider, values } = actionEvent.data as SetData;
      if (provider && values) {
        const instance = getDataProvider(provider);
        if (instance) {
          Object.keys(values).forEach(async (key) => {
            await instance.set(key, values[key]);
          });
        }
      }
    }
  }

  destroy(): void {
    this.unsubscribe();
  }
}
