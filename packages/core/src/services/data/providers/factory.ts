import { IDataProvider } from '../interfaces';
import { requireValue } from '../../utils/misc-utils';
import { debugIf } from '../../logging';
import { interfaceState } from '../../interface';

type DataProviders = {
  [key: string]: IDataProvider;
};

const providers: DataProviders = {};

export function addDataProvider(name: string, provider:IDataProvider) {
  requireValue(name, 'provider name');
  if (typeof provider.get !== 'function') throw new Error(`The provider ${name} is missing the get(key) function.`);
  if (typeof provider.set !== 'function') throw new Error(`The provider ${name} is missing the set(key) function.`);
  providers[name.toLowerCase()] = provider as IDataProvider;
  debugIf(interfaceState.debug, `data-provider: ${name} registered`);
}

export function getDataProvider(name: string): IDataProvider {
  requireValue(name, 'provider name');
  return providers[name.toLowerCase()] || null;
}

export function getDataProviders(): DataProviders {
  return providers;
}

export function clearDataProviders() {
  Object.keys(providers).forEach((key) => {
    delete providers[key];
  });
}
