jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { XHtml } from '../x-html';

describe('x-template-async', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XHtml],
      html: `<x-html></x-html>`,
    });
    expect(page.root).toEqualHtml(`
      <x-html>
        <mock:shadow-root>
          <div></div>
        </mock:shadow-root>
      </x-html>
    `);
  });
});
