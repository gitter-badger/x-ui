import { logger } from '..';
import { IDataProvider } from './interfaces';

export class SessionProvider implements IDataProvider {
  constructor(private sessionStorage = window.sessionStorage) {
    if (sessionStorage === undefined) logger.warn('No sessionStorage found.');
  }

  async get(key: string): Promise<string|null> {
    return this.sessionStorage?.getItem(key) || null;
  }

  async set(key: string, value: any) {
    this.sessionStorage?.setItem(key, value);
  }
}
