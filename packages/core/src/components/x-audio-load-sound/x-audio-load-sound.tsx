import { Element, Prop, Method, Component, Host, h } from '@stencil/core';
import { ActionEvent, AudioTrack, AUDIO_TOPIC, DiscardStrategy, LoadStrategy } from '../..';

@Component({
  tag: 'x-audio-load-sound',
  shadow: true,
})
export class XAudioLoadSound {
  @Element() el: HTMLXAudioLoadSoundElement;
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
 * The path to the audio-file.
 * @required
 */
 @Prop() src!: string;


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
 async getAction(): Promise<ActionEvent<AudioTrack>> {
   return {
     topic: AUDIO_TOPIC,
     command: this.load,
     data: {
      trackId: this.trackId || this.src,
       src: this.src,
       discard: this.discard,
       loop: false,
       track: this.track,
       type: 'sound',
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
