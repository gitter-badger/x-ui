import { Host, Component, h, State, Prop, Element } from '@stencil/core';
import { warn } from '../..';
import { ActionBus, DATA_EVENTS, resolveExpression, RouterService } from '../../services';
import { hasExpression } from '../../services/data/expression-evaluator';

@Component({
  tag: 'x-html',
  styleUrl: 'x-html.scss',
  shadow: false,
})
export class XHtml {
  @State() responseHtml: string;
  @Element() el: HTMLXHtmlElement;
  @State() content: string;

  /**
   * Remote Template URL
   * @required
   */
  @Prop() src: string;

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  // eslint-disable-next-line @stencil/strict-mutable
  @Prop({ mutable: true}) noRender: boolean = false;

  async componentWillLoad() {
    await this.fetchHtml();

    ActionBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveTemplate();
    });

    RouterService.instance?.onRouteChange(async () => {
      await this.resolveTemplate();
    });
  }

  private async fetchHtml() {
    if (this.noRender) return;
    try {
      const response = await fetch(this.src);
      if (response.status === 200) {
        const data = await response.text();
        this.responseHtml = data;
        await this.resolveTemplate();
      } else {
        warn(`x-html: Unable to retrieve from ${this.src}`);
      }
    } catch (error) {
      warn(`x-html: Unable to retrieve from ${this.src}`);
    }
  }

  private async resolveTemplate() {
    if (hasExpression(this.responseHtml)) {
      this.content = await resolveExpression(this.responseHtml);
    } else {
      this.content = this.responseHtml;
    }
  }

  async componentWillRender() {
    await this.fetchHtml();
  }

  render() {
    if (this.content) {
      return (
        <div class="ion-page" innerHTML={this.content}></div>
      );
    }
    return (<Host hidden></Host>);
  }
}
