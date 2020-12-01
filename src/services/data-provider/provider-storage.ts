import { logger } from '..';
import { IDataProvider } from './interfaces';

export class StorageProvider implements IDataProvider {
  constructor(private localStorage = window.localStorage) {
    if (sessionStorage === undefined) logger.warn('No localStorage found.');
  }

  async get(key: string): Promise<string|null> {
    return this.localStorage?.getItem(key) || null;
  }

  async set(key: string, value: string) {
    this.localStorage?.setItem(key, value);
  }
}
