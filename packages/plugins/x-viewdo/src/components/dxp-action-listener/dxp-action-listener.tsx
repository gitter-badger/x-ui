import { Component, Host, h, Prop, Event, Listen } from '@stencil/core';
import { Experience } from 'models';
import { onChange, state } from 'services';

@Component({
  tag: 'dxp-action-listener',
  shadow: true,
})
export class DxpActionListener {

  experience: Experience;

  componentWillLoad() {
    if(state.experience){
      this.experience = state.experience;
    } else {
      onChange('experience', e => {
        this.experience = e;
      });
    }
  }

  @Listen('viewdo-action')
  @Listen('change')
  async onActivation() {
    if(this.experience == null) return;
    if(!this.experience.story.events.includes(this.storyEvent)) {
      logger.warn(`dxp-set-event: event ${this.storyEvent} does not exist on this story.`);
      return;
    }
    await this?.experience.recordEvent(this.storyEvent);
  }

  render() {
    return (<slot></slot>);
  }
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
