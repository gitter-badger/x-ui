import {
  DATA_COMMANDS,
  DATA_PROVIDER,
  DATA_TOPIC,
  IDataProvider,
  DATA_EVENTS,
  ProviderRegistration,
} from './interfaces';
import { addProvider } from './provider-factory';
import { SessionProvider } from './provider-session';
import { StorageProvider } from './provider-storage';
import { IActionEventListener } from '../actions/interfaces';
import { ActionEvent } from '../actions';
import { warn, debugIf } from '../logging';
import { EventEmitter } from '../events';
import { state } from '../state';
import { storageAvailable } from '../utils/dom-utils';

export class ProviderListener implements IActionEventListener {
  document: HTMLDocument;
  eventOptions: EventListenerOptions = { capture: false };

  constructor() {
    this.changed = new EventEmitter();
  }

  public initialize(win:Window) {
    this.document = win.document;
    this.registerBrowserProviders(win);
    this.listen();
  }

  registerBrowserProviders(win: Window) {
    if (storageAvailable(win, 'sessionStorage')) {
      this.registerProvider(DATA_PROVIDER.SESSION, new SessionProvider());
    } else warn('data-provider: <session~not-supported></session~not-supported>');
    if (storageAvailable(win, 'localStorage')) {
      this.registerProvider(DATA_PROVIDER.STORAGE, new StorageProvider());
    } else warn('data-provider: <storage~not-supported>');
  }

  registerProvider(name: string, provider: IDataProvider) {
    provider.changed.on(DATA_EVENTS.DataChanged, (...args) => {
      debugIf(state.debug, `data-provider: <${name}~changed>`);
      this.changed.emit(DATA_EVENTS.DataChanged, args);
    });
    addProvider(name, provider as IDataProvider);
  }

  listen() {
    this.document.addEventListener(
      DATA_TOPIC,
      this.handleEvent,
      this.eventOptions);
  }

  handleEvent(ev: CustomEvent<ActionEvent<ProviderRegistration>>) {
    const actionEvent = ev.detail;
    if (actionEvent.command === DATA_COMMANDS.RegisterDataProvider) {
      const { name, provider } = actionEvent.data;
      if (name && provider) {
        this.registerProvider(name, provider);
      }
    }
  }

  destroy(): void {
    this.document.removeEventListener(
      DATA_TOPIC,
      this.handleEvent,
      this.eventOptions);
  }

  changed:EventEmitter;
}
