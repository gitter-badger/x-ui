import { Component, Host, h, Method, Prop } from '@stencil/core';
import { ActionEvent, debugIf, state } from '../..';

@Component({
  tag: 'x-action',
  shadow: true,
})
export class XAction {
  /**
  *
  */
  @Prop() topic: string;
  /**
  *
  */
  @Prop() command: string;
  /**
  *
  */
  @Prop() data: string;
  /**
  *
  */
  @Method()
  async getAction(): Promise<{ topic: string, action: ActionEvent<any>}> {
    return {
      topic: this.topic,
      action: {
        command: this.command,
        data: JSON.parse(this.data || '{}'),
      },
    };
  }

  componentWillLoad() {
    debugIf(state.debug, `x-action: <x-action~loading> ${this.topic} ${this.command}`);
  }

  render() {
    return (
      <Host hidden></Host>
    );
  }
}
