/* eslint-disable */
import { createStore } from '@stencil/store';
import { OnChangeHandler } from '@stencil/store/dist/types';
import {  InterfaceProvider, InterfaceState } from '../interfaces';

export class DefaultInterfaceProvider implements InterfaceProvider {
  state: InterfaceState;
  onChange: OnChangeHandler<InterfaceState>;
  body: HTMLBodyElement;
  constructor(private win: Window = window) {

    const { state, onChange } = createStore<InterfaceState>({
      theme: win?.localStorage.getItem('theme') || null,
      muted: win?.localStorage.getItem('muted') === 'true',
      autoplay: win?.localStorage.getItem('autoplay') === 'true',
      hasAudio: false,
    });

    onChange('theme', (t) => win?.localStorage.setItem('theme', t.toString()));
    onChange('muted', (m) => win?.localStorage.setItem('muted', m.toString()));
    onChange('autoplay', (a) => win?.localStorage.setItem('autoplay', a.toString()));

    this.state = state;
    this.onChange = onChange;
    this.body = win?.document?.body as HTMLBodyElement;
  }

  async alert(message: string): Promise<void> {
    this.win.alert(message);
  }

  async openToast({message}): Promise<void> {
    this.win.alert(message);
  }

  async modalOpen({content}): Promise<void> {
    this.win.alert(content);
  }
  async modalClose({}): Promise<void> {
    // do nothing
  }

  async openPopover({content}): Promise<void> {
    this.win.alert(content);
  }

  async setTheme(theme: 'dark' | 'light'): Promise<void> {
    this.state.theme = theme;
  }

  async setAutoPlay(autoplay: boolean): Promise<void> {
    this.state.autoplay = autoplay;
  }

  async setSound(muted: boolean): Promise<void> {
    this.state.muted = muted;
  }

  async elementToggleClass({ selector, className }) {
    const element = this.body.querySelector(selector) as HTMLElement;
    element?.classList.toggle(className);
  }

  async elementAddClasses({ selector, classes }) {
    const element = this.body.querySelector(selector) as HTMLElement;
    classes?.split(' ').forEach((c: string) => {
      element?.classList.add(c);
    });
  }

  async elementRemoveClasses({ selector, classes }) {
    const element = this.body.querySelector(selector) as HTMLElement;
    classes?.split(' ').forEach((c: string) => {
      element?.classList.remove(c);
    });
  }

}
