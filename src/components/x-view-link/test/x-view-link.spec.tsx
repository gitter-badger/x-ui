jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { XViewLink } from '../x-view-link';

describe('x-view-link', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XViewLink],
      html: `<x-view-link></x-view-link>`,
    });
    expect(page.root).toEqualHtml(`
      <x-view-link>
        <mock:shadow-root>
          <a>
            <slot></slot>
          </a>
        </mock:shadow-root>
      </x-view-link>
    `);
  });
});
