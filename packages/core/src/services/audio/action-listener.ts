import { Howler } from 'howler';
import {
  EventAction,
  EventEmitter,
} from '../../services/actions';
import { debugIf } from '../logging';
import { ROUTE_EVENTS } from '../routing';
import { AudioTrack } from './audio';
import { AudioInfo } from './audio-info';
import { AudioRequest } from './audio-request';

import {
  AUDIO_TOPIC,
  AUDIO_COMMANDS,
  AUDIO_EVENTS,
  DiscardStrategy,
  AudioType,
  LoadStrategy
} from './interfaces';
import { hasPlayed } from './tracked';

export class AudioActionListener {
  private actionSubscription: () => void;
  private eventSubscription: () => void;
  public readonly onDeck: { [key: string]: AudioTrack | null };
  public readonly queued: { [key: string]: Array<AudioTrack> };
  public readonly loaded: { [key: string]: Array<AudioTrack> };

  constructor(
    private eventBus: EventEmitter,
    private actionBus: EventEmitter,
    private debug: boolean = false)
  {
    this.events = new EventEmitter();

    this.actionSubscription = this.actionBus.on(AUDIO_TOPIC, (ev: EventAction<any>) => {
      debugIf(this.debug, `audio-listener: event received ${ev.topic}:${ev.command}`);
      this.commandReceived(ev.command, ev.data);
    });

    this.eventSubscription = this.eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      debugIf(this.debug, `audio-listener: route changed received`);
      this.routeChanged();
    });

    this.onDeck = {
      [AudioType.Music]: null,
      [AudioType.Sound]: null,
    };

    this.queued = {
      [AudioType.Music]: [],
      [AudioType.Sound]: [],
    };

    this.loaded = {
      [AudioType.Music]: [],
      [AudioType.Sound]: [],
    };

  }

  // Public Members

  public isPlaying(): boolean {
    return !!this.onDeck[AudioType.Music]?.isPlaying
        || !!this.onDeck[AudioType.Sound]?.isPlaying;
  }

  public hasAudio(): boolean {
    return !!this.queued[AudioType.Music].length
        || !!this.queued[AudioType.Sound].length
        || !!this.loaded[AudioType.Music].length
        || !!this.loaded[AudioType.Sound].length;
  }

  public events: EventEmitter;

  public pause() {
    if (!this.isPlaying) return;

    this.onDeck[AudioType.Music]?.pause();
    this.onDeck[AudioType.Sound]?.pause();
  }

  public resume() {
    if (this.isPlaying) return;

    this.onDeck[AudioType.Music]?.resume();
    this.onDeck[AudioType.Sound]?.resume();
  }

  public mute(mute: boolean = false) {
    Howler.mute(mute);
  }

  public seek(type: AudioType, trackId: string, seek: number) {
    const current = this.onDeck[type];
    if (current && current.trackId == trackId) {
      current.seek(seek);
    }
  }

  public volume(request: AudioRequest) {
    Howler.volume(request.value);
  }

  // Private members

  private commandReceived(command: string, data: AudioInfo | AudioRequest) {
    switch (command) {
      case AUDIO_COMMANDS.Load: {
        const audio = this.createQueuedAudioFromTrack(data as AudioInfo);
        this.loadTrack(audio);
        break;
      }
      case AUDIO_COMMANDS.Play: {
        const audio = this.createQueuedAudioFromTrack(data as AudioInfo);
        this.replaceActiveTrack(audio);
        break;
      }
      case AUDIO_COMMANDS.Queue: {
        const audio = this.createQueuedAudioFromTrack(data as AudioInfo);
        this.addTrackToQueue(audio);
        break;
      }
      case AUDIO_COMMANDS.Start: {
        this.startLoadedTrack(data as AudioRequest);
        break;
      }
      case AUDIO_COMMANDS.Pause: {
        this.pause();
        break;
      }
      case AUDIO_COMMANDS.Resume: {
        this.resume();
        break;
      }
      case AUDIO_COMMANDS.Mute: {
        this.mute(!this.isPlaying);
        break;
      }
      case AUDIO_COMMANDS.Seek: {
        var request = data as AudioRequest;
        this.seek(request.type, request.trackId, request.value);
        break;
      }
      case AUDIO_COMMANDS.Volume: {
        this.volume(data as AudioRequest);
        break;
      }
    }
  }

  private createQueuedAudioFromTrack(data: AudioInfo) {
    const audio = new AudioTrack(data);

    audio.events.once(AUDIO_EVENTS.Ended, () => {
      this.soundEnded(audio);
    });

    audio.events.on('*', (...args) => {
      const [event,trackId] = args;
      if (event == 'undefined') console.dir(args)
      if (event) {
        debugIf(this.debug, `event-listener: audio event ${event} ${trackId}`)
        this.events.emit(event, ...args);
      }
    });

    return audio;
  }

  // Event Handlers

  private soundEnded(audio: AudioTrack) {
    const { type, discard, mode } = audio;
    if (mode == LoadStrategy.Load) return;

    if (discard == DiscardStrategy.None) {
      // if this track shouldn't be discarded, requeue it
      this.addTrackToQueue(audio);
    }

    if (mode == LoadStrategy.Queue) {
      this.playNextTrackFromQueue(type);
    }
  }

  private routeChanged() {
    // discard any route-based audio
    this.discardActive(AudioType.Sound, DiscardStrategy.Route);
    this.discardTracksFromQueue(AudioType.Sound, DiscardStrategy.Route);
    this.discardActive(AudioType.Music, DiscardStrategy.Route);
    this.discardTracksFromQueue(AudioType.Music, DiscardStrategy.Route);
  }

  // Queue Management

  private loadTrack(audio: AudioTrack) {
    const { type } = audio;
    if (!this.loaded[type].includes(audio)) {
      this.loaded[type].push(audio);
      this.events.emit(AUDIO_EVENTS.Loaded, audio.trackId);
    }
  }

  private addTrackToQueue(audio: AudioTrack) {
    const { type } = audio;
    if (!this.queued[type].includes(audio)) {
      this.queued[type].push(audio);
      this.events.emit(AUDIO_EVENTS.Queued, audio.trackId);
    }
    if (!this.onDeck[audio.type]) {
      this.playNextTrackFromQueue(audio.type);
    }
  }

  private getNextAudioFromQueue(type: AudioType) {
    const audio = this.queued[type].pop();
    if (audio) {
      this.events.emit(AUDIO_EVENTS.Dequeued, audio.trackId);
    }
    return audio;
  }

  private discardTracksFromQueue(type: AudioType, ...reasons: DiscardStrategy[]) {
    const eligibleAudio = (audio: AudioTrack) => !reasons.includes(audio.discard);
    this.queued[type] = this.queued[type].filter(eligibleAudio);
  }

  // AudioTrack workflow

  private startLoadedTrack(startRequest: AudioRequest) {
    const audio = this.loaded[startRequest.type]?.find(a => a.trackId == startRequest.trackId);
    if (audio) {
      this.replaceActiveTrack(audio);
      this.events.emit(AUDIO_EVENTS.Started, audio.trackId);
    }
  }

  private playNextTrackFromQueue(type: AudioType) {
    debugIf(this.debug, `event-listener: play next for ${type}`);
    const audio = this.getNextAudioFromQueue(type);
    if (!audio) return;
    if (audio.track && hasPlayed(audio.trackId)) {
      audio.destroy();
      this.playNextTrackFromQueue(audio.type);
    } else {
      this.replaceActiveTrack(audio);
    }
  }

  private replaceActiveTrack(nextUp: AudioTrack) {
    debugIf(this.debug, `event-listener: play now ${nextUp.trackId}`);
    this.discardActive(nextUp.type, DiscardStrategy.Next);
    this.onDeck[nextUp.type] = nextUp;
    this.playActiveTrack(nextUp.type)
  }

  private playActiveTrack(type:AudioType) {
    this.onDeck[type]?.start();
  }

  private discardActive(type: AudioType, reason: DiscardStrategy) {
    const audio = this.onDeck[type];
    if (audio && audio.discard == reason) {
      audio.stop();
      audio.destroy();
      this.onDeck[type] = null;
    }
  }

  destroy() {
    this.pause();
    this.eventSubscription();
    this.actionSubscription();
    this.events.removeAllListeners();
  }
}
