import { DATA_EVENTS, IDataProvider } from './interfaces';
import { EventEmitter } from '../events';

export class InMemoryProvider implements IDataProvider {
  data = {};
  constructor() {
    this.changed = new EventEmitter();
  }
  async get(key: string): Promise<string|null> {
    return this.data[key] || null;
  }
  async set(key: string, value: string): Promise<void> {
    this.data[key] = value;
    this.changed.emit(DATA_EVENTS.DataChanged);
  }

  changed:EventEmitter;
}
