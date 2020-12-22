import { Element, Component, h, Prop, State, Host } from '@stencil/core';
import { arrify } from '../../services/utils/misc-utils';
import {
  ActionBus,
  DATA_EVENTS,
  // removeAllChildNodes,
  resolveExpression,
  hasExpression,
  RouterService,
  warn,
  debugIf,
} from '../../services';

@Component({
  tag: 'x-data-repeat',
  styleUrl: 'x-data-repeat.scss',
  shadow: false,
})
export class XDataRepeat {
  @Element() el: HTMLXDataRepeatElement;
  @State() resolvedItems: Array<any> = [];
  @State() innerTemplate: string;
  @State() resolvedTemplate: string;

  /**
   The array-string or data expression to obtain a collection for rendering the template.
   @example {session:cartItems}
   */
  @Prop() items?: string;

  /**
   * The URL to remote JSON collection to use for the items.
   * @example {session:user.name}
   */
  @Prop() itemsSrc?: string;

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  // eslint-disable-next-line @stencil/strict-mutable
  @Prop({ mutable: true}) noRender: boolean = false;

  /**
  * Turn on debug statements for load, update and render events.
  */
  @Prop() debug: boolean = false;

  get childTemplate(): HTMLTemplateElement {
    if (!this.el.hasChildNodes()) return null;
    const childTemplates = Array.from(this.el.childNodes)
      .filter((c) => c.nodeName === 'TEMPLATE')
      .map((v) => v as HTMLTemplateElement);

    if (childTemplates.length > 0) {
      return childTemplates[0];
    }
    return null;
  }

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
    debugIf(true, 'x-data-repeat: loading');
    ActionBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveItemsExpression();
      await this.resolveHtml();
    });

    RouterService.instance?.onRouteChange(async () => {
      await this.resolveHtml();
    });

    if (this.childTemplate !== null) {
      this.innerTemplate = this.childTemplate.innerHTML;
    } else warn('x-data-repeat: missing child <template> tag');

    if (this.childScript !== null) {
      try {
        this.resolvedItems = arrify(JSON.parse(this.childScript.innerText || '[]'));
      } catch (error) {
        warn(`x-data-repeat: unable to deserialize JSON: ${error}`);
      }
    } else if (this.itemsSrc) {
      await this.fetchJson();
    } else if (this.items) {
      await this.resolveItemsExpression();
    } else {
      warn('x-data-repeat: you must include at least one of the following: items, json-src or a <script> element with a JSON array.');
    }

    // removeAllChildNodes(this.el);
    await this.resolveHtml();
  }

  private async fetchJson() {
    try {
      const srcSegments = this.itemsSrc.split(':');
      debugIf(this.debug, `x-data-repeat: fetching items from ${srcSegments[0]}`);

      const response = await fetch(srcSegments[0]);
      if (response.status === 200) {
        const data = await response.json();
        this.resolvedItems = arrify(srcSegments[1] ? data[srcSegments[1]] : data);
        debugIf(this.debug, `x-data-repeat: remote items ${JSON.stringify(data)}`);
      } else {
        warn(`x-data-repeat: Unable to retrieve from ${this.itemsSrc}`);
      }
    } catch (error) {
      warn(`x-data-repeat: Unable to parse response from ${this.itemsSrc}`);
    }
  }

  private async resolveItemsExpression() {
    try {
      let itemsString = this.items;
      if (hasExpression(itemsString)) {
        itemsString = await resolveExpression(itemsString);
        debugIf(this.debug, `x-data-repeat: items resolved to ${itemsString}`);
      }
      this.resolvedItems = JSON.parse(itemsString);
    } catch (error) {
      warn(`x-data-repeat: unable to deserialize JSON: ${error}`);
    }
  }

  private async resolveHtml() {
    debugIf(this.debug, 'x-data-repeat: resolving html');
    if (this.noRender) return;

    debugIf(this.debug, `x-data-repeat: innerItems ${JSON.stringify(this.resolvedItems || [])}`);
    if (this.resolvedItems && this.innerTemplate) {
      this.resolvedTemplate = '';
      this.resolvedItems
        .reduce((previousPromise, item) => previousPromise
          .then(() => resolveExpression(this.innerTemplate, item)
            .then((html) => {
              this.resolvedTemplate += html;
            })), Promise.resolve());
    }
  }

  render() {
    if (this.resolvedTemplate) {
      return (
        <Host innerHTML={this.resolvedTemplate}>
        </Host>
      );
    }

    return null;
  }
}
