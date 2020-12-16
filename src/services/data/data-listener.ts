import {
  DATA_COMMANDS,
  DATA_PROVIDER,
  DATA_TOPIC,
  IDataProvider,
  DATA_EVENTS,
  DataProviderRegistration,
  SetData,
} from './interfaces';
import { addProvider, getProvider } from './provider-factory';
import { SessionProvider } from './provider-session';
import { StorageProvider } from './provider-storage';
import { IActionEventListener, ActionEvent } from '../actions';
import { warn, debugIf } from '../logging';
import { state } from '../state';
import { storageAvailable } from '../routing/utils/dom-utils';
import { EventEmitter } from '../actions/event-emitter';

export class DataListener implements IActionEventListener {
  bus: EventEmitter;
  window: Window;
  eventOptions: EventListenerOptions = { capture: false };

  constructor(win?: Window) {
    this.window = win || window;
  }

  public initialize(bus: EventEmitter) {
    this.bus = bus;
    this.registerBrowserProviders(this.window);
    bus.on(DATA_TOPIC, this.handleEvent);
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
    provider.changed.on(DATA_EVENTS.DataChanged, () => {
      debugIf(state.debug, `data-provider: ${name} changed`);
      this.dispatchDataChangedEvent();
    });
    addProvider(name, provider as IDataProvider);
  }

  private dispatchDataChangedEvent() {
    this.bus.emit(DATA_EVENTS.DataChanged);
  }

  handleEvent(actionEvent: ActionEvent<DataProviderRegistration|SetData>) {
    debugIf(state.debug, `data-listener: action received {${JSON.stringify(actionEvent)}}`);
    if (actionEvent.command === DATA_COMMANDS.RegisterDataProvider) {
      const { name, provider } = actionEvent.data as DataProviderRegistration;
      if (name && provider) {
        provider.changed.on(DATA_EVENTS.DataChanged, () => {
          debugIf(state.debug, `data-provider: ${name} changed`);
          this.dispatchDataChangedEvent();
        });
        addProvider(name, provider as IDataProvider);
      }
    } else if (actionEvent.command === DATA_COMMANDS.SetData) {
      const { provider, values } = actionEvent.data as SetData;
      if (provider && values) {
        const instance = getProvider(provider);
        if (instance) {
          Object.keys(values).forEach(async (key) => {
            await instance.set(key, values[key]);
          });
        }
      }
    }
  }

  destroy(): void {
    this.bus.removeListener(
      DATA_TOPIC,
      this.handleEvent);
  }
}
