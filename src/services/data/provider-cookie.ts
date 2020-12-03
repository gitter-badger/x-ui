import { IDataProvider } from './interfaces';
import { getCookie, setCookie } from './cookies';

export class CookieProvider implements IDataProvider {
  static KEY = 'cookie';
  constructor(private document = window.document) {}

  async get(key: string): Promise<string|null> {
    return getCookie(this.document, key);
  }

  async set(key: string, value: any) {
    setCookie(this.document, key, value);
  }
}
