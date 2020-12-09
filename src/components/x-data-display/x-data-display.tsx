import { Host, Element, Component, h, Prop, State, Fragment, Listen } from '@stencil/core';
import {
  DataEvent,
  DATA_EVENTS,
  debug,
  evaluatePredicate,
  getDataFromElement,
  getTokens,
  resolveExpression,
  resolveTemplate,
  RouterService,
} from '../../services';
import { removeAllChildNodes } from '../../services/utils/dom-utils';

@Component({
  tag: 'x-data-display',
  styleUrl: 'x-data-display.scss',
  shadow: false,
})
export class XDataDisplay {
  private hidden = false;
  @State() data: {[key: string]: any } = [];
  @State() innerTemplate: string;
  @State() resolvedTemplate: string;
  @State() value: string;
  @Element() el: HTMLXDataDisplayElement;

  /**
   The data expression to obtain a value for rendering as inner-text for this element.
   @example {session:user.name}
   @default null
   */
  @Prop() expression?: string;

  /**
   The class to put on the containing div element.
   */
  @Prop() class?: string = null;

  /**
   The data predicate to obtain a boolean for rendering this element.
   If left blank, the expression property is used.
   */
  @Prop() condition?: string = null;

  @Listen('xui:action-events:data', {
    target: 'body',
  })
  async dataEvent(ev: CustomEvent<DataEvent>) {
    if (ev.detail.type === DATA_EVENTS.DataChanged) {
      debug('<x-data-display: <data-provider~changed>');
      await this.resolveData();
    }
  }

  async componentWillLoad() {
    const template = this.el.firstElementChild as HTMLTemplateElement;
    this.innerTemplate = template?.innerHTML;
    removeAllChildNodes(this.el);
  }

  componentDidLoad() {
    RouterService.instance?.onRouteChange(async () => {
      await this.resolveData();
      await this.resolveTemplate();
    });
  }

  async componentWillRender() {
    await this.resolveData();
    await this.resolveTemplate();
  }

  private async resolveData() {
    if (this.innerTemplate) {
      const tokens = getTokens(this.innerTemplate);
      this.data = await getDataFromElement(tokens, this.el);
    }
  }

  private async resolveTemplate() {
    if (this.condition === '') {
      this.hidden = (!this.data?.$hasValue || !this.value);
    } else if (this.condition) {
      this.hidden = !evaluatePredicate(this.condition);
    }
    if (this.expression) {
      this.value = await resolveExpression(this.expression);
    }
    if (this.innerTemplate) {
      this.resolvedTemplate = resolveTemplate(this.innerTemplate, this.data);
    }
  }

  render() {
    if (this.hidden) {
      return <Host hidden></Host>;
    }

    if (this.resolvedTemplate) {
      return (
        <div class={this.class} innerHTML={this.resolvedTemplate}>
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
