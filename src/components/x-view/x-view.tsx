/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { Component, h, Prop, Host, Element, State, Watch } from '@stencil/core';
import { hasVisited } from '../../services/visits';
import {
  debugIf,
  Route,
  RouterService,
  MatchResults,
  resolveNext,
  state,
} from '../..';

@Component({
  tag: 'x-view',
  styleUrl: 'x-view.scss',
  shadow: true,
})
export class XView {
  private route: Route;
  @Element() el!: HTMLXViewElement;
  @State() match: MatchResults;

  /**
   * The title for this view. This is prefixed
   * before the app title configured in x-ui
   *
  */
  @Prop() pageTitle: string = '';

  /**
   * Header height or offset for scroll-top on this
   * view.
  */
  @Prop() scrollTopOffset?: number;

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string;

  /**
   * The url for this route, including the parent's
   * routes.
   *
  */
  @Prop() url!: string;
  @Watch('url')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validatePath(newValue: string, _oldValue: string) {
    const isBlank = typeof newValue !== 'string' || newValue === '';
    const has2chars = typeof newValue === 'string' && newValue.length >= 2;
    if (isBlank) { throw new Error('url: required'); }
    if (!has2chars) { throw new Error('url: too short'); }
  }

  private get parent(): HTMLXViewElement | HTMLXUiElement {
    return this.el.parentElement as HTMLXViewElement | HTMLXUiElement;
  }

  private get childViewDos(): Array<HTMLXViewDoElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes).filter((c) => c.nodeName === 'X-VIEW-DO')
      .map((v) => v as HTMLXViewDoElement);
  }

  private get childViews(): Array<HTMLXViewElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes).filter((c) => c.nodeName === 'X-VIEW')
      .map((v) => v as HTMLXViewElement);
  }

  componentWillLoad() {
    debugIf(state.debug, `x-view: loading ${this.url}`);
    if (this.transition === undefined) {
      this.transition = this.parent.transition;
    }

    this.route = new Route(
      this.el,
      this.url,
      false,
      this.pageTitle,
      this.transition,
      this.scrollTopOffset,
      (match) => {
        this.match = {...match};
      },
    );

    this.childViews.forEach((c) => {
      if (!c.url.startsWith(this.url)) {
        // eslint-disable-next-line @typescript-eslint/quotes
        c.url = `${this.url}/${c.url}`.replace(`//`, `/`);
      }
      debugIf(state.debug, `x-view: registered x-view ${c.url}`);
    });

    this.childViewDos.forEach((c) => {
      if (!c.url.startsWith(this.url)) {
        // eslint-disable-next-line @typescript-eslint/quotes
        c.url = `${this.url}/${c.url}`.replace(`//`, `/`);
      }
      debugIf(state.debug, `x-view: registered x-view-do ${c.url}`);
    });
  }

  async componentDidUpdate() {
    await this.performViewUpdate();
  }

  async componentDidLoad() {
    debugIf(state.debug, `x-view: loaded ${this.url}`);
    await this.performViewUpdate();
  }

  async componentWillRender() {
    await this.performViewUpdate();
  }

  private async performViewUpdate() {
    await this.route.loadCompleted();
    if (this.match?.isExact) {
      const nextDo = await resolveNext(this.childViewDos.map((x) => {
        const { when, visit, url} = x;
        const visited = hasVisited(url);
        return { when, visit, visited, url};
      }));
      if (nextDo) {
        // eslint-disable-next-line no-console
        RouterService.instance?.history.push(nextDo.url, { parent: this.url });
      }
    }
  }

  render() {
    if (this.match?.path || (this.url === '*' && !RouterService.instance.hasMatch)) {
      const classes = `${this.transition} ${this.match?.isExact ? 'xui-active-route-exact' : 'xui-active-route'}`;
      return (
        <Host class={classes}>
          <slot></slot>
        </Host>
      );
    }

    return (
      <Host hidden>
        <slot/>
      </Host>
    );
  }
}
