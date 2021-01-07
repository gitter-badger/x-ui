jest.mock('../../../services/logging');
jest.mock('../../../services/audio/action-listener');

import { newSpecPage } from '@stencil/core/testing';
import {
  AUDIO_TOPIC, AUDIO_COMMANDS,
  audioState, interfaceState,
  AudioInfo, audioStore, interfaceStore,
  actionBus, AudioType,
  DiscardStrategy,
  eventBus,
  AudioTrack,
} from '../../..';
import { XAudioPlayer } from '../x-audio-player';
import { sleep } from '../../../services/utils/promise-utils';

describe('x-audio-player', () => {
  let data;
  let audio;

  beforeAll(() => {
    data = {
      src: '/fake/path.mp3',
      trackId: 'queued-music-1',
      type: AudioType.Music,
      discard: DiscardStrategy.Route,
      loop: true,
    }
    actionBus.removeAllListeners();
    eventBus.removeAllListeners();

    audio = {
      play: () => 0,
      pause: () => this,
      fade: () => this,
      stop: () => this,
      mute: () => this,
      state: () => 'loaded',
      seek: (_time: number) => this,
      volume: (_value: number) => this,
    }

    interfaceStore.dispose();
    audioStore.dispose();

  });

  AudioTrack.createSound = (info: AudioInfo, onload, onend, onerror) => {
    const instance = Object.assign(info, audio, {
      onload,
      onend,
      onerror
    });
    onload();
    return instance;
  }


  it('renders', async () => {
    const page = await newSpecPage({
      components: [XAudioPlayer],
      html: `<x-audio-player></x-audio-player>`,
    });
    expect(page.root).toEqualHtml(`
    <x-audio-player>
      <mock:shadow-root></mock:shadow-root>
    </x-audio-player>
    `);
    await page.waitForChanges();
  });

  it('reacts to audioState changes', async () => {
    const page = await newSpecPage({
      components: [XAudioPlayer],
      html: `<x-audio-player></x-audio-player>`,
    });
    expect(page.root).toEqualHtml(`
    <x-audio-player>
      <mock:shadow-root></mock:shadow-root>
    </x-audio-player>
    `);

    await page.waitForChanges();

    audioState.hasAudio = true;

    await page.waitForChanges();

    interfaceState.muted = true;
  });

  it('reacts to listener changes', async () => {
    const page = await newSpecPage({
      components: [XAudioPlayer],
      html: `<x-audio-player display></x-audio-player>`,

    });

    sleep(1000);

    await page.waitForChanges();

    page.body.querySelector('x-audio-player').remove();

    await page.waitForChanges();
  });

  afterAll(() => {
  })
});
