import { IDataProvider } from './interfaces';
import { requireValue } from '../utils/misc-utils';
import { debug } from '../logging';

type DataProviders = {
  [key: string]: IDataProvider;
};

const providers: DataProviders = {};

export function addProvider(name: string, provider:IDataProvider) {
  requireValue(name, 'provider name');
  if (typeof provider.get !== 'function') throw new Error(`The provider ${name} is missing the get(key) function.`);
  if (typeof provider.set !== 'function') throw new Error(`The provider ${name} is missing the set(key) function.`);
  providers[name.toLowerCase()] = provider as IDataProvider;
  debug(`data-provider: ${name} registered`);
}

export function getProvider(name: string): IDataProvider {
  requireValue(name, 'provider name');
  return providers[name.toLowerCase()] || null;
}

export function getProviders(): DataProviders {
  return providers;
}

export function clearProviders() {
  Object.keys(providers).forEach((key) => {
    delete providers[key];
  });
}
