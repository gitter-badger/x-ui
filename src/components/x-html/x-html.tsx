import { Component, h, State, Prop, Element } from '@stencil/core';
import { warn } from '../../services/logging';

@Component({
  tag: 'x-html',
  styleUrl: 'x-html.css',
  shadow: true,
})
export class XHtml {
  @Element() el: HTMLXHtmlElement;
  @State() content: string = '';

  /**
   * Remote Template URL
   * @required
   */
  @Prop() url: string;

  private async fetchHtml(url: string) {
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.text();
        this.content = data;
      } else {
        warn(`x-html: Unable to retrieve from ${this.url}`);
      }
    } catch (error) {
      warn(`x-html: Unable to retrieve from ${this.url}`);
    }
  }

  async componentWillRender() {
    if (this.url) {
      await this.fetchHtml(this.url);
    }
  }

  render() {
    return (
      <div innerHTML={this.content}></div>
    );
  }
}
