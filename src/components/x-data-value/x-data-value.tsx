import { Component, Host, h, Prop, State } from '@stencil/core';
import { resolveExpression } from '../../services';

@Component({
  tag: 'x-data-value',
  styleUrl: 'x-data-value.scss',
  shadow: false,
})
export class XDataValue {
  private timer: number;

  /**
   The data expression to obtain a value for rendering as inner-text for this element.
   */
  @Prop() expression!: string;

  /**
   The data expression to obtain a value for rendering as inner-text for this element.
   */
  @Prop() class!: string;

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
    const result = await resolveExpression(this.expression);
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
