import { newE2EPage } from '@stencil/core/testing';

describe('x-container', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-container></x-container>');

    const element = await page.find('x-container');
    expect(element).toHaveClass('hydrated');
  });
});
