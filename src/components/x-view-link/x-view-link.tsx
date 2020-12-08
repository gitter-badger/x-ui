import { Element, Component, State, Prop, h } from '@stencil/core';
import { MatchResults } from '../..';
import { Route } from '../../services/routing/route';
import { RouterService } from '../../services/routing/router-service';

@Component({
  tag: 'x-view-link',
  styleUrl: 'x-view-link.css',
  shadow: true,
})
export class XViewLink {
  private route: Route;
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
    this.route = new Route(
      this.el,
      this.url,
      this.exact,
      null,
      null,
      null,
      (m) => {
        this.match = m;
      },
    );
  }

  private handleClick(e: MouseEvent) {
    const router = RouterService.instance;
    if (!router || router?.isModifiedEvent(e) || !router?.history || !this.url || !router?.root) {
      return;
    }

    e.preventDefault();
    router.history?.push(router.getUrl(this.url, router.root));
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
