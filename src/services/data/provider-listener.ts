import { IDataProvider } from '.';
import { ACTIONS, addProvider, ProviderRegistration } from './provider-factory';
import { SessionProvider } from './provider-session';
import { StorageProvider } from './provider-storage';

export enum DATA_PROVIDER {
  SESSION = 'session',
  STORAGE = 'storage'
}

export class ProviderListener {
  constructor(doc: HTMLDocument = document) {
    addProvider(DATA_PROVIDER.SESSION, new SessionProvider());
    addProvider(DATA_PROVIDER.STORAGE, new StorageProvider());

    this.listenForRegistrations(doc);
  }

  private listenForRegistrations(doc: HTMLDocument) {
    doc?.addEventListener(ACTIONS.RegisterDataProvider, (ev: CustomEvent) => {
      const { name, provider } = ev.detail as ProviderRegistration;
      if (name && provider) addProvider(name, provider as IDataProvider);
    });
  }
}
