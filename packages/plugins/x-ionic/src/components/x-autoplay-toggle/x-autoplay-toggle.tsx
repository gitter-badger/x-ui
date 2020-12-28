import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'x-autoplay-toggle',
  styleUrl: 'x-autoplay-toggle.scss',
  shadow: true,
})
export class AutoplayToggle {
  /**
   *
   */
  @Prop() autoplay: boolean;

  componentWillLoad() {
    // this.autoplay = state.autoplay;
    // // eslint-disable-next-line no-return-assign
    // onChange('autoplay', (m) => this.autoplay = m);
  }

  private toggleAutoplay(_autoplay: boolean) {
    // state.autoplay = autoplay;
  }

  render() {
    // checked={state.autoplay}
    return (
      <Host>
        <ion-buttons collapse slot="end">
          <ion-icon name="videocam-off-outline"></ion-icon>
          <ion-toggle
            onIonChange={(e) => this.toggleAutoplay(e.detail.checked)}>
          </ion-toggle>
          <ion-icon name="videocam-outline"></ion-icon>
        </ion-buttons>
      </Host>
    );
  }
}
