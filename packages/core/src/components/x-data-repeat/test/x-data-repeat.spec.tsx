import { newSpecPage } from '@stencil/core/testing';
import { XDataRepeat } from '../x-data-repeat';

describe('x-data-repeat', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat></x-data-repeat>`,
      supportsShadowDom: false
    });
    expect(page.root).toEqualHtml(`
      <x-data-repeat>
      </x-data-repeat>
    `);
  });
});
