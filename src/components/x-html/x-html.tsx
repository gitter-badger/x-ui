import { Component, h, State, Prop } from '@stencil/core';
import { warn } from '../../services/logging';

@Component({
  tag: 'x-html',
  styleUrl: 'x-html.css',
  shadow: true,
})
export class XHtml {
  @State() content: string = '';

  /**
   * Remote Template URL
   * @required
   */
  @Prop() url: string;

  private async fetchNewContent(url: string) {
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.text();
        this.content = data;
      } else {
        warn(`x-template-async: Unable to retrieve from ${this.url}`);
      }
    } catch (error) {
      warn(`x-template-async: Unable to retrieve from ${this.url}`);
    }
  }

  async componentWillLoad() {
    if (this.url) {
      await this.fetchNewContent(this.url);
    }
  }

  render() {
    return (
      <div innerHTML={this.content}></div>
    );
  }
}
