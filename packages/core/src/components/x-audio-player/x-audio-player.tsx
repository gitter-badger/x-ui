import { Component, Host, h, State } from '@stencil/core';
// import {Howl, Howler} from 'howler';
import {
  ActionBus,
  interfaceState,
  RouterService }
from '../..';


@Component({
  tag: 'x-audio-player',
  styleUrl: 'x-audio-player.scss',
  shadow: true,
})
export class AudioPlayer {
  private actionSubscription: any;
  private player: HTMLAudioElement;

  @State() currentTime = 0;
  @State() currentAmbientTrack: string;
  @State() currentVoiceTrack: string;

  componentWillLoad() {
    this.actionSubscription = ActionBus.on('audio', (..._args) => {

    });
    RouterService.instance?.onChange(() => {

    });
  }

  // private onTimeUpdate(event: CustomEvent<number>) {
  //   this.currentTime = event.detail;
  // }

  // private async onPlaybackReady() {
  //   try {
  //     await this.player.play();
  //   } catch (e) {
  //     warn(e);
  //   }
  // }

  // private onPlaybackEnded() {
  //   state.hasAudio = false;
  //  // this.src = null;
  //   // this.currentState?.audio?.onEnd?.forEach(a => actionDispatcher.sendActionEvent(a));
  //   this.playNext();
  // }

  public disconnectedCallback(): void {
    interfaceState.hasAudio = false;
    this.player?.pause();
    this.actionSubscription.unsubscribe();
  }

  // private playNext() {
  // const nextUp = this.queued.pop();
  // if (nextUp != null) {
  //   state.hasAudio = true;
  //   this.src = nextUp.src;
  //   this.havePlayed.push(nextUp.id);
  // }
  // }

  render() {
    return (<Host></Host> );
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
