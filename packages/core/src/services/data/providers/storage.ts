import { EventEmitter } from '../../actions';
import { DATA_EVENTS, IDataProvider } from '../interfaces';

export class StorageProvider implements IDataProvider {
  constructor(private localStorage = window.localStorage) {
    this.changed = new EventEmitter();
    window?.addEventListener('storage', () => {
      this.changed.emit(DATA_EVENTS.DataChanged);
    });
  }

  async get(key: string): Promise<string|null> {
    return this.localStorage?.getItem(key);
  }

  async set(key: string, value: string) {
    this.localStorage?.setItem(key, value);
  }

  changed:EventEmitter;
}
