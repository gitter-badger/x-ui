import { newSpecPage } from '@stencil/core/testing';
import { DxpStoryLink } from '../dxp-story-link';

describe('dxp-story-link', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DxpStoryLink],
      html: `<dxp-story-link></dxp-story-link>`,
    });
    expect(page.root).toEqualHtml(`
      <dxp-story-link>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dxp-story-link>
    `);
  });
});
