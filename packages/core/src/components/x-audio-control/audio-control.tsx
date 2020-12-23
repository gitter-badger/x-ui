import { Component, h, State } from '@stencil/core';
import { onChange, state } from '../..';

@Component({
  tag: 'x-audio-control',
  styleUrl: 'audio-control.scss',
  shadow: true,
})
export class AudioControl {
  @State() hasAudio: boolean = state.hasAudio;

  componentDidLoad() {
    onChange('hasAudio', (hasAudio) => {
      this.hasAudio = hasAudio;
    });
  }

  private toggleAudio() {
    // actionDispatcher.sendActionEvent({
    //   eventName: 'dxp:audio',
    //   args: {
    //     command: 'toggle'
    //   }
    // })
  }

  render() {
    return (
      this.hasAudio
        ? (
          <div
            class="typing-indicator"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onClick={(_) => this.toggleAudio()}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )
        : null
    );
  }
}
