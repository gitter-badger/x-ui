import { AudioRequest, AudioType, AUDIO_EVENTS, EventEmitter } from './../..';


export class AudioActionListener {
  timer: NodeJS.Timeout;


  constructor(
    public eventBus: EventEmitter,
    public actionBus: EventEmitter,
    public debug: boolean = false)
  {

    this.events = new EventEmitter();

    this.timer = setInterval(() => {
      this.events.emit(AUDIO_EVENTS.Loaded);
    }, 300);
  }

  // Public Members

  public isPlaying(): boolean {
    return true;
  }

  public hasAudio(): boolean {
    return true;
  }

  public events: EventEmitter;

  public pause() {

  }

  public resume() {
  }

  public mute(mute: boolean = false) {
  }

  public seek(type: AudioType, trackId: string, seek: number) {

  }

  public volume(request: AudioRequest) {
  }


  destroy() {
    clearInterval(this.timer);
  }
}
