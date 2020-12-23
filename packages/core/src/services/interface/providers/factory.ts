import { InterfaceProvider } from '../interfaces';
import { debug } from '../../logging';

let provider: InterfaceProvider = null;

export function setInterfaceProvider(name: string, p:InterfaceProvider) {
  debug(`document-provider: ${name} registered`);
  provider = p;
}

export function getInterfaceProvider(): InterfaceProvider {
  return provider;
}
