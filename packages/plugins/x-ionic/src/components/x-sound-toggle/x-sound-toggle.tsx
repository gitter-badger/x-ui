import { Component, Host, h, Prop } from '@stencil/core';
import { state } from '../../../../../dist';

@Component({
  tag: 'x-sound-toggle',
  styleUrl: 'sound-toggle.css',
  shadow: false,
})
export class ThemeToggle {
  /**
   *
   */
  @Prop() muted: boolean = state.muted;

  componentDidLoad() {
    this.muted = state.muted;
  }

  private toggleSound(muted: boolean) {
    state.muted = muted;
  }

  render() {
    return (
      <Host>
        <ion-buttons collapse slot="end">
          <ion-icon name="volume-mute-outline"></ion-icon>
          <ion-toggle
            checked={!state.muted}
            onIonChange={(e) => this.toggleSound(e.detail.checked)}>
          </ion-toggle>
          <ion-icon name="volume-medium-outline"></ion-icon>
        </ion-buttons>
      </Host>
    );
  }
}
