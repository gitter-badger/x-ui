jest.mock('../../../services/logging');

import { newE2EPage } from '@stencil/core/testing';

describe('x-html', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-html></x-html>');

    const element = await page.find('x-html');
    expect(element).toHaveClass('hydrated');
  });
});
