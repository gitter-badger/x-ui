import { IDocumentProvider } from './interfaces';
import { debug } from '../logging';

let provider: IDocumentProvider = null;

export function setDocumentProvider(p:IDocumentProvider) {
  debug(`document-provider: ${p} registered`);
  provider = p;
}

export function getDocumentProvider(): IDocumentProvider {
  return provider;
}
