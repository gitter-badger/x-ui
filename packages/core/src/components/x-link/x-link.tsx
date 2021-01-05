import { Element, Component, State, Prop, h } from '@stencil/core';
import { MatchResults, RouterService, eventBus, ROUTE_EVENTS } from '../..';

/**
 *  @system navigation
 */
@Component({
  tag: 'x-link',
  styleUrl: 'x-link.scss',
  shadow: false,
})
export class XViewLink {
  private subscription: () => void;
  @Element() el!: HTMLXLinkElement;
  @State() match: MatchResults | null = null;

  private get router(): RouterService {
    return this.el.closest('x-ui')?.router;
  }

  /**
   *
   */
  @Prop() href!: string;

  /**
   *
   */
  @Prop() activeClass: string = 'link-active';

  /**
   *
   */
  @Prop() exact: boolean = false;

  /**
   *
   */
  @Prop() strict: boolean = true;

  /**
   *
   */
  @Prop() custom: string = 'a';

  /**
   *
   */
  @Prop() anchorClass?: string;

  /**
   *
   */
  @Prop() anchorRole?: string;

  /**
   *
   */
  @Prop() anchorTitle?: string;

  /**
   *
   */
  @Prop() anchorTabIndex?: string;

  /**
   *
   */
  @Prop() anchorId?: string;

  /**
   *
   */
  @Prop() ariaHaspopup?: string;

  /**
   *
   */
  @Prop() ariaPosinset?: string;

  /**
   *
   */
  @Prop() ariaSetsize?: number;

  /**
   *
   */
  @Prop() ariaLabel?: string;

  componentWillLoad() {
    this.subscription = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      this.match = this.router?.matchPath({
        path: this.href,
        exact: this.exact,
        strict: this.strict,
      });
    });
    this.match = this.router?.matchPath({
      path: this.href,
      exact: this.exact,
      strict: this.strict,
    });
  }

  private handleClick(e: MouseEvent) {
    const router = this.router;
    if (!router || router?.isModifiedEvent(e) || !router?.history || !this.href) {
      return;
    }

    e.preventDefault();
    router.history?.push(this.href);
  }

  disconnectedCallback() {
    this.subscription();
  }

  // Get the URL for this route link without the root from the router
  render() {
    let anchorAttributes: { [key: string]: any} = {
      class: {
        [this.activeClass]: this.match !== null,
      },
      onClick: this.handleClick.bind(this),
    };

    if (this.anchorClass) {
      anchorAttributes.class[this.anchorClass] = true;
    }

    if (this.custom === 'a') {
      anchorAttributes = {
        ...anchorAttributes,
        href: this.href,
        title: this.anchorTitle,
        role: this.anchorRole,
        tabindex: this.anchorTabIndex,
        'aria-haspopup': this.ariaHaspopup,
        id: this.anchorId,
        'aria-posinset': this.ariaPosinset,
        'aria-setsize': this.ariaSetsize,
        'aria-label': this.ariaLabel,
      };
    }
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <this.custom {...anchorAttributes}>
        <slot />
      </this.custom>
    );
  }
}
