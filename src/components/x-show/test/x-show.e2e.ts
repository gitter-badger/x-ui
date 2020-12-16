jest.mock('../../../services/logging');

import { newE2EPage } from '@stencil/core/testing';

describe('x-show', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-show></x-show>');

    const element = await page.find('x-data-show');
    expect(element).toHaveClass('hydrated');
  });
});
