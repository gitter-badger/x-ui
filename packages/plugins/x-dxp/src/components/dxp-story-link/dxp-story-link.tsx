import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dxp-story-link',
  styleUrl: 'dxp-story-link.css',
  shadow: true,
})
export class DxpStoryLink {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
