import { StorageProvider } from './storage.provider';
import { SessionProvider } from './session.provider';
import { IDataProvider } from '../types';

export enum DATA_PROVIDER {
  SESSION = "session",
  STORAGE = "storage"
}

export enum ACTIONS {
  RegisterDataProvider = `xui:action-event:data-provider:register`
}

export interface IProviderFactory {
  getProvider(name: string): IDataProvider
}

export class ProviderFactory implements IProviderFactory {

  private dataProviders: { [index: string]: IDataProvider} = {};

  constructor(
    doc: HTMLDocument = document,
    session = new SessionProvider(),
    storage = new StorageProvider()) {

    this.dataProviders[DATA_PROVIDER.SESSION] = session;
    this.dataProviders[DATA_PROVIDER.STORAGE] = storage;

    this.listenForRegistrations(doc);
  }

  listenForRegistrations(doc: HTMLDocument) {
    doc.addEventListener(ACTIONS.RegisterDataProvider, (ev: CustomEvent) => {
      let { name, provider } = ev.detail;

      if(name && provider)
        this.dataProviders[name] = provider as IDataProvider;
    })
  }

  getProvider(name: string): IDataProvider {
    return this.dataProviders[name] || null;
  }
}


