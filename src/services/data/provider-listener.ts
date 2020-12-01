import { IDataProvider } from './interfaces';
import { ACTIONS, addProvider, ProviderRegistration } from './provider-factory';
import { SessionProvider } from './provider-session';
import { StorageProvider } from './provider-storage';
import { IActionEventListener } from '../actions/interfaces';
import { LoggingService } from '../logging-service';

export enum DATA_PROVIDER {
  SESSION = 'session',
  STORAGE = 'storage'
}

export class ProviderListener implements IActionEventListener {
  document: HTMLDocument;
  logger: LoggingService;
  eventOptions: EventListenerOptions = { capture: true };

  public initialize(win:Window, logger?:LoggingService) {
    this.logger = logger;
    this.document = win.document;
    this.registerBrowserProviders(win);
    this.addRegistrationListener();
  }

  registerBrowserProviders(win: Window) {
    if (win.sessionStorage !== undefined) {
      addProvider(DATA_PROVIDER.SESSION, new SessionProvider());
    } else this.logger?.warn('"session" data-provider not registered: not supported');
    if (win.localStorage !== undefined) {
      addProvider(DATA_PROVIDER.STORAGE, new StorageProvider());
    } else this.logger?.warn('"storage" data-provider not registered: not supported');
  }

  addRegistrationListener() {
    this.document.addEventListener(
      ACTIONS.RegisterDataProvider,
      this.handleProviderEvent,
      this.eventOptions);
  }

  handleProviderEvent(ev: CustomEvent<ProviderRegistration>) {
    const { name, provider } = ev.detail;
    if (name && provider) {
      addProvider(name, provider as IDataProvider);
    }
  }

  destroy(): void {
    this.document.removeEventListener(
      ACTIONS.RegisterDataProvider,
      this.handleProviderEvent,
      this.eventOptions);
  }
}
