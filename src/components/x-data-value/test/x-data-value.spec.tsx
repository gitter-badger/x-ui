import { newSpecPage } from '@stencil/core/testing';
import { XDataValue } from '../x-data-value';

describe('x-data-value', () => {
  it('renders simple strings', async () => {
    const page = await newSpecPage({
      components: [XDataValue],
      html: `<x-data-value expression="foo"></x-data-value>`,
      supportsShadowDom: false
    });

    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <x-data-value expression="foo">
        foo
      </x-data-value>
    `);
  });

  it('renders simple strings with classes', async () => {
    const page = await newSpecPage({
      components: [XDataValue],
      html: `<x-data-value expression="foo" class="name"></x-data-value>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-value expression="foo" class="name">
        foo
      </x-data-value>
    `);
  });

});
