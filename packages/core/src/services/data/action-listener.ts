import { IEventEmitter } from '../../../dist/types/services/actions/interfaces';
import { EventAction, IEventActionListener } from '../actions';
import { } from '../actions/event-emitter';
import { state } from '../interface/state';
import { debugIf, warn } from '../logging';
import { storageAvailable } from '../routing/utils/browser-utils';
import {
  DataProviderRegistration, DATA_COMMANDS,
  DATA_EVENTS, DATA_PROVIDER,
  DATA_TOPIC,
  IDataProvider,
  SetData
} from './interfaces';
import { addDataProvider, getDataProvider } from './providers/factory';
import { SessionProvider } from './providers/session';
import { StorageProvider } from './providers/storage';

export class DataListener implements IEventActionListener {
  private eventBus: IEventEmitter;

  public initialize(
    window: Window,
    actionBus: IEventEmitter,
    eventBus: IEventEmitter)
  {
    this.eventBus = eventBus;
    actionBus.on(DATA_TOPIC, (e) => this.handleAction(e));

    this.registerBrowserProviders(window);
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
      this.eventBus.emit(DATA_EVENTS.DataChanged, {});
    });
    addDataProvider(name, provider as IDataProvider);
  }


  handleAction(actionEvent: EventAction<DataProviderRegistration|SetData>) {
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

}
