import { newSpecPage } from '@stencil/core/testing';
import { XTemplateAsync } from '../x-template-async';

describe('x-template-async', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XTemplateAsync],
      html: `<x-template-async></x-template-async>`,
    });
    expect(page.root).toEqualHtml(`
      <x-template-async>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-template-async>
    `);
  });
});
