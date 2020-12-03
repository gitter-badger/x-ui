import { Component, h, Prop } from '@stencil/core';
import { popoverController } from '@ionic/core';
import { state } from '../../../..';

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

  componentWillLoad() {
    if (!state.theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      state.theme = prefersDark.matches ? 'dark' : 'light';
      document.body.classList.toggle('dark', prefersDark.matches);
    } else {
      document.body.classList.toggle('dark', state.theme === 'dark');
    }
  }

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
