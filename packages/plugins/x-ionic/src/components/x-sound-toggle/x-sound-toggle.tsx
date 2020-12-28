import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'x-sound-toggle',
  styleUrl: 'x-sound-toggle.scss',
  shadow: false,
})
export class ThemeToggle {
  /**
   *
   */
  @Prop() muted: boolean;

  componentDidLoad() {
    // this.muted = state.muted;
  }

  private toggleSound(_muted: boolean) {
    // state.muted = muted;
  }

  render() {
    return (
      <Host>
        <ion-buttons collapse slot="end">
          <ion-icon name="volume-mute-outline"></ion-icon>
          <ion-toggle
            checked={!this.muted}
            onIonChange={(e) => this.toggleSound(e.detail.checked)}>
          </ion-toggle>
          <ion-icon name="volume-medium-outline"></ion-icon>
        </ion-buttons>
      </Host>
    );
  }
}
