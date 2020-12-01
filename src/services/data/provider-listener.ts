import { IDataProvider } from './interfaces';
import { addProvider } from './provider-factory';
import { SessionProvider } from './provider-session';
import { StorageProvider } from './provider-storage';
import { IActionEventListener } from '../actions/interfaces';
import { ActionEvent } from '../actions';
import { warn } from '../logging';

export const TOPIC = 'xui:action-events:data';

export enum DATA_PROVIDER {
  SESSION = 'session',
  STORAGE = 'storage',
  COOKIE = 'cookie'
}

export enum COMMANDS {
  RegisterDataProvider = 'register-provider'
}

export enum EVENTS {
  CookieConsentResponse = 'cookie-consent'
}

export type ProviderRegistration = {
  name: string;
  provider: IDataProvider
};

export type CookieConsent = {
  consented: boolean
};

export class ProviderListener implements IActionEventListener {
  document: HTMLDocument;
  eventOptions: EventListenerOptions = { capture: true };

  public initialize(win:Window) {
    this.document = win.document;
    this.registerBrowserProviders(win);
    this.addRegistrationListener();
  }

  registerBrowserProviders(win: Window) {
    if (win.sessionStorage !== undefined) {
      addProvider(DATA_PROVIDER.SESSION, new SessionProvider());
    } else warn('"session" data-provider not registered: not supported');
    if (win.localStorage !== undefined) {
      addProvider(DATA_PROVIDER.STORAGE, new StorageProvider());
    } else warn('"storage" data-provider not registered: not supported');
  }

  addRegistrationListener() {
    this.document.addEventListener(
      TOPIC,
      this.handleProviderEvent,
      this.eventOptions);
  }

  handleProviderEvent(ev: CustomEvent<ActionEvent<ProviderRegistration>>) {
    const actionEvent = ev.detail;
    if (actionEvent.command === COMMANDS.RegisterDataProvider) {
      const { name, provider } = actionEvent.data;
      if (name && provider) {
        addProvider(name, provider as IDataProvider);
      }
    }
  }

  destroy(): void {
    this.document.removeEventListener(
      TOPIC,
      this.handleProviderEvent,
      this.eventOptions);
  }
}
