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
    });

    onChange('theme', (t) => win?.localStorage.setItem('theme', t.toString()));
    onChange('muted', (m) => win?.localStorage.setItem('muted', m.toString()));
    onChange('autoplay', (a) => win?.localStorage.setItem('autoplay', a.toString()));

    this.state = state;
    this.onChange = onChange;
    this.body = this.win?.document?.body as HTMLBodyElement;
  }

  async setTheme(theme: 'dark' | 'light'): Promise<void> {
    this.state.theme = theme;
  }

  async setAutoPlay(autoplay: boolean): Promise<void> {
    this.state.autoplay = autoplay;
  }

  async setMute(muted: boolean): Promise<void> {
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

  async elementSetAttribute({ selector, attribute, value }) {
    const element = this.body.querySelector(selector) as HTMLElement;
    element?.setAttribute(attribute, value);
  }

  async elementRemoveAttribute({ selector, attribute }) {
    const element = this.body.querySelector(selector) as HTMLElement;
    element?.removeAttribute(attribute);
  }

  async elementCallMethod({ selector, method, args }) {
    const element = this.body.querySelector(selector) as HTMLElement;
    if (element) {
      const elementMethod = element[method];
      if (elementMethod && typeof element === 'function') {
        await elementMethod(args);
      }
    }
  }

}
