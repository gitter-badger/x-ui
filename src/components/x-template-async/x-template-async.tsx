import { Component, h, State, Prop } from '@stencil/core';
import { warn } from '../../services/logging';

@Component({
  tag: 'x-template-async',
  styleUrl: 'x-template-async.css',
  shadow: true,
})
export class XTemplateAsync {
  @State() content: string = '';

  /**
   * Template URL
   *
   */
  @Prop() url?: string;

  private async fetchNewContent(url: string) {
    try {
      const response = await fetch(url);
      const data = await response.text();
      this.content = data;
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
