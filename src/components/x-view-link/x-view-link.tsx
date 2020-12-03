import { Element, Component, State, Prop, h } from '@stencil/core';
import { MatchResults } from '../..';
import { RouterService } from '../../services/routing/router-service';

@Component({
  tag: 'x-view-link',
  styleUrl: 'x-view-link.css',
  shadow: true,
})
export class XViewLink {
  private router: RouterService;
  @Element() el!: HTMLXViewLinkElement;
  @State() match: MatchResults | null = null;

  /**
   *
   */
  @Prop() url!: string;

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
    this.router = RouterService.instance;
    if (this.router) {
      this.router.onRouteChange(() => {
        this.match = this.router.matchPath({
          path: this.url,
          exact: this.exact,
          strict: this.strict,
        });
      });
    }
  }

  private handleClick(e: MouseEvent) {
    if (this.router.isModifiedEvent(e) || !this.router.history || !this.url || !this.router.root) {
      return;
    }

    e.preventDefault();
    this.router.history.push(this.router.getUrl(this.url, this.router.root));
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
        href: this.url,
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
