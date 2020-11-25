import { Component, Prop, State, Element, ComponentInterface, h } from '@stencil/core';
import { MatchResults } from '../../services/routing/types';
import { state } from '../../services';

@Component({
  tag: 'x-link'
})
export class XLink implements ComponentInterface {
  @Element() el!: HTMLElement;

  @Prop() url!: string;
  @Prop() activeClass: string = 'link-active';
  @Prop() exact: boolean = false;
  @Prop() strict: boolean = true;

  /**
   *  Custom tag to use instead of an anchor
   */
  @Prop() custom: string = 'a';

  @Prop() anchorClass?: string;
  @Prop() anchorRole?: string;
  @Prop() anchorTitle?: string;
  @Prop() anchorTabIndex?: string;
  @Prop() anchorId?: string;

  @Prop() ariaHaspopup?: string;
  @Prop() ariaPosinset?: string;
  @Prop() ariaSetsize?: number;
  @Prop() ariaLabel?: string;

  @State() match: MatchResults | null = null;

  componentWillLoad() {
    if (state.router) {
      state.router.onRouteChange(() => {
        this.match = state.router.matchPath({
          path: this.url,
          exact: this.exact,
          strict: this.strict
        });
      });
    }
  }


  handleClick(e: MouseEvent) {
    if (state.router.isModifiedEvent(e) || !state.router.history || !this.url || !state.router.root) {
      return;
    }

    e.preventDefault();
    return state.router.history.push(state.router.getUrl(this.url, state.router.root));
  }

  // Get the URL for this route link without the root from the router
  render() {
    let anchorAttributes: { [key: string]: any} = {
      class: {
        [this.activeClass]: this.match !== null,
      },
      onClick: this.handleClick.bind(this)
    }

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
        'aria-label': this.ariaLabel
       }
    }
    const Anchor = (args, children) => h(this.custom, args,children);

    return (
      <Anchor {...anchorAttributes}>
        <slot></slot>
      </Anchor>
    );
  }
}

