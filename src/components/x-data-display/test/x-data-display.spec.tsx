jest.mock('../../../services/logging');

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
        <div><p>Hello Jason!</p></div>
      </x-data-display>
    `);
  });

  it('renders data in child template with class', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display class="container" data-name="Jason">
              <template>
                <p>Hello {{name}}!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display class="container" data-name="Jason">
        <div class="container"><p>Hello Jason!</p></div>
      </x-data-display>
    `);
  });


  it('renders data and expression in child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display expression="test" data-name="Jason">
              <template>
                <p>Hello {{name}}!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display expression="test" data-name="Jason">
        <div>
          <p>Hello Jason!</p>
          test
        </div>
      </x-data-display>
    `);
  });

  it('renders data and expression in child template with class', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display class="container" expression="test" data-name="Jason">
              <template>
                <p>Hello {{name}}!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false
    });

    expect(page.root).toEqualHtml(`
      <x-data-display class="container" expression="test" data-name="Jason">
        <div class="container">
          <p>Hello Jason!</p>
          test
        </div>
      </x-data-display>
    `);
  });

});
