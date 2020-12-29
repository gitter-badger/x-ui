import { Component, Host, h, State, Element, Prop } from '@stencil/core';
import { Howler } from 'howler';
import { AudioRequest, AUDIO_EVENTS, DiscardStrategy, LoadStrategy } from '../../services/audio/interfaces';
import {
  ActionBus,
  EventAction,
  interfaceState,
  RouterService,
  debugIf,
  AudioTrack,
  AUDIO_TOPIC,
  AUDIO_COMMANDS,
  QueuedAudio,
  AudioType,
}
from '../..';
import { audioState } from '../../services';
import { hasPlayed, trackPlayed } from '../../services/audio/tracked';


@Component({
  tag: 'x-audio-player',
  styleUrl: 'x-audio-player.scss',
  shadow: false,
})
export class AudioPlayer {
  private actionSubscription: () => void;

  @Element() el: HTMLXAudioPlayerElement

  @State() current: { [key:string ]: QueuedAudio } = {
    [AudioType.Music]: null,
    [AudioType.Sound]: null
  };

  @State() queue: { [key: string]: Array<QueuedAudio> } = {
    [AudioType.Music]: [],
    [AudioType.Sound]: []
  };

  @State() isPlaying: boolean;

  /**
   * The display mode for this player. The display
   * is merely a facade to manage basic controls.
   * No track information or duration will be displayed.
   */
  @Prop() displayMode: 'icon' | 'player' | 'none';

  /**
   *
   */
  @Prop() debug: boolean;

  componentWillLoad() {
    this.actionSubscription = ActionBus.on(AUDIO_TOPIC, (ev: EventAction<any>) => {
      debugIf(this.debug, `x-audio-player: event received ${ev.topic}:${ev.command}`);
      this.commandReceived(ev.command, ev.data);
    });

    RouterService.instance?.onChange(() => {
      debugIf(this.debug, `x-audio-player: route changed received`);
      this.routeChanged();
    });
  }

  private getQueuedAudio(data:AudioTrack) {
    const audio = new QueuedAudio(data);
    audio.events.once(AUDIO_EVENTS.Ended, () => this.soundEnded(audio.type));
    return audio;
  }

  private commandReceived(command:string, data: AudioTrack|AudioRequest) {
    switch (command) {
      case AUDIO_COMMANDS.Load: {
        const audio = this.getQueuedAudio(data as AudioTrack);
        this.addToQueue(audio.type, audio);
        break;
      }
      case AUDIO_COMMANDS.Play: {
        const audio = this.getQueuedAudio(data as AudioTrack);
        this.playNext(audio.type, audio);
        break;
      }
      case AUDIO_COMMANDS.Queue: {
        const audio = this.getQueuedAudio(data as AudioTrack);
        if (!this.current[audio.type]) {
          this.playNext(audio.type, audio);
        } else {
          this.addToQueue(audio.type, audio);
        }
        break;
      }
      case AUDIO_COMMANDS.Pause: {
        this.pause(data.type);
        break;
      }
      case AUDIO_COMMANDS.Resume: {
        this.resume(data.type);
        break;
      }
      case AUDIO_COMMANDS.Mute: {
        this.mute(data as AudioRequest);
        break;
      }
      case AUDIO_COMMANDS.Seek: {
        this.seek(data as AudioRequest);
        break;
      }
      case AUDIO_COMMANDS.Start: {
        this.start(data as AudioRequest);
        break;
      }
      case AUDIO_COMMANDS.Volume: {
        this.volume(data as AudioRequest);
        break;
      }
    }
  }

  private soundEnded(type:AudioType) {
    debugIf(this.debug, `${type} player ended`);
    audioState.hasAudio = false;
    this.playNext(type);
  }

  private addToQueue(type:AudioType, audio:QueuedAudio) {
    const queue = [...this.queue[type], audio];
    this.queue = {...this.queue, [type]: [...queue]};
  }

  private removeFromQueue(type:AudioType, audio:QueuedAudio) {
    const queue = [...this.queue[type]];
    const index = queue.indexOf(audio);
    if (index > -1) delete queue[index];
    this.queue = {...this.queue, [type]: queue.filter(x => !!x) };
  }

  private start(start: AudioRequest) {
    debugIf(this.debug, `start requested for ${start.trackId}`);
    const audio = this.queue[start.type]?.find(a => a.trackId == start.trackId);
    if (audio) {
      this.removeFromQueue(audio.type, audio);
      this.playNext(audio.type, audio);
    }
  }

  private playNext(type:AudioType, audio?: QueuedAudio) {
    debugIf(this.debug, `play next requested for ${type}`);
    const current = this.current[type];
    if (current) {
      current.stop();
      if (current.discard == DiscardStrategy.None) {
        current.load = LoadStrategy.Load;
        this.addToQueue(current.type, current);
      } else {
        current.destroy();
      }
    }

    const nextUp = audio || this.queue[type]?.find(a => a.load != LoadStrategy.Load);

    if (nextUp) {
      if (nextUp.track) {
        if (hasPlayed(nextUp.trackId)) {
          nextUp.destroy();
          this.playNext(type);
          return;
        }
        nextUp.events.once(AUDIO_EVENTS.Played, () => {
          trackPlayed(nextUp.trackId);
        });
      }
      this.current = {...this.current, [type]: nextUp };
      nextUp.start();
      audioState.hasAudio = true;


    }
  }

  private play(type:AudioType) {
    const current = this.current[type];
    if (current) {
      current.play();
    }
  }

  private pause(type:AudioType) {
    const current = this.current[type];
    if (current) {
      current.pause();
    }
  }

  private resume(type:AudioType) {
    const current = this.current[type];
    if (current) {
      current.play();
    }
  }

  private mute(request: AudioRequest) {
    Howler.mute(request.value);
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

    const eligibleAudio = (audio:QueuedAudio) => ['none','event'].includes(audio?.discard);
    const musicQueue = this.queue[AudioType.Music]?.filter(eligibleAudio) || [];
    const soundQueue = this.queue[AudioType.Sound]?.filter(eligibleAudio) || [];

    this.queue = {
      [AudioType.Music]: [...musicQueue],
      [AudioType.Sound]: [...soundQueue]
    }
  }

  private haltAudio(type: AudioType, reason: DiscardStrategy) {
    if (!this.current) return;

    const current = this.current[type];
    if (current && current.discard == reason) {
      current.stop();
      setTimeout(() => {
        current.destroy();
      },2000);
    }
  }

  public disconnectedCallback(): void {
    interfaceState.hasAudio = false;
    this.current = {};
    this.actionSubscription();
  }

  render() {
    const isPlaying = this.current[AudioType.Music]?.isPlaying || this.current[AudioType.Sound]?.isPlaying;
    return (
      <Host>
        { isPlaying
          ? <i onClick={() => this.pause(AudioType.Music)}class="ri-play-fill fs-2"></i>
          : <i onClick={() => this.play(AudioType.Music)} class="ri-play-line fs-2"></i>
        }
      </Host>
      );
  }

  /**
   * <audio
      id="ambient"
      class="fade-in"
      autoplay={autoplay}
      // loop={this.currentState.audio?.loop || false}
      controls
      muted={muted}
      onTimeUpdate={this.onTimeUpdate.bind(this)}
      onCanPlay={this.onPlaybackReady.bind(this)}
      onEnded={this.onPlaybackEnded.bind(this)}
    //   src={this.src}
      // eslint-disable-next-line no-return-assign
      ref={(el) => this.player = el}>
    </audio>,
    <audio
      id="voice"
      class="fade-in"
      autoplay={autoplay}
      // loop={this.currentState.audio?.loop || false}
      controls
      muted={muted}
      onTimeUpdate={this.onTimeUpdate.bind(this)}
      onCanPlay={this.onPlaybackReady.bind(this)}
      onEnded={this.onPlaybackEnded.bind(this)}
    //   src={this.src}
      // eslint-disable-next-line no-return-assign
      ref={(el) => this.player = el}>
    </audio>
   */
}
