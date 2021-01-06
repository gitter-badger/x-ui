import { newSpecPage } from '@stencil/core/testing';
import { XMarkdown } from '../x-markdown';

describe('x-markdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XMarkdown],
      html: `<x-markdown></x-markdown>`,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <x-markdown hidden="">
      </x-markdown>
    `);
  });
});
