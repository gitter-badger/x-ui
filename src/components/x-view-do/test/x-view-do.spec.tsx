import { newSpecPage } from '@stencil/core/testing';
import { XViewDo } from '../x-view-do';

describe('x-view-do', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XViewDo],
      html: `<x-view-do></x-view-do>`,
    });
    expect(page.root).toEqualHtml(`
      <x-view-do>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-view-do>
    `);
  });
});
