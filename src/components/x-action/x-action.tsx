import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'x-action',
  shadow: true,
})
export class XAction {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
