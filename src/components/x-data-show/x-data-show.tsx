import { Prop, State, Component, Host, h } from '@stencil/core';
import { evaluatePredicate } from '../..';

@Component({
  tag: 'x-data-show',
  styleUrl: 'x-data-show.scss',
  shadow: true,
})
export class XDataShow {
  private timer: number;
  @State() show = true;

  /**
   The data expression to obtain a predicate for conditionally rendering
   the inner-contents of this element.
   @example {session:user.name}
   @default null
   */
  @Prop() when!: string;

  connectedCallback() {
    this.timer = window.setInterval(async () => {
      await this.evaluatePredicate();
    }, 100);
    return this.evaluatePredicate();
  }

  disconnectedCallback() {
    window.clearInterval(this.timer);
  }

  private async evaluatePredicate() {
    this.show = await evaluatePredicate(this.when);
  }

  render() {
    if (this.show) return (<Host><slot/></Host>);
    return (<Host hidden><slot/></Host>);
  }
}
