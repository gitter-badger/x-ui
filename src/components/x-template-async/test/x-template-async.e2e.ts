import { newE2EPage } from '@stencil/core/testing';

describe('x-template-async', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-template-async></x-template-async>');

    const element = await page.find('x-template-async');
    expect(element).toHaveClass('hydrated');
  });
});
