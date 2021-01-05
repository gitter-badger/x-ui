import { Component, h, Host, State, Prop, Element } from '@stencil/core';
import {
  resolveElementVisibility,
  RouterService,
  warn,
  resolveExpression,
  eventBus,
  DATA_EVENTS,
  ROUTE_EVENTS
} from '../..';

/**
 *  @system content
 */
@Component({
  tag: 'x-markdown',
  styleUrl: 'x-markdown.scss',
  shadow: false,
})
export class XMarkdown {
  @Element() el: HTMLXMarkdownElement;
  @State() content: string;

  /**
   * Remote Template URL
   */
  @Prop() src: string;


  /**
   * Base Url for embedded links
   */
  @Prop() baseUrl: string;

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  // eslint-disable-next-line @stencil/strict-mutable
  @Prop({ mutable: true}) noRender: boolean = false;

  private get childScript(): HTMLScriptElement {
    if (!this.el.hasChildNodes()) return null;
    const childScripts = Array.from(this.el.childNodes)
      .filter((c) => c.nodeName === 'SCRIPT')
      .map((v) => v as HTMLScriptElement);

    if (childScripts.length > 0) {
      return childScripts[0];
    }
    return null;
  }

  async componentWillLoad() {
    eventBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveContent();
    });

    eventBus.on(ROUTE_EVENTS.RouteChanged, async () => {
      await this.resolveContent();
    });

    await this.resolveContent();
  }

  private async resolveContent() {
    if (this.noRender) return;

    let content = '';
    if (this.src) {
      content = await this.getContentFromSrc();
    } else if (this.childScript) {
      content = this.getContentFromScript();
    }

    const div = document.createElement('div');
    div.className = 'markdown-body';
    div.innerHTML = content;
    this.highlight(div);
    this.content = div.innerHTML;
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

  private async getContentFromSrc() {
    try {
      const src = await resolveExpression(this.src);
      const response = await fetch(src);
      if (response.status === 200) {
        const data = await response.text();
        return window['marked'] ? window['marked'](data, { baseUrl: this.baseUrl }) : null;
      } else {
        warn(`x-markdown: unable to retrieve from ${this.src}`);
      }
    } catch (error) {
      warn(`x-markdown: unable to retrieve from ${this.src}`);
    }
  }

  private getContentFromScript() {
    const el = this.childScript;
    const md = this.dedent(el.text);
    return window['marked'] ? window['marked'](md) : null;
  }

  private dedent(innerText:string) {
    const str = innerText.replace(/^\n/, '');
    const match = str.match(/^\s+/);
    return match ? str.replace(new RegExp(`^${match[0]}`, 'gm'), '') : str;
  }

  private highlight(container: { querySelectorAll: (arg0: string) => any; }) {
    const unhinted = container.querySelectorAll('pre>code:not([class*="language-"])');
    unhinted.forEach((n: { innerText: string; classList: { add: (arg0: string) => void; }; }) => {
      // Dead simple language detection :)
      // eslint-disable-next-line no-nested-ternary
      const lang = n.innerText.match(/^\s*</) ? 'markup' : n.innerText.match(/^\s*(\$|#)/) ? 'bash' : 'js';
      n.classList.add(`language-${lang}`);
    });
    if (window && window['Prism']) {
      window['Prism'].highlightAllUnder(container);
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
