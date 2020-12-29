import { Howl } from 'howler';
import { AudioTrack, AUDIO_EVENTS } from './interfaces';
import { debug, EventEmitter } from '../..';


export class QueuedAudio extends AudioTrack {
  private howl: Howl;
  events: EventEmitter;
  previousVolume: number;

  constructor(track: AudioTrack) {
    super();
    this.events = new EventEmitter();
    Object.assign(this, track);
    debug(`Loading howl: ${track.src}`)
    this.howl = new Howl({
      src: this.src,
      html5: true,
      onend: () => this.events.emit(AUDIO_EVENTS.Ended)
    });
    this.previousVolume = this.howl.volume();
    this.howl.once('load', () => {
      this.events.emit(AUDIO_EVENTS.Loaded);
    });
  }

  get state() {
    return this.howl.state();
  }

  get isPlaying() {
    return this.howl.playing();
  }

  play() {
    this.howl.volume(0);
    this.howl.play();
    this.howl.fade(0, this.previousVolume, 2);
    this.events.emit(AUDIO_EVENTS.Played);
  }

  stop() {
    this.howl.fade(this.previousVolume, 0, 2);
    this.howl.stop();
    this.events.emit(AUDIO_EVENTS.Stopped)
  }

  pause() {
    this.howl.pause();
    this.events.emit(AUDIO_EVENTS.Paused);
  }

  resume() {
    this.howl.play();
    this.events.emit(AUDIO_EVENTS.Played);
  }

  start() {
    if (this.state == 'loaded') {
      this.play();
    } else if (this.state == 'loading') {
      this.events.once(AUDIO_EVENTS.Loaded, () => this.play())
    }
  }

  seek(time) {
    this.howl.seek(time);
  }

  destroy() {
    this.howl.unload();
    this.events.removeAllListeners();
  }

}
