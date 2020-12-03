import { Component, h, State } from '@stencil/core';
// import { filter } from 'rxjs/operators'
import { state } from '../../services';
// import { navigation } from '@player/services'
import { warn } from '../../services/logging';

@Component({
  tag: 'x-audio-player',
  styleUrl: 'audio-player.css',
  shadow: true,
})
export class AudioPlayer {
  private stateSubscription: any;
  private actionSubscription: any;
  private player: HTMLAudioElement;
  private havePlayed: Array<string> = [];
  private queued: Array<{id: string, src: string}> = [];

  @State() currentTime = 0;

  @State() src: string;

  @State() currentState: any;

  componentWillLoad() {
    // this.stateSubscription = navigation.currentState$
    //   .pipe(filter(e => e != null))
    //   .subscribe(currentState => {
    //   this.currentState = currentState;
    //   if(currentState?.audio?.src != null
    //     && !this.queued.find(q => q.id == currentState.id)
    //     && !this.havePlayed.includes(currentState.id)) {
    //     this.queued  = [...this.queued, {
    //       id: currentState.id,
    //       src: currentState.audio.src
    //     }];
    //     if(this.src == undefined)
    //       this.playNext();
    //   }
    // });

    // this.stateSubscription = actionDispatcher.actions$
    //   .pipe(filter(e => e.eventName == 'dxp:audio'))
    //   .subscribe(a => {
    //     if(a.args.command == 'toggle'){
    //       if(this.src != null && state.hasAudio && this.player) {
    //         if(this.player.paused)
    //           this.player.play();
    //         else
    //           this.player.pause();
    //       } else this.playNext();
    //     }
    // });
  }

  private onTimeUpdate(event: CustomEvent<number>) {
    this.currentTime = event.detail;
  }

  private async onPlaybackReady() {
    try {
      state.hasAudio = true;
      await this.player.play();
    } catch (e) {
      warn(e);
    }
  }

  private onPlaybackEnded() {
    state.hasAudio = false;
    this.src = null;
    // this.currentState?.audio?.onEnd?.forEach(a => actionDispatcher.sendActionEvent(a));
    this.playNext();
  }

  public disconnectedCallback(): void {
    state.hasAudio = false;
    this.player?.pause();
    this.stateSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
  }

  private playNext() {
    const nextUp = this.queued.pop();
    if (nextUp != null) {
      state.hasAudio = true;
      this.src = nextUp.src;
      this.havePlayed.push(nextUp.id);
    }
  }

  render() {
    const { muted, autoplay } = state;
    return (
      this.src
        ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <audio
            id="global"
            class="fade-in"
            autoplay={autoplay}
            loop={this.currentState.audio?.loop || false}
            controls
            muted={muted}
            onTimeUpdate={this.onTimeUpdate.bind(this)}
            onCanPlay={this.onPlaybackReady.bind(this)}
            onEnded={this.onPlaybackEnded.bind(this)}
            src={this.src}
            // eslint-disable-next-line no-return-assign
            ref={(el) => this.player = el}>
          </audio>
        )
        : null
    );
  }
}
