import { EventEmitter } from '../actions/event-emitter';
import { IDataProvider } from '../data/interfaces';

export class RoutingDataProvider implements IDataProvider {
  constructor(
    private accessor: (key:string) => any,
  ) {
    this.changed = new EventEmitter();
  }

  async get(key: string): Promise<string> {
    return this.accessor(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async set(_key: string, _value: string): Promise<void> {
    // do nothing
  }

  changed:EventEmitter;
}
