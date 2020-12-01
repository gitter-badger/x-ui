import { IDataProvider } from './interfaces';

export class InMemoryProvider implements IDataProvider {
  name: 'memory';
  data = {};
  async get(key: string): Promise<string|null> {
    return this.data[key] || null;
  }
  async set(key: string, value: string): Promise<void> {
    this.data[key] = value;
  }
}
