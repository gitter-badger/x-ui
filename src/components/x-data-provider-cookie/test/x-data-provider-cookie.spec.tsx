jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { XDataProviderCookie } from '../x-data-provider-cookie';

describe('x-data-provider-cookie', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataProviderCookie],
      html: `<x-data-provider-cookie></x-data-provider-cookie>`,
    });
    expect(page.root).toEqualHtml(`
      <x-data-provider-cookie>
        <mock:shadow-root>
          <div>
            <slot></slot>
            <button type="button">
              Accept
            </button>
          </div>
        </mock:shadow-root>
      </x-data-provider-cookie>
    `);
  });
});
