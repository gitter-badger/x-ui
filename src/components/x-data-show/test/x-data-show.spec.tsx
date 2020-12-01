import { newSpecPage } from '@stencil/core/testing';
import { XDataShow } from '../x-data-show';

describe('x-data-show', () => {
  it('renders hidden by default', async () => {
    const page = await newSpecPage({
      components: [XDataShow],
      html: `<x-data-show when="false"><p>Hide Me</p></x-data-show>`,
    });
    expect(page.root).toEqualHtml(`
      <x-data-show when="false" hidden="">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <p>
          Hide Me
        </p>
      </x-data-show>
    `);
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataShow],
      html: `<x-data-show when="true"><p>Show Me</p></x-data-show>`,
    });
    expect(page.root).toEqualHtml(`
      <x-data-show when="true">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <p>
          Show Me
        </p>
      </x-data-show>
    `);
  });
});
