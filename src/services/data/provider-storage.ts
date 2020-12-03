import { IDataProvider } from './interfaces';

export class StorageProvider implements IDataProvider {
  public static KEY = 'storage';
  constructor(private localStorage = window.localStorage) {}

  async get(key: string): Promise<string|null> {
    return this.localStorage?.getItem(key) || null;
  }

  async set(key: string, value: string) {
    this.localStorage?.setItem(key, value);
  }
}
