import { newSpecPage } from '@stencil/core/testing';
import { XDataProvider } from '../x-data-provider-sample';

describe('x-data-provider-sample', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataProvider],
      html: `<x-data-provider-sample/>`,
    });
    expect(page.root).toEqualHtml(`
    <x-data-provider-sample/>
    `);
  });
});