import { newSpecPage } from '@stencil/core/testing';
import { XUse } from '../x-use';

describe('x-use', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUse],
      html: `<x-use inline></x-use>`,
    });
    expect(page.root).toEqualHtml(`
      <x-use inline>
      </x-use>
    `);
  });
});
