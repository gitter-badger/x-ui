import { Component, h, Host, State, Prop, Element } from '@stencil/core';
import { convertToFragment, warn } from '../..';

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
    if (this.src) {
      await this.setContentFromSrc();
    } else if (this.childScript) {
      this.setContentFromScript();
    }
  }

  async componentWillRender() {
    if (this.content) {
      const md = await this.buildFragment(this.content);
      this.clearDom();
      await this.stampDom(md);
    }
  }

  private async setContentFromSrc() {
    if (this.noRender || this.content) return;
    try {
      const response = await fetch(this.src);
      if (response.status === 200) {
        const data = await response.text();
        this.content = window['marked'] ? window['marked'](data, { baseUrl: this.getBaseUrl(this.src)}) : null;
      } else {
        warn(`x-include: Unable to retrieve from ${this.src}`);
      }
    } catch (error) {
      warn(`x-include: Unable to retrieve from ${this.src}`);
    }
  }

  private async setContentFromScript() {
    const el = this.childScript;
    const md = el.hasAttribute('data-dedent') ? this.dedent(el.text) : el.text;
    this.content = window['marked'] ? window['marked'](md) : null;
  }

  private onload(node: HTMLScriptElement) {
    return new Promise((resolve, reject) => {
      node.onload = resolve;
      node.onerror = (err: any) => reject(err.path ? err.path[0] : err.composedPath()[0]);
    });
  }

  private dedent(innerText:string) {
    const str = innerText.replace(/^\n/, '');
    const match = str.match(/^\s+/);
    return match ? str.replace(new RegExp(`^${match[0]}`, 'gm'), '') : str;
  }

  private clearDom() {
    const nodes = this.el.querySelectorAll('[class^=markdown]');
    nodes.forEach((n: { remove: () => any; }) => n.remove());
  }

  private getBaseUrl(src: string) {
    const a = document.createElement('a');
    a.href = src;
    return a.href.substring(0, a.href.lastIndexOf('/') + 1);
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

  // Construct md nodes and return promise that resolves to doc frag
  private async buildFragment(results:string) {
    const html = `<div class="markdown-body">${results}</div>`;
    const frag = convertToFragment(html);
    this.highlight(frag.firstElementChild);
    return frag;
  }

  // Stamps a fragment into DOM
  private async stampDom(frag: { querySelectorAll: (arg0: string) => any; firstElementChild: any; }) {
    const links = [...frag.querySelectorAll('link[rel="stylesheet"]')];
    this.el.appendChild(frag.firstElementChild);
    // Wrap all link elements with onload listener
    await Promise.all(links.map((l) => this.onload(l))).catch(() => {
      warn('x-markdown: An external stylesheet failed to load');
    });
  }

  render() {
    return (<Host></Host>);
  }
}
