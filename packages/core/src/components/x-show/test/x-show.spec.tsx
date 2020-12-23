jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { XShow } from '../x-show';

describe('x-show', () => {
  it('renders hidden by default', async () => {
    const page = await newSpecPage({
      components: [XShow],
      html: `<x-show when="false"><p>Hide Me</p></x-show>`,
      supportsShadowDom: false
    });
    expect(page.root).toEqualHtml(`
      <x-show when="false" hidden="">
        <p>
          Hide Me
        </p>
      </x-show>
    `);
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XShow],
      html: `<x-show when="true"><p>Show Me</p></x-show>`,
      supportsShadowDom: false
    });
    expect(page.root).toEqualHtml(`
      <x-show when="true">
        <p>
          Show Me
        </p>
      </x-show>
    `);
  });
});
