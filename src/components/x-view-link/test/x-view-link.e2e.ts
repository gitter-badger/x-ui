import { newE2EPage } from '@stencil/core/testing';

describe('x-view-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-view-link></x-view-link>');

    const element = await page.find('x-view-link');
    expect(element).toHaveClass('hydrated');
  });
});
