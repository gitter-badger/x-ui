import { Component, Element, Prop, h, Host, Method, State } from '@stencil/core';
import {
  ActionBus,
  ActionActivationStrategy,
  ActionEvent,
  warn,
  debugIf,
} from '../..';

@Component({
  tag: 'x-action-activator',
  shadow: true,
})
export class XActionActivator {
  @State() actions: Array<ActionEvent<unknown>> = [];
  @Element() el: HTMLXActionActivatorElement;
  @State() activated = false;

  /**
   * The activation strategy to use for the contained actions.
   */
  @Prop() activate!: ActionActivationStrategy;

  /**
   * The element to watch for events when using the OnElementEvent
   * activation strategy. This element uses the HTML Element querySelector
   * function to find the element.
   *
   * For use with activate="OnElementEvent" Only!
   */
  @Prop() targetElement?: string;

  /**
   * This is the name of the event to listen to on the target element.
   */
  @Prop() targetEvent = 'click';

  /**
   * The time, in seconds at which the contained actions should be submitted.
   *
   * For use with activate="AtTime" Only!
   */
  @Prop() time?: number;

  /**
  * Turn on debug statements for load, update and render events.
  */
  @Prop() debug = false;

  /**
  *
  */
  @Method()
  activateActions(): Promise<void> {
    if (this.activated) return;
    // activate children
    this.actions.forEach((action) => {
      const dataString = JSON.stringify(action.data);
      debugIf(this.debug, `x-action-activator:  ${this.parent?.url} Activating [${this.activate}~{topic: ${action?.topic}, command:${action?.command}, data: ${dataString}}]`);

      try {
        ActionBus.emit(action.topic, action);
      } catch (err) {
        warn(`x-action-activator: ${err}`);
      }
    });
    this.activated = true;
    return Promise.resolve();
  }

  private get parent(): HTMLXViewDoElement | HTMLXViewElement {
    return this.el.closest('x-view-do')
      || this.el.closest('x-view');
  }

  private get childActions(): Array<HTMLXActionElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes)
      .filter((c) => c.nodeName === 'X-ACTION')
      .map((v) => v as HTMLXActionElement);
  }

  componentDidLoad() {
    debugIf(this.debug, `x-action-activator: ${this.parent?.url} loading`);
    if (this.childActions.length === 0) {
      warn(`x-action-activator: ${this.parent?.url} no children actions detected`);
      return;
    }
    this.childActions.forEach(async (a) => {
      const action = await a.getAction();
      // eslint-disable-next-line no-console
      const dataString = JSON.stringify(action.data);
      debugIf(this.debug, `x-action-activator: ${this.parent?.url} registered [${this.activate}~{topic: ${action?.topic}, command:${action?.command}, data: ${dataString}}}] `);
      this.actions.push(action);
    });

    if (this.activate === ActionActivationStrategy.OnElementEvent) {
      let element: ChildNode;
      if (this.targetElement) {
        element = this.el.parentElement?.querySelector(this.targetElement);
      } else {
        element = Array.from(this.el.childNodes)
          .filter((e) => e.nodeType === e.ELEMENT_NODE)
          .find((el) => el.nodeName !== 'X-ACTION');
      }

      if (element === undefined) {
        warn(`x-action-activator: ${this.parent?.url} no elements found for '${this.targetElement}'`);
      } else {
        debugIf(this.debug, `x-action-activator: element found ${element.nodeName}`);
        element?.addEventListener(this.targetEvent, async () => {
          debugIf(this.debug, `x-action-activator: ${this.parent?.url} received ${element.nodeName} ${this.targetEvent} event`);
          await this.activateActions();
        });
      }
    }
  }

  render() {
    return (
      <Host><slot></slot></Host>
    );
  }
}
