import { Component, Host, h, State, Element, Prop } from '@stencil/core';
import { Howler } from 'howler';
import {
  actionBus,
  EventAction,
  interfaceState,
  debugIf,
  AudioTrack,
  AUDIO_TOPIC,
  AUDIO_COMMANDS,
  QueuedAudio,
  AudioType,
  hasPlayed,
  trackPlayed,
  AudioRequest,
  AUDIO_EVENTS,
  DiscardStrategy,
  LoadStrategy,
  ROUTE_EVENTS,
  eventBus,
} from '../..';
import { audioState, warn } from '../../services';

/**
 *
 * @system audio
 */
@Component({
  tag: 'x-audio-player',
  styleUrl: 'x-audio-player.scss',
  shadow: true,
})
export class AudioPlayer {
  @Element() el: HTMLXAudioPlayerElement;

  @State() current: { [key: string]: QueuedAudio } = {
    [AudioType.Music]: null,
    [AudioType.Sound]: null,
  };

  @State() queue: { [key: string]: Array<QueuedAudio> } = {
    [AudioType.Music]: [],
    [AudioType.Sound]: [],
  };

  private get hasAudio(): boolean {
    return this.queue[AudioType.Music].length > 0 || this.queue[AudioType.Sound].length > 0;
  }

  @State() isPlaying: boolean;

  @State() muted: boolean = interfaceState.muted;

  /**
   * The display mode for this player. The display
   * is merely a facade to manage basic controls.
   * No track information or duration will be displayed.
   */
  @Prop() display: boolean;

  /**
   *
   */
  @Prop() debug: boolean;

  componentWillLoad() {
    if (audioState.hasAudio) {
      warn('x-audio-player: duplicate players have no effect');
      return;
    }

    actionBus.on(AUDIO_TOPIC, (ev: EventAction<any>) => {
      debugIf(this.debug, `x-audio-player: event received ${ev.topic}:${ev.command}`);
      this.commandReceived(ev.command, ev.data);
    });

    eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      debugIf(this.debug, `x-audio-player: route changed received`);
      this.routeChanged();
    });

    audioState.hasAudio = true;
  }

  private getQueuedAudio(data: AudioTrack) {
    const audio = new QueuedAudio(data);
    audio.events.once(AUDIO_EVENTS.Ended, () => this.soundEnded(audio.type));
    return audio;
  }

  private commandReceived(command: string, data: AudioTrack | AudioRequest) {
    switch (command) {
      case AUDIO_COMMANDS.Load: {
        const audio = this.getQueuedAudio(data as AudioTrack);
        this.addToQueue(audio.type, audio);
        eventBus.emit(AUDIO_EVENTS.Loaded);
        break;
      }
      case AUDIO_COMMANDS.Play: {
        const audio = this.getQueuedAudio(data as AudioTrack);
        this.playNext(audio.type, audio);
        break;
      }
      case AUDIO_COMMANDS.Queue: {
        const audio = this.getQueuedAudio(data as AudioTrack);
        this.addToQueue(audio.type, audio);
        eventBus.emit(AUDIO_EVENTS.Queued);
        if (!this.current[audio.type]) {
          this.playNext(audio.type, audio);
        }
        break;
      }
      case AUDIO_COMMANDS.Pause: {
        this.pause();
        eventBus.emit(AUDIO_EVENTS.Paused);
        break;
      }
      case AUDIO_COMMANDS.Resume: {
        this.resume();
        eventBus.emit(AUDIO_EVENTS.Resumed);
        break;
      }
      case AUDIO_COMMANDS.Mute: {
        this.mute(data as AudioRequest);
        eventBus.emit(AUDIO_EVENTS.Muted);
        break;
      }
      case AUDIO_COMMANDS.Seek: {
        this.seek(data as AudioRequest);
        break;
      }
      case AUDIO_COMMANDS.Start: {
        this.start(data as AudioRequest);
        eventBus.emit(AUDIO_EVENTS.Started);
        break;
      }
      case AUDIO_COMMANDS.Volume: {
        this.volume(data as AudioRequest);
        break;
      }
    }
  }

  private soundEnded(type: AudioType) {
    this.isPlaying = false;
    debugIf(this.debug, `${type} player ended`);
    this.playNext(type);
  }

  private addToQueue(type: AudioType, audio: QueuedAudio) {
    debugIf(this.debug, `queued`);
    if (this.queue[type].includes(audio)) return;

    const queue = [...this.queue[type], audio];
    this.queue = { ...this.queue, [type]: [...queue] };
  }

  private removeFromQueue(type: AudioType, audio: QueuedAudio) {
    debugIf(this.debug, `dequeued`);
    const queue = [...this.queue[type]];
    const index = queue.indexOf(audio);
    if (index > -1) delete queue[index];
    this.queue = { ...this.queue, [type]: queue.filter(x => !!x) };
    audio?.destroy();
  }

  private discardFromQueue(type: AudioType, ...reasons: DiscardStrategy[]) {
    const eligibleAudio = (audio: QueuedAudio) => !reasons.includes(audio.discard);
    const queue = this.queue[type]?.filter(eligibleAudio) || [];
    this.queue = { ...this.queue, [type]: queue };
  }

  private start(start: AudioRequest) {
    debugIf(this.debug, `start requested for ${start.trackId}`);
    const audio = this.queue[start.type]?.find(a => a.trackId == start.trackId);
    if (audio) {
      this.playNext(audio.type, audio);
    }
  }

  private playNext(type: AudioType, audio?: QueuedAudio) {
    debugIf(this.debug, `play next for ${type}`);
    const current = this.current[type];
    if (current) {
      this.haltAudio(type, DiscardStrategy.Next);
    }

    const nextUp = audio || this.queue[type]?.find(a => a.mode == LoadStrategy.Queue);

    if (nextUp) {
      if (nextUp.track) {
        if (hasPlayed(nextUp.trackId)) {
          this.removeFromQueue(audio.type, audio);
          nextUp.destroy();
          this.playNext(type);
          return;
        }
        nextUp.events.once(AUDIO_EVENTS.Played, () => {
          trackPlayed(nextUp.trackId);
          eventBus.emit(AUDIO_EVENTS.Played);
        });
      }
      this.current = { ...this.current, [type]: nextUp };
      nextUp.start();
      this.isPlaying = true;
    }
  }

  private pause() {
    debugIf(this.debug, `paused`);
    this.current[AudioType.Music]?.pause();
    this.current[AudioType.Sound]?.pause();
    this.isPlaying = false;
  }

  private resume() {
    debugIf(this.debug, `resumed`);
    this.current[AudioType.Music]?.resume();
    this.current[AudioType.Sound]?.resume();
    this.isPlaying = this.current[AudioType.Music]?.isPlaying || this.current[AudioType.Sound]?.isPlaying;
  }

  private mute(request: AudioRequest) {
    Howler.mute(request.value);
    this.isPlaying = !request.value;
  }

  private seek(seek: AudioRequest) {
    const current = this.current[seek.type];
    if (current && current.trackId == seek.trackId) {
      current.seek(seek.value);
    }
  }

  private volume(request: AudioRequest) {
    Howler.volume(request.value);
  }

  private routeChanged() {
    this.haltAudio(AudioType.Sound, DiscardStrategy.Route);
    this.haltAudio(AudioType.Music, DiscardStrategy.Route);
    this.discardFromQueue(AudioType.Sound, DiscardStrategy.Route);
    this.discardFromQueue(AudioType.Music, DiscardStrategy.Route);
  }

  private haltAudio(type: AudioType, ...reasons: DiscardStrategy[]) {
    if (!this.current) return;
    const current = this.current[type];
    if (current) {
      current.stop();
      this.current = { ...this.current, [type]: null };
      if (reasons.includes(current.discard)) {
        this.removeFromQueue(type, current);
        current.destroy();
      }
    }
  }

  public disconnectedCallback(): void {
    interfaceState.hasAudio = false;
    this.haltAudio(AudioType.Sound, DiscardStrategy.Route, DiscardStrategy.Next, DiscardStrategy.None);
    this.haltAudio(AudioType.Music, DiscardStrategy.Route, DiscardStrategy.Next, DiscardStrategy.None);
    this.discardFromQueue(AudioType.Sound, DiscardStrategy.Route, DiscardStrategy.Next, DiscardStrategy.None);
    this.discardFromQueue(AudioType.Music, DiscardStrategy.Route, DiscardStrategy.Next, DiscardStrategy.None);
    this.current = {};
  }

  render() {
    return (
      <Host hidden={this.display}>
        {this.hasAudio ? this.isPlaying
        ? <i onClick={() => this.pause()} class="ri-pause-fill fs-2"></i>
        : <i onClick={() => this.resume()} class="ri-play-line fs-2"></i> : null}
      </Host>
    );
  }
}
