import { Component, Element, h, Host, Prop } from '@stencil/core';
import {
  actionBus,
  AudioType,
  AUDIO_TOPIC,
  DiscardStrategy,
  LoadStrategy
} from '../..';

/**
 *
 * @system audio
 */
@Component({
  tag: 'x-audio-music-load',
  shadow: true,
})
export class XAudioMusicLoad {
  @Element() el: HTMLXAudioMusicLoadElement;

  /**
  * The path to the audio-file.
  * @required
  */
  @Prop() src!: string;

  /**
  * The identifier for this music track
  */
  @Prop() trackId: string;

  /**
  * This is the topic this action-command is targeting.
  */
  @Prop() mode: LoadStrategy = LoadStrategy.Queue;

  /**
  * The discard strategy the player should use for this file.
  */
  @Prop() discard: DiscardStrategy = DiscardStrategy.Route;



  /**
  * Set this to true to have the audio file loop.
  */
  @Prop() loop: boolean = false;

  /**
  * Set this attribute to have the audio file tracked
  * in session effectively preventing it from playing
  * again..
  */
  @Prop() track: boolean = false;

  private getAction() {
    return {
      topic: AUDIO_TOPIC,
      command: this.mode,
      data: {
        trackId: this.trackId || this.src,
        src: this.src,
        discard: this.discard,
        loop: this.loop,
        track: this.track,
        type: AudioType.Music,
        mode: this.mode,
      },
    };
  }

  componentDidLoad() {
    actionBus.emit(AUDIO_TOPIC, this.getAction());
  }


  render() {
    return (
      <Host hidden></Host>
    );
  }

}
