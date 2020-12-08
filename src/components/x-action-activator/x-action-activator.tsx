import { Component, Element, Prop, h, Event, EventEmitter, Host } from '@stencil/core';
import {
  ActionActivationStrategy,
  ActionEvent,
  state,
  ROUTE_TOPIC,
  debugIf,
} from '../..';

@Component({
  tag: 'x-action-activator',
  shadow: true,
})
export class XActionActivator {
  private actions = new Map<string, Array<ActionEvent<any>>>();
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
  @Event({
    eventName: ROUTE_TOPIC,
    composed: true,
    bubbles: true,
    cancelable: true,
  }) navigationEvents: EventEmitter<ActionEvent<any>>;

  private get parent(): HTMLXViewDoElement {
    return this.el.closest('x-view-do') as HTMLXViewDoElement;
  }

  private get childActions(): Array<HTMLXActionElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes).filter((c) => c.nodeName === 'X-ACTION')
      .map((v) => v as HTMLXActionElement);
  }

  componentWillLoad() {
    debugIf(state.debug, `x-action-activator: <x-action-activator~loading> ${this.parent?.url}`);
    this.childActions.forEach(async (a) => {
      const action = await a.getAction();
      // eslint-disable-next-line no-console
      debugIf(state.debug, `x-action-activator: <x-action~registered> ${action.topic} ${action.action?.command}`);
      const topicList = this.actions[action.topic] || [];
      this.actions.set(action.topic, [...topicList, action.action]);
    });
  }

  private attachHandler() {
    const element = this.parent?.querySelector(this.elementQuery);
    element?.addEventListener(this.eventName, () => {
      debugIf(state.debug, `x-action-activator: <${this.elementQuery}~${this.eventName}>`);
      this.actions.forEach((actions, topic) => {
        actions.forEach((action) => {
          debugIf(state.debug, `x-action-activator: sending ActionEvent { topic:${topic}, command:${action?.command} }`);
          this.navigationEvents.emit(action);
        });
      });
    });
  }

  componentWillRender() {
    this.attachHandler();
    // this.el.addEventListener(this.eventName, this.activateActions);
  }

  render() {
    return (
      <Host hidden><slot></slot></Host>
    );
  }
}
