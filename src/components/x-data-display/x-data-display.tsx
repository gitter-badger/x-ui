import { Element, Component, h, Prop, State, Host } from '@stencil/core';
import { evaluateHTML, getTokens, resolveExpression, warn } from '../../services';

@Component({
  tag: 'x-data-display',
  styleUrl: 'x-data-display.scss',
  shadow: false,
})
export class XDataDisplay {
  @Element() el;
  private timer: number;

  /**
   The data expression to obtain a value for rendering as inner-text for this element.
   @example {session:user.name}
   @default null
   */
  @Prop() expression: string;

  /**
   The data expression to obtain a value for rendering as inner-text for this element.
   */
  @Prop() class: string = null;

  @State() value: string;

  @State() childNodes: string;

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
    if (this.expression) {
      const result = await resolveExpression(this.expression);
      if (result !== this.value) this.value = result;
    }
    await this.resolveInnerTemplate();
  }

  private async resolveInnerTemplate() {

    let template = this.el.firstElementChild as HTMLTemplateElement;
    if (template == undefined || !template.content) return;

    try {
      let data = {};
      let tokens = getTokens(template.content);

      // distinct token values; only the first part if there's dot-notation
      let promises = [...new Set(tokens.filter(t => t.type == 1 || t.type == 2)
        .map(t => t.value.split('.')[0]))]
          .map(async v => {
            let attr = this.el.getAttribute(`data-${v}`);
            if (attr) {
              let val = await resolveExpression(attr);
              data[v] = val;
            }
            return null;
          });

      await Promise.all(promises);

      this.childNodes = evaluateHTML(template.content, data);
    } catch (error) {
      warn(error)
      window.clearInterval(this.timer);
    }
  }

  render() {
    return (
      <Host>
        { this.value }
        <span innerHTML={this.childNodes}></span>
      </Host>
    );
  }
}
