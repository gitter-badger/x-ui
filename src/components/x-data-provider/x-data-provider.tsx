import { Component, Event, EventEmitter, Method } from '@stencil/core';
import { ACTIONS, ProviderRegistration } from '../../services/data-provider/provider-factory';
import { IDataProvider } from '../../services/data-provider/interfaces';
import { InMemoryProvider } from '../../services/data-provider/provider-memory';

@Component({
  tag: 'x-data-provider',
  shadow: true,
})
export class XDataProvider implements IDataProvider {
  private data = new InMemoryProvider();

  /**
   *
   */
  @Method()
  async get(key: string): Promise<string> {
    return this.data.get(key);
  }

  /**
   *
   */
  @Method()
  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  /**
   *
   */
  @Event({
    eventName: ACTIONS.RegisterDataProvider,
  }) register: EventEmitter<ProviderRegistration>;

  componentDidLoad() {
    this.register.emit({
      name: 'memory',
      provider: this,
    });
  }

  render() {
    return null;
  }
}
