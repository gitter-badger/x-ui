import { IDataProvider } from './interfaces';
import { requireValue } from '../utils';

export type Providers = {
  [key: string]: IDataProvider;
};

export enum ACTIONS {
  RegisterDataProvider = 'xui:data-providers:add-provider'
}

export type ProviderRegistration = {
  name: string;
  provider: IDataProvider
};

const providers: Providers = {};

export function addProvider(name: string, provider:IDataProvider) {
  requireValue(name, 'provider name');
  if (typeof provider.get !== 'function') throw new Error(`The provider ${name} is missing the get(key) function.`);
  if (typeof provider.set !== 'function') throw new Error(`The provider ${name} is missing the set(key) function.`);

  providers[name] = provider as IDataProvider;
}

export function getProvider(name: string): IDataProvider {
  return providers[name] || null;
}
