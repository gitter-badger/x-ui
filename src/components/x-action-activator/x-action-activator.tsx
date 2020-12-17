import { Component, Element, Prop, h, Host, Method, State } from '@stencil/core';
import {
  ActionBus,
  ActionActivationStrategy,
  ActionEvent,
  state,
  warn,
  debugIf,
} from '../..';

@Component({
  tag: 'x-action-activator',
  shadow: true,
})
export class XActionActivator {
  @State() actions: Array<ActionEvent<any>> = [];
  @Element() el: HTMLXActionActivatorElement;
  @State() activated = false;

  /**
   * The activation strategy to use for the contained actions.
   */
  @Prop() activate!: ActionActivationStrategy;

  /**
   * The element to watch for events or visibility,
   */
  @Prop() elementQuery?: string;

  /**
   *
   */
  @Prop() elementEventName: string = 'click';

  /**
   *
   */
  @Prop() time?: number;

  /**
  *
  */
  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async activateActions() {
    if (this.activated) return;
    // activate children
    this.actions.forEach((action) => {
      debugIf(state.debug, `x-action-activator:  ${this.parent?.url} Activating [x-action:${this.activate} {${action?.topic}~${action?.command}}]`);
      try {
        ActionBus.emit(action.topic, action);
      } catch (err) {
        warn(`x-action-activator: ${err}`);
      }
    });
    this.activated = true;
  }

  private get parent(): HTMLXViewDoElement {
    return this.el.closest('x-view-do') as HTMLXViewDoElement;
  }

  private get childActions(): Array<HTMLXActionElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes).filter((c) => c.nodeName === 'X-ACTION')
      .map((v) => v as HTMLXActionElement);
  }

  componentDidLoad() {
    debugIf(state.debug, `x-action-activator: ${this.parent?.url} loading`);
    if (this.childActions.length === 0) {
      warn(`x-action-activator: ${this.parent?.url} No children actions detected`);
      return;
    }
    this.childActions.forEach(async (a) => {
      const action = await a.getAction();
      // eslint-disable-next-line no-console
      debugIf(state.debug, `x-action-activator: ${this.parent?.url} registered [x-action:${this.activate} {${action.topic}~${action.command}}] `);
      this.actions.push(action);
    });

    const element = this.parent?.querySelector(this.elementQuery);

    element?.addEventListener(this.elementEventName, async () => {
      debugIf(state.debug, `x-action-activator: ${this.parent?.url} received ${this.elementQuery} did ${this.elementEventName}`);
      await this.activateActions();
    });
  }

  render() {
    return (
      <Host hidden><slot></slot></Host>
    );
  }
}
