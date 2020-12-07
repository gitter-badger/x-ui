import { Element, Component, h, Prop, State, Host, Listen } from '@stencil/core';
import { RouterService } from '../../services/routing/router-service';
import {
  DataEvent,
  DATA_EVENTS,
  debug,
  evaluateHTML,
  getTokens,
  resolveExpression,
  warn,
} from '../../services';

@Component({
  tag: 'x-data-display',
  styleUrl: 'x-data-display.scss',
  shadow: false,
})
export class XDataDisplay {
  @State() value: string;
  @State() childNodes: string;
  @Element() el: HTMLXDataDisplayElement;

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

  @Listen('xui:action-events:data', {
    target: 'body',
  })
  async dataEvent(ev: CustomEvent<DataEvent>) {
    // eslint-disable-next-line no-console
    console.dir(ev);
    if (ev.detail.type === DATA_EVENTS.DataChanged) {
      debug('<x-data-display: <data-provider~changed>');
      await this.resolveExpression();
    }
  }

  componentWillLoad() {
    RouterService.instance.onRouteChange(() => {
      this.resolveExpression();
    });
  }

  async componentWillRender() {
    await this.resolveExpression();
  }

  private async resolveExpression() {
    if (this.expression) {
      const result = await resolveExpression(this.expression);
      if (result !== this.value) this.value = result;
    }
    await this.resolveInnerTemplate();
  }

  private async resolveInnerTemplate() {
    const template = this.el.firstElementChild as HTMLTemplateElement;
    if (template === undefined || !template?.content) return;

    try {
      const data = {};
      const tokens = getTokens(template.content);

      // distinct token values; only the first part if there's dot-notation
      const promises = [...new Set(tokens.filter((t) => t.type === 1 || t.type === 2)
        .map((t: { value: string; }) => t.value.split('.')[0]))]
        .map(async (v:string) => {
          const attr = this.el.getAttribute(`data-${v}`);
          if (attr) {
            const val = await resolveExpression(attr);
            data[v] = val;
          }
          return null;
        });

      await Promise.all(promises);

      this.childNodes = evaluateHTML(template.content, data);
    } catch (error) {
      warn(error);
    }
  }

  render() {
    return (
      <Host>
        { this.value }
        { this.childNodes
          ? <span innerHTML={this.childNodes}></span>
          : null }
      </Host>
    );
  }
}
