import { newSpecPage } from '@stencil/core/testing';
import { XDataDisplay } from '../x-data-display';

describe('x-data-display', () => {
  it('renders simple strings', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display from="foo"></x-data-display>`,
      supportsShadowDom: false
    });

    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <x-data-display from="foo">
        foo
      </x-data-display>
    `);
  });

  it('renders simple strings with classes', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display from="foo" class="name"></x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display from="foo" class="name">
        foo
      </x-data-display>
    `);
  });

});
