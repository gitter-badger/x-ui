/* eslint-disable no-return-assign */
import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import {
  ActionEvent,
  InMemoryProvider,
  DATA_TOPIC,
  DATA_COMMANDS,
  DataProviderRegistration
} from '@viewdo/x-ui';


@Component({
  tag: 'x-data-provider-sample',
  shadow: false,
})
export class XDataProviderSample {
  private customProvider = new InMemoryProvider();
  private inputKeyEl: HTMLInputElement;
  private inputValueEl: HTMLInputElement;
  private formEl: HTMLFormElement;
  @State() keys = [];

  /**
   * When debug is true, a reactive table of values is displayed.
   */
  @Prop() debug = false;

  /**
   *Customize the name used for this sample data provider.
   */
  @Prop() name = 'memory';

  /**
   * This event is raised when the component loads.
   * The data-provider system should capture this event
   * and register the provider for use in expressions.
   */
  @Event({
    eventName: DATA_TOPIC,
  }) register: EventEmitter<ActionEvent<DataProviderRegistration>>;

  componentDidLoad() {
    this.register.emit({
      topic: DATA_TOPIC,
      command: DATA_COMMANDS.RegisterDataProvider,
      data: {
        name: this.name,
        provider: this.customProvider,
      },
    });
  }

  private remove(key: string): void {
    delete this.customProvider.data[key];
    this.keys = [...Object.keys(this.customProvider.data)];
  }

  private async add(): Promise<void> {
    const {value: key} = this.inputKeyEl;
    const {value} = this.inputValueEl;
    if (key && value) {
      await this.customProvider.set(key, value);
      this.formEl.reset();
      this.keys = [...Object.keys(this.customProvider.data)];
    }
  }

  render() {
    if (this.debug === false) return null;

    return (
      <form ref={(el) => this.formEl = el as HTMLFormElement}>
        <table class="table">
          <thead>
            <th>Key</th>
            <th colSpan={2}>Value</th>
          </thead>
          <tbody>
            { this.keys.map((key) => (
              <tr>
                <td>{ key }</td>
                <td>{ this.customProvider.data[key] }</td>
                <td><button class="button" type="button" onClick={() => this.remove(key)}>X</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <td>
              <input ref={(el) => this.inputKeyEl = el as HTMLInputElement} required pattern="[\w]*"/>
            </td>
            <td>
              <input ref={(el) => this.inputValueEl = el as HTMLInputElement} required />
            </td>
            <td>
              <button class="button" type="button" onClick={() => this.add()}>+</button>
            </td>
          </tfoot>
        </table>
      </form>
    );
  }
}
