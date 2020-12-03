import { newE2EPage } from '@stencil/core/testing';

describe('video-player', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<video-player></video-player>');

    const element = await page.find('video-player');
    expect(element).toHaveClass('hydrated');
  });
});
