import { newE2EPage } from '@stencil/core/testing';

describe('x-data-provider-sample', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<x-data-provider-sample></x-data-provider-sample>');
    const element = await page.find('x-data-provider-sample');
    expect(element).toHaveClass('hydrated');
  });
});
