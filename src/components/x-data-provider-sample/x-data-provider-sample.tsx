/* eslint-disable no-return-assign */
import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { ACTIONS, ProviderRegistration } from '../../services/data/provider-factory';
import { InMemoryProvider } from '../../services/data/provider-memory';

@Component({
  tag: 'x-data-provider-sample',
  shadow: false,
})
export class XDataProvider {
  private customProvider = new InMemoryProvider();
  private inputKeyEl: HTMLInputElement;
  private inputValueEl: HTMLInputElement;
  private formEl: HTMLFormElement;

  /**
   * When debug is true, a reactive table of values is displayed.
   */
  @Prop() debug = false;

  /**
   * This event is raised when the component loads.
   * The data-provider system should capture this event
   * and register the provider for use in expressions.
   */
  @Event({
    eventName: ACTIONS.RegisterDataProvider,
  }) register: EventEmitter<ProviderRegistration>;

  @State() data = {};

  componentDidLoad() {
    this.register.emit({
      name: 'memory',
      provider: this.customProvider,
    });
  }

  private remove(key: string): void {
    delete this.customProvider.data[key];
    this.data = this.customProvider.data;
  }

  private async add(): Promise<void> {
    const {value: key} = this.inputKeyEl;
    const {value} = this.inputValueEl;
    if (key && value) {
      await this.customProvider.set(key, value);
      this.formEl.reset();
      this.data = this.customProvider.data;
    }
  }

  render() {
    if (this.debug === false) return null;

    const keys = Object.keys(this.customProvider.data);
    return (
      <table>
        <thead>
          <th>Key</th>
          <th colSpan={2}>Value</th>
        </thead>
        <tbody>
          { keys.map((key) => (
            <tr>
              <td>{ key }</td>
              <td>{ this.customProvider.data[key] }</td>
              <td><button type="button" onClick={() => this.remove(key)}>X</button></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <form ref={(el) => this.formEl = el as HTMLFormElement}>
            <td>
              <input ref={(el) => this.inputKeyEl = el as HTMLInputElement} required pattern="[\w]*"/>
            </td>
            <td>
              <input ref={(el) => this.inputValueEl = el as HTMLInputElement} required />
            </td>
            <td>
              <button type="button" onClick={() => this.add()}>X</button>
            </td>
          </form>
        </tfoot>
      </table>
    );
  }
}
