import { EventEmitter } from '../../actions';
import { IDataProvider } from '../interfaces';

export class SessionProvider implements IDataProvider {
  constructor(private sessionStorage = window.sessionStorage) {
    this.changed = new EventEmitter();
  }

  async get(key: string): Promise<string> {
    return this.sessionStorage?.getItem(key);
  }

  async set(key: string, value: any) {
    this.sessionStorage?.setItem(key, value);
  }

  changed:EventEmitter;
}
