import { state } from '.';
import { IDataProvider } from '../types/interfaces';

export class StorageProvider implements IDataProvider {

  constructor() {
    if(localStorage == undefined)
    state.logger.warn('localStorage is not available')
  }

  async get(key: string): Promise<string|null> {
    return localStorage?.getItem(key) || null;
  }

  async set(key: string, value: string) {
    localStorage?.setItem(key, value);
  }
}
