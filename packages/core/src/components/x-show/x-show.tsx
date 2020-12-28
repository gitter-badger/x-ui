import { Prop, State, Component, Host, h } from '@stencil/core';
import {
  ActionBus,
  DATA_EVENTS,
  evaluatePredicate,
  RouterService,
} from '../..';

@Component({
  tag: 'x-show',
  styleUrl: 'x-show.scss',
  shadow: false,
})
export class XShow {
  @State() show = true;

  /**
   The data expression to obtain a predicate for conditionally rendering
   the inner-contents of this element.
   @example {session:user.name}
   */
  @Prop() when!: string;

  componentWillLoad() {
    ActionBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.evaluatePredicate();
    });
    RouterService.instance?.onChange(async () => {
      await this.evaluatePredicate();
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
