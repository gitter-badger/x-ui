/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { Component, h, Prop, Host, Element, State, Watch } from '@stencil/core';
import { RouteService, RouterService, MatchResults, resolveNext} from '../..';

@Component({
  tag: 'x-view',
  styleUrl: 'x-view.scss',
  shadow: true,
})
export class XView {
  private route: RouteService;
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

  private get childViewDos() {
    return Array.from<HTMLXViewDoElement>(this.el.querySelectorAll('x-view-do'));
  }

  private get childViews() {
    return Array.from<HTMLXViewElement>(this.el.querySelectorAll('x-view'));
  }

  async componentDidUpdate() {
    await this.route.loadCompleted();
  }

  async componentDidLoad() {
    await this.route.loadCompleted();
  }

  async componentWillLoad() {
    this.route = new RouteService(
      this.el,
      '',
      this.url,
      false,
      this.pageTitle,
      this.transition || RouterService.instance.transition,
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
    });

    this.childViewDos.forEach((c) => {
      if (!c.url.startsWith(this.url)) {
        // eslint-disable-next-line @typescript-eslint/quotes
        c.url = `${this.url}/${c.url}`.replace(`//`, `/`);
      }
    });
  }

  async componentWillRender() {
    if (this.match?.isExact) {
      const nextDo = await resolveNext(this.childViewDos);
      if (nextDo) {
        // eslint-disable-next-line no-console
        RouterService.instance.history.replace(nextDo.url, { parent: this.url });
      }
    }
  }

  render() {
    if (this.match?.path) {
      const classes = `active-route ${this.transition || RouterService.instance.transition || ''}`;
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
