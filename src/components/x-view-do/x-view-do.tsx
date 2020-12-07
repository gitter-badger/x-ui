import { Component, h, Prop, Element, State, Host, Watch } from '@stencil/core';
import { Route, MatchResults, state, IViewDo, RouterService, VisitStrategy } from '../..';

@Component({
  tag: 'x-view-do',
  styleUrl: 'x-view-do.scss',
  shadow: true,
})
export class XViewDo implements IViewDo {
  private route: Route;
  @Element() el!: HTMLXViewDoElement;
  @State() match: MatchResults;

  /**
   * The visit strategy for this do.
   * once: persist the visit and never force it again
   * always: do not persist, but don't don't show again in-session
   * optional: do not force this view-do ever. It will be available by URL
  */
  @Prop() visit: VisitStrategy = VisitStrategy.once;

  /**
   * If present, the expression must
   * evaluate to true for this route
   * to be sequenced by the parent view.
   * The existence of this value overrides
   * the visit strategy
   */
  @Prop() when?: string;

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

  /**
   *  A property that returns true if this route has
   *  already been visited. This will be used by
   *  the parent view to determine if this route
   *  should be part of a sequence.
   */
  @Prop() visited = false;

  get parentUrl() {
    return this.el.parentElement.getAttribute('url');
  }

  get root() {
    return this.el.parentElement.getAttribute('root');
  }

  get urlKey() {
    return `${window.location.href}`;
  }

  async componentDidUpdate() {
    await this.route.loadCompleted();
  }

  componentWillLoad() {
    this.visited = (this.visited
      // eslint-disable-next-line eqeqeq
      || state.sessionVisits.includes(this.urlKey)
      || state.storedVisits.includes(this.urlKey));

    this.route = new Route(
      this.el,
      this.url,
      true,
      this.pageTitle,
      this.transition || RouterService.instance.transition,
      this.scrollTopOffset,
      // eslint-disable-next-line no-return-assign
      (match) => {
        this.match = {...match};
      },
    );
  }

  async componentDidLoad() {
    // if we were just redirected here, return home
    if (this.visited && RouterService.instance.location.state?.parent) {
      RouterService.instance.history.replace(RouterService.instance.location.state.parent);
    }
    await this.route.loadCompleted();
  }

  async componentWillRender() {
    if (this.match?.isExact) {
      if (this.visit === VisitStrategy.once) {
        state.storedVisits = [...new Set([...state.storedVisits, this.urlKey])];
      }
      state.sessionVisits = [...new Set([...state.sessionVisits, this.urlKey])];
      this.visited = true;
    }
  }

  render() {
    const classes = `overlay ${this.transition || RouterService.instance.transition}`;

    if (this.match?.isExact) {
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
