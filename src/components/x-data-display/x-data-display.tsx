import { Component, Host, h, Prop, State } from '@stencil/core';
import { resolveExpression } from '../../services';

@Component({
  tag: 'x-data-display',
  styleUrl: 'x-data-display.scss',
  shadow: false,
})
export class XDataDisplay {
  private timer: number;

  /**
   The data expression to obtain a value for rendering as inner-text for this element.
   @example {session:user.name}
   @default null
   */
  @Prop() from!: string;

  /**
   The data expression to obtain a value for rendering as inner-text for this element.
   */
  @Prop() class: string = null;

  @State() value: string;

  connectedCallback() {
    this.timer = window.setInterval(async () => {
      await this.resolveExpression();
    }, 1000);
    return this.resolveExpression();
  }

  disconnectedCallback() {
    window.clearInterval(this.timer);
  }

  private async resolveExpression() {
    const result = await resolveExpression(this.from);
    if (result !== this.value) this.value = result;
  }

  render() {
    return (
      <Host class={this.class}>
        { this.value }
      </Host>
    );
  }
}
