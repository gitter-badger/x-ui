import { newSpecPage } from '@stencil/core/testing';
import { XDataProvider } from '../x-data-provider';

describe('x-data-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataProvider],
      html: `<x-data-provider></x-data-provider>`,
    });
    expect(page.root).toEqualHtml(`
      <x-data-provider>
        <mock:shadow-root>
        </mock:shadow-root>
      </x-data-provider>
    `);
  });
});
