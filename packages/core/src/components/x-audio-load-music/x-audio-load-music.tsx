import { Element, Prop, Method, Component, Host, h } from '@stencil/core';
import { EventAction, AudioTrack, DiscardStrategy, LoadStrategy, AUDIO_TOPIC } from '../..';
import { AudioType } from '../../services';

@Component({
  tag: 'x-audio-load-music',
  shadow: true,
})
export class XAudioLoadMusic {
  @Element() el: HTMLXAudioLoadMusicElement;

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
  @Prop() load: LoadStrategy = LoadStrategy.Queue;

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

  /**
  * Get the underlying actionEvent instance. Used by the x-action-activator element.
  */
  @Method()
  async getAction(): Promise<EventAction<AudioTrack>> {
    return {
      topic: AUDIO_TOPIC,
      command: this.load,
      data: {
        trackId: this.trackId || this.src,
        src: this.src,
        discard: this.discard,
        loop: this.loop,
        track: this.track,
        type: AudioType.Music,
        load: this.load,
      },
    };
  }


  render() {
    return (
      <Host hidden></Host>
    );
  }

}
