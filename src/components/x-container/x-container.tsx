import {
  Component, h, Host, Event, EventEmitter,
  Element, Prop, ComponentInterface,
  State, writeTask
} from '@stencil/core';
import { HistoryType, LocationSegments } from "../../services/routing/types";
import { RouterService } from '../../services/router.service';
import { state, onChange } from '../../services';
/**
 * The base container for the Experience UI. This component is required for
 * content-routing. All HTML is allowed.
 *
 * Add x-view components to add add additional views accessible by URL.
 *
 * @export
 * @class XContainer
 * @implements {ComponentInterface}
 */
@Component({
  tag: 'x-container',
  styleUrl: 'x-container.scss',
  shadow: true,
})
export class XContainer implements ComponentInterface {
  @Element() el!: any;
  /**
   *
   *
   * @type {string}
   * @memberof XContainer
   */
  @Prop() root: string = '/';

  /**
   *
   *
   * @type {HistoryType}
   * @memberof XContainer
   */
  @Prop() historyType: HistoryType = 'browser';

  @Prop() scrollTopOffset?: number;

  @Prop() transition = 'fade-in';

  @Prop() titleSuffix: string;

  @Prop() startUrl: string = '/';

  @Prop() audio: boolean;



  @Event({
    eventName: 'xui:theme-changed'
  }) onThemeChanged: EventEmitter;

  @State() location: LocationSegments;

  connectedCallback() {

  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
    this.onThemeChanged.emit({
      dark: shouldAdd
    });
  }

  componentWillLoad() {

    if (!state.theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.toggleDarkTheme(prefersDark.matches);
      prefersDark?.addEventListener("change", (ev) => this.toggleDarkTheme(ev.matches));
      state.theme =  prefersDark.matches ? 'dark' : 'light';
    } else {
      this.toggleDarkTheme(state.theme == 'dark');
    }

    onChange('theme', theme => {
      this.toggleDarkTheme(theme == 'dark');
    });

    state.router = new RouterService(
      writeTask,
      this.el,
      this.historyType,
      this.root,
      this.titleSuffix,
      this.transition,
      this.scrollTopOffset
    );

    state.router.onRouteChange(() => {
      this.location = state.router.location;
    });
    this.location = state.router.location;

    if(this.startUrl && state.router.location.pathname == "/") {
      state.router.history.push(this.startUrl);
    }
  }


  render() {
    if(!this.location) return null;

    return (
        <Host>
          {this.audio ? <x-audio-player></x-audio-player> : null}
          <slot></slot>
        </Host>
      );
  }
}
