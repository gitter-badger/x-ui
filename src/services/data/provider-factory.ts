import { IDataProvider, Providers } from './interfaces';
import { requireValue } from '../utils/misc-utils';
import { debug } from '../logging';

const providers: Providers = {};

export function addProvider(name: string, provider:IDataProvider) {
  requireValue(name, 'provider name');
  if (typeof provider.get !== 'function') throw new Error(`The provider ${name} is missing the get(key) function.`);
  if (typeof provider.set !== 'function') throw new Error(`The provider ${name} is missing the set(key) function.`);
  debug(`data-provider: <${name}~registered>`);
  providers[name.toLowerCase()] = provider as IDataProvider;
}

export function getProvider(name: string): IDataProvider {
  requireValue(name, 'provider name');
  return providers[name.toLowerCase()] || null;
}

export function clearProviders() {
  Object.keys(providers).forEach((key) => {
    delete providers[key];
  });
}
