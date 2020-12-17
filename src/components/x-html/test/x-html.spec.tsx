jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { XHtml } from '../x-html';

describe('x-template-async', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XHtml],
      html: `<x-html></x-html>`,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <x-html hidden=""></x-html>
    `);
  });

  it('no render', async () => {
    const page = await newSpecPage({
      components: [XHtml],
      html: `<x-html no-render></x-html>`,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <x-html hidden=""></x-html>
    `);
  });
});
