import { EventEmitter } from '../events';

export interface IDataProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  changed: EventEmitter
}

export type Providers = {
  [key: string]: IDataProvider;
};

export type ExpressionContext = {
  [key: string]: any;
};

export const DATA_TOPIC = 'xui:action-events:data';

export enum DATA_PROVIDER {
  SESSION = 'session',
  STORAGE = 'storage',
  COOKIE = 'cookie'
}

export enum DATA_COMMANDS {
  RegisterDataProvider = 'register-provider'
}

export enum DATA_EVENTS {
  CookieConsentResponse = 'cookie-consent',
  DataChanged = 'data-changed'
}

export type DataEvent = {
  type: DATA_EVENTS
};

export type ProviderRegistration = {
  name: string;
  provider: IDataProvider
};

export type CookieConsent = {
  consented: boolean
};
