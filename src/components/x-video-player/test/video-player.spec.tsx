import { newSpecPage } from '@stencil/core/testing';
import { VideoPlayer } from '../video-player';

describe('video-player', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VideoPlayer],
      html: `<video-player></video-player>`,
    });
    expect(page.root).toEqualHtml(`
      <video-player>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </video-player>
    `);
  });
});
