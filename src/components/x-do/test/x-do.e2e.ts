import { newE2EPage } from '@stencil/core/testing';

describe('x-do', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-do></x-do>');

    const element = await page.find('x-do');
    expect(element).toHaveClass('hydrated');
  });
});
