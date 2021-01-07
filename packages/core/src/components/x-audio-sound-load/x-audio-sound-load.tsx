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
  tag: 'x-audio-sound-load',
  shadow: true,
})
export class XAudioSoundLoad {
  @Element() el: HTMLXAudioSoundLoadElement;

  /**
   * The path to the audio-file.
   */
  @Prop() src!: string;

  /**
   * The identifier for this music track
   */
  @Prop() trackId!: string;

   /**
   * This is the topic this action-command is targeting.
   */
  @Prop() mode: LoadStrategy;

   /**
   * The discard strategy the player should use for this file.
   */
  @Prop() discard: DiscardStrategy;


   /**
   * Set this attribute to have the audio file tracked
   * in session effectively preventing it from playing
   * again..
   */
  @Prop() track: boolean = false;

  private getAction() {
    return {
      topic: AUDIO_TOPIC,
      command: this.mode || LoadStrategy.Load,
      data: {
        trackId: this.trackId || this.src,
        src: this.src,
        discard: this.discard || DiscardStrategy.Route,
        loop: false,
        track: this.track,
        type: AudioType.Sound,
        mode: this.mode || LoadStrategy.Load,
      },
    };
  }

  componentDidLoad() {
    actionBus.emit(AUDIO_TOPIC, this.getAction());
  }

  render() {
    return <Host hidden></Host>;
  }
}
