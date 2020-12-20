import { Host, Component, h, State, Prop, Element } from '@stencil/core';
import { warn } from '../..';

@Component({
  tag: 'x-html',
  styleUrl: 'x-html.scss',
  shadow: false,
})
export class XHtml {
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
  }

  private async fetchHtml() {
    if (this.noRender) return;
    try {
      const response = await fetch(this.src);
      if (response.status === 200) {
        const data = await response.text();
        this.content = data;
      } else {
        warn(`x-html: Unable to retrieve from ${this.src}`);
      }
    } catch (error) {
      warn(`x-html: Unable to retrieve from ${this.src}`);
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
