import { Howl } from 'howler';
import { AudioTrack, AUDIO_EVENTS } from './interfaces';
import { debug, EventEmitter } from '../..';

export class QueuedAudio extends AudioTrack {
  private sound: Howl;
  events: EventEmitter;
  previousVolume: number;
  position: number;

  constructor(track: AudioTrack) {
    super();
    this.events = new EventEmitter();
    Object.assign(this, track);
    debug(`Loading howl: ${track.src}`)
    this.sound = new Howl({
      loop: this.loop,
      src: this.src,
      onend: () => this.events.emit(AUDIO_EVENTS.Ended)
    });
    this.previousVolume = this.sound.volume();
    this.sound.once('load', () => {
      this.events.emit(AUDIO_EVENTS.Loaded);
    });
  }

  get state() {
    return this.sound.state();
  }

  get isPlaying() {
    return this.sound.playing();
  }

  play() {
    this.sound.volume(0);
    this.sound.play();
    this.sound.fade(0, this.previousVolume, 1);
    this.events.emit(AUDIO_EVENTS.Played);
  }

  stop() {
    this.sound.fade(this.previousVolume, 0, 1);
    this.sound.stop();
    this.events.emit(AUDIO_EVENTS.Stopped)
  }

  pause() {
    this.sound.pause();
    this.events.emit(AUDIO_EVENTS.Paused);
  }

  resume() {
    this.sound.play();
    this.events.emit(AUDIO_EVENTS.Resumed);
  }

  start() {
    if (this.state == 'loaded') {
      this.play();
    } else if (this.state == 'loading') {
      this.events.once(AUDIO_EVENTS.Loaded, () => this.play())
    }
  }

  seek(time) {
    this.sound.seek(time);
  }

  destroy() {
    this.sound.unload();
    this.events.removeAllListeners();
  }

}
