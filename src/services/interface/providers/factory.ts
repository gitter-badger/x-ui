import { InterfaceProvider } from '../interfaces';
import { debug } from '../../logging';

let provider: InterfaceProvider = null;

export function setInterfaceProvider(p:InterfaceProvider) {
  debug(`document-provider: ${p} registered`);
  provider = p;
}

export function getInterfaceProvider(): InterfaceProvider {
  return provider;
}
