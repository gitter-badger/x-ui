import { EventEmitter } from '../actions/event-emitter';

export interface IDataProvider {
  get(key: string): Promise<string>;
  set(key: string, value: string): Promise<void>;
  changed: EventEmitter
}

export type ExpressionContext = {
  [key: string]: any;
};

export const DATA_TOPIC = 'data';

export enum DATA_PROVIDER {
  SESSION = 'session',
  STORAGE = 'storage',
  COOKIE = 'cookie'
}

export enum DATA_COMMANDS {
  RegisterDataProvider = 'register-provider',
  SetData = 'set-data'
}

export enum DATA_EVENTS {
  CookieConsentResponse = 'cookie-consent',
  DataChanged = 'data-changed'
}

export type DataProviderRegistration = {
  name: string;
  provider: IDataProvider
};

export type SetData = {
  provider: string;
  values: { [index: string]: any }
};

export type CookieConsent = {
  consented: boolean
};
