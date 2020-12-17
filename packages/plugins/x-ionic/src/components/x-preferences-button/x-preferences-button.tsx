import { Component, h, Prop, Host, Element } from '@stencil/core';
import { popoverController, toastController } from '@ionic/core';
import { state } from '@viewdo/ui';

@Component({
  tag: 'x-preferences-popover-button',
  styleUrl: 'x-preferences-popover.css',
  shadow: false,
})
export class PreferencesButton {
  @Element() el: HTMLXPreferencesPopoverButtonElement;
  private popover: HTMLIonPopoverElement;
  /**
   *
   *
   */
  @Prop() icon: string = 'settings-outline';

  componentWillLoad() {
    if (!state.theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      document.body.classList.toggle('dark', prefersDark.matches);
      this.presentToast('Dark mode preference was detected. Use the preferences icon to change modes.');
    } else {
      document.body.classList.toggle('dark', state.theme === 'dark');
    }
  }

  private async presentToast(message) {
    const toast = await toastController.create({
      message,
      duration: 3000,
      position: 'middle',

    });
    toast.present();
  }

  private async presentPopover(ev: Event, component: string) {
    this.popover = await popoverController.create({
      component,
      cssClass: 'popover',
      event: ev,
      translucent: true,
    });
    await this.popover.present();
  }

  render() {
    return (
      <Host>
        <ion-button
          onClick={(e) => this.presentPopover(e, 'x-preferences-list')}>
          <ion-icon name={this.icon}></ion-icon>
        </ion-button>
      </Host>
    );
  }
}
