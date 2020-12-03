import { Component, Host, h } from '@stencil/core';
import { state } from '../../../..';

@Component({
  tag: 'x-theme-toggle',
  styleUrl: 'theme-toggle.css',
  shadow: false,
})
export class ThemeToggle {
  componentWillLoad() {
    if (!state.theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.toggleDarkTheme(prefersDark.matches);
      prefersDark.addEventListener('change', (ev) => this.toggleDarkTheme(ev.matches));
      state.theme = prefersDark.matches ? 'dark' : 'light';
    } else {
      this.toggleDarkTheme(state.theme === 'dark');
    }
  }

  private toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
    state.theme = shouldAdd ? 'dark' : 'light';
  }

  render() {
    return (
      <Host>
        <ion-buttons collapse slot="end">
          <ion-icon name="sunny"></ion-icon>
          <ion-toggle
            checked={state.theme === 'dark'}
            onIonChange={(e) => this.toggleDarkTheme(e.detail.checked)}>
          </ion-toggle>
          <ion-icon name="moon"></ion-icon>
        </ion-buttons>
      </Host>
    );
  }
}
