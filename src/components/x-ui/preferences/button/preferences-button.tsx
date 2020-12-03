import { Component, h, Prop } from '@stencil/core';
import { popoverController } from '@ionic/core';

@Component({
  tag: 'x-preferences',
  styleUrl: 'preferences.css',
  shadow: false,
})
export class PreferencesButton {
  /**
   *
   *
   */
  @Prop() icon: string = 'settings-outline';

  private async presentPopover(ev) {
    const popover = await popoverController.create({
      component: 'x-preferences-list',
      cssClass: 'popover',
      event: ev,
      translucent: false,
    });
    await popover.present();
  }

  render() {
    return (
      <ion-button onClick={(e) => this.presentPopover(e)}>
        <ion-icon name={this.icon}></ion-icon>
      </ion-button>
    );
  }
}
