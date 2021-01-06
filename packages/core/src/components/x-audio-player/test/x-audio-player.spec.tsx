jest.mock('../../../services/logging');

import { newSpecPage } from '@stencil/core/testing';
import { AudioPlayer } from '../x-audio-player';

describe('audio-player', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AudioPlayer],
      html: `<x-audio-player></x-audio-player>`,
    });
    expect(page.root).toEqualHtml(`
    <x-audio-player>
      <mock:shadow-root>
      </mock:shadow-root>
    </x-audio-player>
    `);
  });
});
