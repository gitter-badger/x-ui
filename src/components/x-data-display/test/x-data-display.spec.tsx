import { newSpecPage } from '@stencil/core/testing';
import { XDataDisplay } from '../x-data-display';

describe('x-data-display', () => {
  it('renders simple strings', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display expression="foo"></x-data-display>`,
      supportsShadowDom: false
    });

    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <x-data-display expression="foo">
        foo
      </x-data-display>
    `);
  });

  it('renders simple strings with classes', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display expression="foo" class="name"></x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display expression="foo" class="name">
        foo
      </x-data-display>
    `);
  });

  it('renders data in child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display data-name="Jason">
              <template>
                <p>Hello {{name}}!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display data-name="Jason">
        <template>
          <p>Hello {{name}}!</p>
        </template>
        <p>Hello Jason}!</p>
      </x-data-display>
    `);
  });

});
