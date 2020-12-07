import { DATA_EVENTS, IDataProvider } from './interfaces';
import { EventEmitter } from '../events';

export class SessionProvider implements IDataProvider {
  KEY: 'session';
  constructor(private sessionStorage = window.sessionStorage) {
    this.changed = new EventEmitter();
  }

  async get(key: string): Promise<string|null> {
    return this.sessionStorage?.getItem(key) || null;
  }

  async set(key: string, value: any) {
    this.sessionStorage?.setItem(key, value);
    this.changed.emit(DATA_EVENTS.DataChanged);
  }

  changed:EventEmitter;
}
