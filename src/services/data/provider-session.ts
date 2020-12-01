import { IDataProvider } from './interfaces';

export class SessionProvider implements IDataProvider {
  name: 'session';
  constructor(private sessionStorage = window.sessionStorage) {}

  async get(key: string): Promise<string|null> {
    return this.sessionStorage?.getItem(key) || null;
  }

  async set(key: string, value: any) {
    this.sessionStorage?.setItem(key, value);
  }
}
