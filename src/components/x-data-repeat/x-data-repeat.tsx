import { Element, Component, h, Prop, State } from '@stencil/core';
import {
  ActionBus,
  DATA_EVENTS,
  removeAllChildNodes,
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
  @State() innerItems: Array<any> = [];
  @State() innerTemplate: string;
  @State() resolvedTemplate: string;

  /**
   The array-string or data expression to obtain a collection for rendering the template.
   @example {session:user.name}
   @default null
   */
  @Prop() items?: string;

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
    ActionBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveTemplate();
    });

    RouterService.instance?.onRouteChange(async () => {
      await this.resolveTemplate();
    });

    if (this.childTemplate !== null) {
      this.innerTemplate = this.childTemplate.innerHTML;
    } else warn('x-data-repeat: missing child <template> tag');

    if (this.childScript !== null) {
      try {
        this.innerItems = JSON.parse(this.childScript.innerText || '[]');
      } catch (error) {
        warn(`x-data-repeat: unable to deserialize JSON: ${error}`);
      }
    } else if (!this.items) {
      warn('x-data-repeat: you must include items attribute or child <script>');
    }

    removeAllChildNodes(this.el);
  }

  async componentWillRender() {
    await this.resolveTemplate();
  }

  private async resolveTemplate() {
    if (this.noRender) return;

    if (this.items) {
      try {
        let itemsString = this.items;
        if (hasExpression(itemsString)) {
          itemsString = await resolveExpression(itemsString);
          debugIf(this.debug, `x-data-repeat: items resolved to ${itemsString}`);
        }
        this.innerItems = JSON.parse(itemsString);
      } catch (error) {
        warn(`x-data-repeat: unable to deserialize JSON: ${error}`);
      }
    }

    debugIf(this.debug, `x-data-repeat: innerItems ${JSON.stringify(this.innerItems || [])}`);
    if (this.innerItems) {
      this.resolvedTemplate = '';
      const promises = this.innerItems
        .map((item) => resolveExpression(this.innerTemplate, item)
          .then((html) => {
            this.resolvedTemplate += html;
          }));
      await Promise.all(promises);
    }
  }

  render() {
    if (this.resolvedTemplate) {
      return (
        <div innerHTML={this.resolvedTemplate}>
        </div>
      );
    }

    return null;
  }
}
