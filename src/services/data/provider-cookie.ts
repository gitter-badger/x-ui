import { IDataProvider, DATA_EVENTS } from './interfaces';
import { getCookie, setCookie, listenCookieChange } from './cookies';
import { EventEmitter } from '../events';

export class CookieProvider implements IDataProvider {
  constructor(private document = window.document) {
    this.changed = new EventEmitter();
    listenCookieChange(() => {
      this.changed.emit(DATA_EVENTS.DataChanged);
    });
  }

  async get(key: string): Promise<string|null> {
    return getCookie(this.document, key);
  }

  async set(key: string, value: any) {
    setCookie(this.document, key, value);
  }

  changed:EventEmitter;
}
