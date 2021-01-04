import { h, Component, Element, Host, Prop, State, Watch, writeTask } from '@stencil/core';
import '../x-view-do/x-view-do';
import {
  eventBus,
  DATA_EVENTS,
  debugIf,
  hasVisited,
  markVisit,
  resolveElementVisibility,
  resolveNext,
  Route,
  RouterService,
  warn,
  wrapFragment,
} from '../..';

/**
 *  @system routing
 */
@Component({
  tag: 'x-view',
  styleUrl: 'x-view.scss',
  shadow: true,
})
export class XView {
  private route: Route;
  @Element() el!: HTMLXViewElement;
  @State() match: boolean;
  @State() exact: boolean;

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
  */
  @Prop() url!: string;

  @Watch('url')
  validatePath(newValue: string, _oldValue: string) {
    const isBlank = typeof newValue !== 'string' || newValue === '';
    const has2chars = typeof newValue === 'string' && newValue.length >= 2;
    if (isBlank) { throw new Error('url: required'); }
    if (!has2chars) { throw new Error('url: too short'); }
  }

  /**
   * Remote URL for this Route's content.
   */
  @Prop() contentSrc: string;

  /**
  * Turn on debug statements for load, update and render events.
  */
  @Prop() debug: boolean = false;

  private get parent(): HTMLXViewElement | HTMLXUiElement {
    const view = this.el.parentElement?.closest('x-view') as HTMLXViewElement;
    if (view) {
      return view;
    }
    return this.el.parentElement?.closest('x-ui') as HTMLXUiElement;
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
    this.childViews.forEach(v => {
      v.url = RouterService.instance?.normalizeChildUrl(v.url, this.url);
      v.transition = v.transition || this.transition || this.parent?.transition;
    });

    this.childViewDos.forEach(v => {
      v.url = RouterService.instance?.normalizeChildUrl(v.url, this.url);
      v.transition = v.transition || this.transition || this.parent?.transition;
    });

    debugIf(this.debug, `x-view: ${this.url} loading`);

    this.route = new Route(
      RouterService.instance,
      this.el,
      this.url,
      false,
      this.pageTitle,
      this.transition || this.parent?.transition,
      this.scrollTopOffset,
      async (match) => {
        this.match = !!match;
        this.exact = match?.isExact;
        await this.resolveView();
        if (this.exact) {
          markVisit(match.url);
          writeTask(() => resolveElementVisibility(this.el));
        }
      }
    );

    eventBus.on(DATA_EVENTS.DataChanged, async () => {
      debugIf(this.debug, `x-view: ${this.url} data changed `);
      await this.resolveView();
      writeTask(() => resolveElementVisibility(this.el));
    });
  }

  componentDidRender() {
    debugIf(this.debug, `x-view: ${this.url} did render`);
    writeTask(() => resolveElementVisibility(this.el));
  }

  private async fetchHtml() {
    if (!this.contentSrc) return;
    try {
      debugIf(this.debug, `x-view: ${this.url} fetching content from ${this.contentSrc}`);
      const response = await fetch(this.contentSrc);
      if (response.status === 200) {
        const data = await response.text();
        this.el.appendChild(wrapFragment(data,'content','content'));
      } else {
        warn(`x-view: ${this.url} Unable to retrieve from ${this.contentSrc}`);
      }
    } catch (error) {
      warn(`x-view: ${this.url} Unable to retrieve from ${this.contentSrc}`);
    }
  }

  private async resolveView() {
    debugIf(this.debug, `x-view: ${this.url} resolve view called`);
    this.el.classList.remove('active-route');
    this.el.classList.remove('active-route-exact');
    this.el.querySelector('#content')?.remove();
    if (this.match) {
      this.el.classList.add('active-route');
      if (this.exact) {
        debugIf(this.debug, `x-view: ${this.url} route is matched `);

        const viewDos = this.childViewDos.map((viewDo) => {
          const { when, visit, url } = viewDo;
          const visited = hasVisited(url);
          return { when, visit, visited, url };
        });

        const nextDo = await resolveNext(viewDos);
        if (nextDo) {
          // eslint-disable-next-line no-console
          RouterService.instance?.history.push(nextDo.url);
        } else {
          await this.fetchHtml();
          this.el.classList.add('active-route-exact');

          await this.route.loadCompleted();
        }
      }
    }
  }

  render() {
    debugIf(this.debug, `x-view: ${this.url} render`);
    return (
      <Host class={this.route?.transition}>
        <slot />
        <slot name="content" />
      </Host>
    );
  }

}
