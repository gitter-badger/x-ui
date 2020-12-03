import { Component, Element, Prop, h, EventEmitter, Host } from '@stencil/core';
import { ActionActivationStrategy } from '../../services/actions/interfaces';
import { ActionEvent } from '../../services/actions/action-event';

@Component({
  tag: 'x-action-activator',
  shadow: true,
})
export class XActionActivator {
  @Element() el: HTMLXActionActivatorElement;

  /**
   * The activation strategy to use for the contained actions.
   */
  @Prop() activate: ActionActivationStrategy = ActionActivationStrategy.onEnter;

  /**
   *
   */
  @Prop() eventName!: string;

  private raiseEvent: EventEmitter<ActionEvent<any>>;

  private activateActions(e:CustomEvent) {
    this.actions.forEach((a) => {
      const action = a.getAction(e);
      this.raiseEvent.emit(action);
    });
  }

  get actions(): any[] {
    return Array.from(this.el.querySelectorAll('x-action'));
  }

  componentWillRender() {
    this.el.addEventListener(this.eventName, this.activateActions);
  }

  render() {
    return (
      <Host hidden></Host>
    );
  }
}
