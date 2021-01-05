import { Host, Component, h, State, Prop, Element } from '@stencil/core';
import { resolveElementVisibility, RouterService, warn, resolveExpression, eventBus, ROUTE_EVENTS, DATA_EVENTS } from '../..';

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
   */
  @Prop() src!: string;

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  // eslint-disable-next-line @stencil/strict-mutable
  @Prop({ mutable: true}) noRender: boolean = false;

  async componentWillLoad() {
    eventBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveContent();
    });

    eventBus.on(ROUTE_EVENTS.RouteChanged, async () => {
      await this.resolveContent();
    });
  }

  async componentWillRender() {
    await this.resolveContent();
  }

  componentDidRender() {
    resolveElementVisibility(this.el);
    if (RouterService.instance) {
      this.el.querySelectorAll('a[href^=http]').forEach(a => {
        a.addEventListener('click', (e) => {
          const href = a.getAttribute('href');
          e.preventDefault();
          RouterService.instance.history.push(href);
        })
      });
    }
  }

  private async resolveContent() {
    if (this.noRender) return;
    try {
      const src = await resolveExpression(this.src);
      const response = await fetch(src);
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
