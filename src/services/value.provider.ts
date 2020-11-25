import { StorageProvider } from './storage.provider';
import { SessionProvider } from './session.provider';
import { IValueProvider } from '../types';

const session = new SessionProvider();
const storage = new StorageProvider();

export class ValueProviderFactory {

  readonly RegisterValueProviderEvent = "x-ui:register:value-provider";

  private valueProviders: { [index: string]: IValueProvider} = {};

  constructor(private doc: HTMLDocument = document) {
    this.valueProviders["session"] = session;
    this.valueProviders["storage"] = storage;

    this.listenForRegistrations();
  }

  listenForRegistrations() {
    this.doc.addEventListener(this.RegisterValueProviderEvent, (ev: CustomEvent) => {
      let { name, provider } = ev.detail;

      if(name && provider)
        this.valueProviders[name] = provider as IValueProvider;
    })
  }

  getProvider(name: string) {
    return this.valueProviders[name] || null;
  }
}
