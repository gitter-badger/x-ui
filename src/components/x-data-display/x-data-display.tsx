import { Element, Component, h, Prop, State, Listen, Fragment } from '@stencil/core';
import {
  DataEvent,
  DATA_EVENTS,
  debug,
  resolveExpression,
  RouterService,
  warn,
} from '../../services';
import { removeAllChildNodes } from '../../services/utils/dom-utils';

@Component({
  tag: 'x-data-display',
  styleUrl: 'x-data-display.scss',
  shadow: false,
})
export class XDataDisplay {
  @State() innerTemplate: string;
  @State() resolvedTemplate: string;
  @State() value: string;
  @Element() el: HTMLXDataDisplayElement;

  /**
   The data expression to obtain a value for rendering as inner-text for this element.
   @example {session:user.name}
   @default null
   */
  @Prop() text?: string;

  @Listen('xui:action-events:data', {
    target: 'body',
  })
  async dataEvent(ev: CustomEvent<DataEvent>) {
    if (ev.detail.type === DATA_EVENTS.DataChanged) {
      debug('x-data-display: data-provider~changed');
      await this.resolveTemplate();
    }
  }

  async componentWillLoad() {
    const template = this.el.firstElementChild as HTMLTemplateElement;
    if (template !== null && template.tagName !== 'TEMPLATE') {
      warn(`x-data-display: The only allowed child is a single <template>. Found ${template.localName} `);
      return;
    }
    if (template == null) return;
    this.innerTemplate = template.innerHTML;
    removeAllChildNodes(this.el);
  }

  componentDidLoad() {
    RouterService.instance?.onRouteChange(async () => {
      await this.resolveTemplate();
    });
  }

  async componentWillRender() {
    await this.resolveTemplate();
  }

  private async resolveTemplate() {
    if (this.text) {
      this.value = await resolveExpression(this.text);
    }
    if (this.innerTemplate) {
      this.resolvedTemplate = await resolveExpression(this.innerTemplate);
    }
  }

  render() {
    if (this.resolvedTemplate) {
      return (
        <div innerHTML={this.resolvedTemplate}>
          { this.value }
        </div>
      );
    }

    if (this.value) {
      return <Fragment>{ this.value }</Fragment>;
    }

    return null;
  }
}
