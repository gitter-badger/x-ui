/* eslint-disable no-param-reassign */
import {
  Component, h, Prop, Host, Element, State, Watch,
} from '@stencil/core';

import {
  debugIf,
  Route,
  RouterService,
  MatchResults,
  resolveNext,
  state,
  resolveElementVisibility,
  hasVisited,
  ActionBus,
  DATA_EVENTS,
  normalizeChildUrl,
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
  @Prop({ reflect: true, mutable: true }) url: string;

  @Watch('url')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validatePath(newValue: string, _oldValue: string) {
    const isBlank = typeof newValue !== 'string' || newValue === '';
    const has2chars = typeof newValue === 'string' && newValue.length >= 2;
    if (isBlank) { throw new Error('url: required'); }
    if (!has2chars) { throw new Error('url: too short'); }
  }

  private get parent(): HTMLXViewElement | HTMLXUiElement {
    const view = this.el.parentElement.closest('x-view') as HTMLXViewElement;
    if (view) {
      return view;
    }
    return this.el.parentElement.closest('x-ui') as HTMLXUiElement;
  }

  private get parentUrl() {
    return this.parent?.getAttribute('url') || this.parent?.getAttribute('root');
  }

  private get childViewDos(): Array<HTMLXViewDoElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes).filter((c) => c.nodeName === 'X-VIEW-DO')
      .map((v) => v as HTMLXViewDoElement);
  }

  componentWillLoad() {
    if (this.parentUrl && !this.url.startsWith(this.parentUrl)) {
      this.url = normalizeChildUrl(this.url, this.parentUrl);
    }
    debugIf(state.debug, `x-view: loading ${this.url}`);

    this.route = new Route(
      this.el,
      this.url,
      false,
      this.pageTitle,
      this.transition || this.parent?.transition,
      this.scrollTopOffset,
      (match) => {
        this.match = {...match};
      },
    );

    ActionBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveView();
    });
  }

  async componentDidLoad() {
    await this.route.loadCompleted();
  }

  async componentDidUpdate() {
    await this.route.loadCompleted();
  }

  async componentWillRender() {
    if (this.match) {
      await this.resolveView();
    }
  }

  private async resolveView() {
    if (this.match?.isExact) {
      const viewDos = this.childViewDos.map((viewDo) => {
        const { when, visit, url } = viewDo;
        const cleanUrl = normalizeChildUrl(url, this.url);
        const visited = hasVisited(cleanUrl);
        return { when, visit, visited, url: cleanUrl };
      });

      const nextDo = await resolveNext(viewDos);
      if (nextDo) {
        // eslint-disable-next-line no-console
        RouterService.instance?.history.push(nextDo.url, { parent: this.url });
      } else {
        resolveElementVisibility(this.el);
      }
    }
  }

  render() {
    if (this.url && this.match?.path) {
      const classes = `${this.route.transition} ${this.match?.isExact ? 'xui-active-route-exact' : 'xui-active-route'}`;
      return (
        <Host class={classes}>
          <slot/>
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
