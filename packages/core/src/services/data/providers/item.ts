
import { EventEmitter } from '../../actions/event-emitter';
import { DATA_EVENTS, IDataProvider } from '../interfaces';

export class DataItemProvider implements IDataProvider {
  constructor(private data: any, private setter?: (key, value) => Promise<void>) {
    this.changed = new EventEmitter();
  }

  async get(key: string): Promise<string> {
    if (key == 'item') return this.data;
    return this.data[key];
  }
  async set(key: string, value: string): Promise<void> {
    if (this.setter) {
      await this.setter(key, value);
    } else {
      this.data[key] = value;
    }
    this.changed.emit(DATA_EVENTS.DataChanged);
  }

  changed: EventEmitter;
}
