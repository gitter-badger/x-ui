import { Element, Component, h, Prop, State, Fragment, Listen } from '@stencil/core';
import { RouterService } from '../../services/routing/router-service';
import {
  DataEvent,
  DATA_EVENTS,
  debug,
  resolveExpression,
  resolveTemplateFromElementData,
} from '../../services';
import { removeAllChildNodes } from '../../services/utils/dom-utils';

@Component({
  tag: 'x-data-display',
  styleUrl: 'x-data-display.scss',
  shadow: false,
})
export class XDataDisplay {
  private innerTemplate: any;
  @State() value: string;
  @State() resolvedHtml: string;
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
    if (ev.detail.type === DATA_EVENTS.DataChanged) {
      debug('<x-data-display: <data-provider~changed>');
      await this.resolveExpression();
    }
  }

  componentWillLoad() {
    const template = this.el.firstElementChild as HTMLTemplateElement;
    this.innerTemplate = template?.innerHTML;

    removeAllChildNodes(this.el);

    RouterService.instance?.onRouteChange(() => {
      this.resolveExpression();
    });
  }

  async componentWillRender() {
    await this.resolveExpression();
  }

  private async resolveExpression() {
    if (this.expression) {
      this.value = await resolveExpression(this.expression);
    }
    if (this.innerTemplate) {
      this.resolvedHtml = await resolveTemplateFromElementData(this.el, this.innerTemplate);
    }
  }

  render() {
    if (this.resolvedHtml) {
      return (
        <div class={this.class} innerHTML={this.resolvedHtml}>
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
