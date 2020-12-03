import { Component, h, State, Prop } from '@stencil/core';

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
    const response = await fetch(url);
    const data = await response.text();
    this.content = data;
  }

  async componentWillLoad() {
    if (this.url != null) {
      await this.fetchNewContent(this.url);
    }
  }

  render() {
    return (
      <div innerHTML={this.content}></div>
    );
  }
}
