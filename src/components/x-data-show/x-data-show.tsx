import { Prop, State, Component, Host, h, Listen } from '@stencil/core';
import { evaluatePredicate, RouterService } from '../..';
import { DataEvent, DATA_EVENTS } from '../../services/data/interfaces';

@Component({
  tag: 'x-data-show',
  styleUrl: 'x-data-show.scss',
  shadow: false,
})
export class XDataShow {
  @State() show = true;

  /**
   The data expression to obtain a predicate for conditionally rendering
   the inner-contents of this element.
   @example {session:user.name}
   */
  @Prop() when!: string;

  @Listen('xui:action-events:data', {
    target: 'body',
  })
  async dataEvent(ev: DataEvent) {
    if (ev.type === DATA_EVENTS.DataChanged) {
      await this.evaluatePredicate();
    }
  }

  componentWillLoad() {
    RouterService.instance?.onRouteChange(() => {
      this.evaluatePredicate();
    });
  }

  async componentWillRender() {
    await this.evaluatePredicate();
  }

  private async evaluatePredicate() {
    this.show = await evaluatePredicate(this.when);
  }

  render() {
    if (this.show) return (<Host><slot/></Host>);
    return (<Host hidden><slot/></Host>);
  }
}
