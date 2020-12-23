jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { XUI } from '../x-ui';

describe('x-ui', () => {
  it('renders hidden by default', async () => {
    const page = await newSpecPage({
      components: [XUI],
      html: `<x-ui></x-ui>`,
    });
    expect(page.root).toEqualHtml(`
      <x-ui class="fill">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-ui>
    `);
  });

});
