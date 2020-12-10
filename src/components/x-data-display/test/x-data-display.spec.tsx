jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { XDataDisplay } from '../x-data-display';

describe('x-data-display', () => {
  it('renders simple strings', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display text="foo"></x-data-display>`,
      supportsShadowDom: false
    });

    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <x-data-display text="foo">
        foo
      </x-data-display>
    `);
  });

  it('renders simple strings with classes', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display text="foo" class="name"></x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display text="foo" class="name">
        foo
      </x-data-display>
    `);
  });

  it('renders data in child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <template>
                <p>Hello Jason!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display>
        <div>
          <p>Hello Jason!</p>
        </div>
      </x-data-display>
    `);
  });

  it('renders data in child template with class', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display class="container" data-name="Jason">
              <template>
                <p>Hello Jason!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display class="container" data-name="Jason">
        <div>
          <p>Hello Jason!</p>
        </div>
      </x-data-display>
    `);
  });


  it('renders data and text in child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display text="test">
              <template>
                <p>Hello Jason!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display text="test">
        <div>
          <p>Hello Jason!</p>
          test
        </div>
      </x-data-display>
    `);
  });

});
