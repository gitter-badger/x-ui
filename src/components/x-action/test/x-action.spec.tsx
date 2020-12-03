import { newSpecPage } from '@stencil/core/testing';
import { XAction } from '../x-action';

describe('x-action', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action></x-action>`,
    });
    expect(page.root).toEqualHtml(`
      <x-action>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-action>
    `);
  });
});
