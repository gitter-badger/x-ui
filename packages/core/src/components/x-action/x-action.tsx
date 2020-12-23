import { Component, Host, h, Method, Prop, Element } from '@stencil/core';
import { ActionEvent, warn } from '../..';
/**
 * This element just holds data to express the actionEvent to fire. This element
 * should always be the child of a x-action-activator.
 *
 * @export
 * @class XAction
 */
@Component({
  tag: 'x-action',
  shadow: true,
})
export class XAction {
  private deserializedData: { [key: string] : any };

  @Element() el: HTMLXActionElement;
  /**
  * This is the topic this action-command is targeting.
  */
  @Prop() topic: 'data'|'routing'|'document';

  /**
  * The command to execute.
  */
  @Prop() command: string;

  /**
  * The JSON serializable data payload the command requires.
  */
  @Prop() data: string;

  /**
  * Get the underlying actionEvent instance. Used by the x-action-activator element.
  */
  @Method()
  async getAction(): Promise<ActionEvent<any>> {
    return {
      topic: this.topic,
      command: this.command,
      data: this.deserializedData,
    };
  }

  private get parent(): HTMLXActionActivatorElement {
    return this.el.closest('x-action-activator') as HTMLXActionActivatorElement;
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

  componentWillLoad() {
    if (this.parent === undefined) {
      warn('The x-action component must be wrapped with an x-action-activator component to work.');
    } else if (this.childScript) {
      this.deserializedData = JSON.parse(this.childScript.innerText);
    } else {
      this.deserializedData = JSON.parse(this.data || '{}');
    }
  }

  render() {
    return (
      <Host hidden></Host>
    );
  }
}
