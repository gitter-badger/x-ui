import { Component, Element, Prop, h, Host, Method } from '@stencil/core';
import {
  ActionActivationStrategy,
  ActionEvent,
  state,
  debugIf,
} from '../..';

@Component({
  tag: 'x-action-activator',
  shadow: true,
})
export class XActionActivator {
  private actions: Array<ActionEvent<any>> = [];
  @Element() el: HTMLXActionActivatorElement;

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
  @Prop() eventName?: string;

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
    // activate children
    this.actions.forEach((action) => {
      debugIf(state.debug, `x-action-activator: sending ActionEvent { topic:${action?.topic}, command:${action?.command} }`);
      const event = new CustomEvent(action.topic, {
        bubbles: true,
        cancelable: true,
        detail: {
          command: action.command,
          data: action.data,
        },
      });
      this.el.dispatchEvent(event);
    });
  }

  private get parent(): HTMLXViewDoElement {
    return this.el.closest('x-view-do') as HTMLXViewDoElement;
  }

  private get childActions(): Array<HTMLXActionElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes).filter((c) => c.nodeName === 'X-ACTION')
      .map((v) => v as HTMLXActionElement);
  }

  componentWillLoad() {
    debugIf(state.debug, `x-action-activator: [${this.parent?.url}] loading`);
    this.childActions.forEach(async (a) => {
      const action = await a.getAction();
      // eslint-disable-next-line no-console
      debugIf(state.debug, `x-action-activator: [x-action:${this.activate}:${action.topic}:${action.command}] registered`);
      this.actions.push(action);
    });
  }

  private attachHandler() {
    const element = this.parent?.querySelector(this.elementQuery);
    element?.addEventListener(this.eventName, async () => {
      debugIf(state.debug, `x-action-activator: [${this.elementQuery}:${this.eventName}] listening`);
      await this.activateActions();
    });
  }

  componentWillRender() {
    this.attachHandler();
  }

  render() {
    return (
      <Host hidden><slot></slot></Host>
    );
  }
}
