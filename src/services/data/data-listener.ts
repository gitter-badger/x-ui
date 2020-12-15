import {
  DataEvent,
  DATA_COMMANDS,
  DATA_PROVIDER,
  DATA_TOPIC,
  IDataProvider,
  DATA_EVENTS,
  DataProviderRegistration,
} from './interfaces';
import { addProvider } from './provider-factory';
import { SessionProvider } from './provider-session';
import { StorageProvider } from './provider-storage';
import { IActionEventListener, ActionEvent } from '../actions';
import { warn, debugIf } from '../logging';
import { state } from '../state';
import { RouterService } from '../routing';
import { storageAvailable } from '../routing/utils/dom-utils';

export class DataListener implements IActionEventListener {
  document: HTMLDocument;
  eventOptions: EventListenerOptions = { capture: false };

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
    RouterService.instance?.onRouteChange(() => {
      this.dispatchDocumentEvent({ type: DATA_EVENTS.DataChanged});
    });
    provider.changed.on(DATA_EVENTS.DataChanged, (detail) => {
      debugIf(state.debug, `data-provider: ${name} changed`);
      this.dispatchDocumentEvent(detail);
    });
    addProvider(name, provider as IDataProvider);
  }

  private dispatchDocumentEvent(detail: DataEvent) {
    const event = new CustomEvent<DataEvent>(DATA_TOPIC, {
      composed: true,
      cancelable: true,
      bubbles: true,
      detail,
    });
    this.document.dispatchEvent(event);
  }

  private listen() {
    this.document.addEventListener(
      DATA_TOPIC,
      this.handleEvent,
      this.eventOptions);
  }

  handleEvent(ev: CustomEvent<ActionEvent<DataProviderRegistration>>) {
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
}
