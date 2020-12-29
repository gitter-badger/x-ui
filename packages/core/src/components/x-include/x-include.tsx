import { Host, Component, h, State, Prop, Element } from '@stencil/core';
import { warn } from '../..';

/**
 *  @system content
 */
@Component({
  tag: 'x-include',
  shadow: false,
})
export class XInclude {
  @Element() el: HTMLXIncludeElement;
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
    if (this.noRender || this.content) return;
    try {
      const response = await fetch(this.src);
      if (response.status === 200) {
        const data = await response.text();
        this.content = data;
      } else {
        warn(`x-include: Unable to retrieve from ${this.src}`);
      }
    } catch (error) {
      warn(`x-include: Unable to retrieve from ${this.src}`);
    }
  }

  render() {
    if (this.content) {
      return (
        <Host>
          <div innerHTML={this.content}></div>
        </Host>
      );
    }
    return (<Host hidden></Host>);
  }
}
