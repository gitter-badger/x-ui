import { newE2EPage } from '@stencil/core/testing';

describe('dxp-story-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dxp-story-link></dxp-story-link>');

    const element = await page.find('dxp-story-link');
    expect(element).toHaveClass('hydrated');
  });
});
