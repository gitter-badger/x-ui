import { Component, h, Prop, Element, State, Host, Watch } from '@stencil/core';
import {
  Route,
  MatchResults,
  state,
  VisitStrategy,
  RouterService,
  resolveExpression,
  hasExpression,
  debugIf,
} from '../..';

@Component({
  tag: 'x-view-do',
  styleUrl: 'x-view-do.scss',
  shadow: true,
})
export class XViewDo {
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

  private get parent(): HTMLXViewElement {
    return this.el.parentElement as HTMLXViewElement;
  }

  get parentUrl() {
    return this.parent?.getAttribute('url');
  }

  get root() {
    return this.parent?.getAttribute('root');
  }

  async componentDidUpdate() {
    await this.route.loadCompleted();
  }

  componentWillLoad() {
    debugIf(state.debug, `x-view-do: <x-view-do~loading> ${this.url}`);
    if (this.transition === undefined) {
      this.transition = this.parent?.transition;
    }

    this.route = new Route(
      this.el,
      this.url,
      true,
      this.pageTitle,
      this.transition,
      this.scrollTopOffset,
      // eslint-disable-next-line no-return-assign
      (match) => {
        this.match = {...match};
      },
    );

    const nextElement = this.el?.querySelector('#next');
    const next = (element:string, eventName: string) => {
      debugIf(state.debug, `x-view-do: next element ${element} ${eventName} detected`);
      const inputElements = this.el.querySelectorAll('input');
      let valid = true;
      inputElements.forEach((i) => {
        i.blur();
        if (i.reportValidity() === false) {
          valid = false;
        }
      });
      if (valid) {
        RouterService.instance?.returnToParent();
      }
    };

    // Attach next()
    debugIf(state.debug && nextElement != null, `x-view-do: found next element ${nextElement?.localName}, attaching click-handler`);
    nextElement?.addEventListener('click', () => {
      next(nextElement?.localName, 'clicked');
    });

    const inputElements = this.el.querySelectorAll('input');
    if (inputElements) {
      const lastInput = inputElements[inputElements.length - 1];
      lastInput?.addEventListener('keypress', (ev:KeyboardEvent) => {
        if (ev.key === 'Enter') {
          next(lastInput.localName, 'enter-key');
        }
      });
    }
  }

  async componentDidLoad() {
    await this.route.loadCompleted();
  }

  async componentWillRender() {
    if (this.match?.isExact) {
      const valueElements = this.el.querySelectorAll('*[value-from]');
      valueElements.forEach(async (el) => {
        const expression = el.getAttribute('value-from');
        if (hasExpression(expression)) {
          const value = await resolveExpression(expression);
          el.setAttribute('value', value);
        }
      });

      if (this.visit === VisitStrategy.once) {
        state.storedVisits = [...new Set([...state.storedVisits, this.url])];
      }
      state.sessionVisits = [...new Set([...state.sessionVisits, this.url])];
    }
  }

  render() {
    const classes = `overlay ${this.transition}`;

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
