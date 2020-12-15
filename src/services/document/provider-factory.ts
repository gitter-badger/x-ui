import { IDocumentProvider } from './interfaces';
import { requireValue } from '../utils/misc-utils';
import { debug } from '../logging';

const providers: Providers = {};

type Providers = {
  [key: string]: IDocumentProvider;
};

export function setProvider(name: string, provider:IDocumentProvider) {
  requireValue(name, 'provider name');

  debug(`document-provider: ${name}~registered`);
  providers[name.toLowerCase()] = provider as IDocumentProvider;
}

export function getProvider(name: string): IDocumentProvider {
  requireValue(name, 'provider name');
  return providers[name.toLowerCase()] || null;
}

export function clearProviders() {
  Object.keys(providers).forEach((key) => {
    delete providers[key];
  });
}
