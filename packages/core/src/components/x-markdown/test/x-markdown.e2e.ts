import { newE2EPage } from '@stencil/core/testing';

describe('x-markdown', () => {
  it('renders', async () => {
    const page = await newE2EPage({
      waitUntil: 'load',
    });
    page.addScriptTag({
      url: 'https://cdn.jsdelivr.net/gh/markedjs/marked@1/marked.min.js',
    });
    await page.setContent(`
    <x-markdown><script># Hello </script></x-markdown>
    `);

    const element = await page.find('x-markdown');
    expect(element).toHaveClass('hydrated');
  });
});
