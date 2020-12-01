import { Component, Event, EventEmitter } from '@stencil/core';
import { ACTIONS, ProviderRegistration } from '../../services/data/provider-factory';
import { InMemoryProvider } from '../../services/data/provider-memory';

@Component({
  tag: 'x-data-provider',
  shadow: true,
})
export class XDataProvider {
  private data = new InMemoryProvider();

  /**
   *
   */
  @Event({
    eventName: ACTIONS.RegisterDataProvider,
  }) register: EventEmitter<ProviderRegistration>;

  componentDidLoad() {
    this.register.emit({
      name: 'memory',
      provider: this.data,
    });
  }

  render() {
    return null;
  }
}
