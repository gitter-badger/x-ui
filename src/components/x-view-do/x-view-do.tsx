import { Component, h, Prop, Element, State, Host, Watch, Listen, ComponentInterface, forceUpdate } from '@stencil/core';
import { storeVisit, markVisit } from '../../services/visits';
import {
  EventEmitter,
  Route,
  MatchResults,
  state,
  VisitStrategy,
  RouterService,
  debugIf,
  resolveElementVisibility,
  resolveElementValues,
} from '../..';

@Component({
  tag: 'x-view-do',
  styleUrl: 'x-view-do.scss',
  shadow: true,
})
export class XViewDo implements ComponentInterface {
  private route: Route;
  private timedNodes = [];
  private timer;
  private lastTime;
  private timeEvent: EventEmitter;
  @Element() el!: HTMLXViewDoElement;
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
  * Automatically progress after X seconds.
  */
  @Prop() nextAfter?: number;

  @Watch('url')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validatePath(newValue: string, _oldValue: string) {
    const isBlank = typeof newValue !== 'string' || newValue === '';
    const has2chars = typeof newValue === 'string' && newValue.length >= 2;
    if (isBlank) { throw new Error('url: required'); }
    if (!has2chars) { throw new Error('url: too short'); }
  }

  @Listen('xui:action-events:data', {
    target: 'body',
  })
  async dataEvent() {
    forceUpdate(this.el);
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

  private get childVideo(): HTMLVideoElement {
    if (!this.el.hasChildNodes()) return null;
    return this.el.querySelector('video');
  }

  componentWillLoad() {
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
      async (match) => {
        this.match = {...match};
        forceUpdate(this.el);
      },
    );

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
        clearInterval(this.timer);
        RouterService.instance?.returnToParent();
      }
    };

    // Attach next
    const nextElement = this.el?.querySelector('.x-next');
    nextElement?.addEventListener('click', (e) => {
      next(nextElement?.localName, 'clicked');
      e.preventDefault();
    });

    // Attach back
    const backElement = this.el?.querySelector('.x-back');
    backElement?.addEventListener('click', (e) => {
      e.preventDefault();
      RouterService.instance?.returnToParent();
    });

    // Attach enter-key for next
    const inputElements = this.el.querySelectorAll('input');
    if (inputElements) {
      const lastInput = inputElements[inputElements.length - 1];
      lastInput?.addEventListener('keypress', (ev:KeyboardEvent) => {
        if (ev.key === 'Enter') {
          next(lastInput.localName, 'enter-key');
        }
      });
    }

    // Capture timed nodes
    const timedElements = this.el.querySelectorAll('*[x-in-time], *[x-out-time]');
    timedElements.forEach((el) => {
      this.timedNodes.push({
        start: parseFloat(el.getAttribute('x-in-time')),
        end: parseFloat(el.getAttribute('x-out-time')),
        classIn: el.getAttribute('x-in-class'),
        classOut: el.getAttribute('x-out-class'),
        element: el,
      });
    });
  }

  async componentDidLoad() {
    await this.route.loadCompleted();
  }

  async componentDidUpdate() {
    await this.route.loadCompleted();
  }

  async componentWillRender() {
    await this.resolveTemplate();
  }

  private async resolveTemplate() {
    const timeUpdateEvent = 'timeupdate';
    clearInterval(this.timer);
    if (this.match?.isExact) {
      const video = this.childVideo;
      this.timeEvent = new EventEmitter();
      this.lastTime = 0;
      if (video) {
        video.addEventListener(timeUpdateEvent, () => {
          this.timeEvent.emit(timeUpdateEvent, video.currentTime);
        });
        this.nextAfter = video.duration;
      } else {
        let time = 0;
        this.timer = setInterval(() => {
          time += 0.1;
          this.timeEvent.emit(timeUpdateEvent, time);
        }, 100);
      }
      resolveElementValues(this.el);
      resolveElementVisibility(this.el);
      markVisit(this.url);

      if (this.visit === VisitStrategy.once) {
        storeVisit(this.url);
      }
      this.timeEvent.on(timeUpdateEvent, (time) => {
        this.handleTimeUpdate(time);

        // monitor next-when
        if ((this.nextAfter > 0) && (time > this.nextAfter)) {
          clearInterval(this.timer);
          RouterService.instance?.returnToParent();
        }
      });
    }
  }

  private handleTimeUpdate(time: number) {
    const classIn = 'x-class-in';
    const classOut = 'x-class-out';
    this.timedNodes.forEach((node) => {
      if (Math.abs(time - this.lastTime) < 0.1) {
        return;
      }
      this.lastTime = time;
      if ((!node.element.classList.contains(classIn))
        && (time >= node.start)
        && (node.end ? time < node.end : true)) {
        node.element.classList.remove(classOut);
        node.element.classList.remove(node.classOut);
        node.element.classList.add(node.classIn);
        node.element.classList.add(classIn);
      } else if ((node.element.classList.contains(classIn))
        && ((time < node.start) || (node.end ? time >= node.end : false))) {
        node.element.classList.remove(node.classIn);
        node.element.classList.remove(classIn);
        node.element.classList.add(classOut);
        node.element.classList.add(node.classOut);
      }
    });

    const timeValueElements = this.el.querySelectorAll('*[x-time-to]');
    timeValueElements.forEach((el) => {
      const attributeName = el.getAttribute('x-time-to');
      if (attributeName) {
        el.setAttribute(attributeName, time.toString());
      }
    });

    const timePercentageValueElements = this.el.querySelectorAll('*[x-percentage-to]');
    timePercentageValueElements.forEach((el) => {
      const attributeName = el.getAttribute('x-percentage-to');
      // const timeRemaining = this.nextAfter - time;
      const percentage = (time / this.nextAfter);
      if (attributeName) {
        el.setAttribute(attributeName, percentage.toString());
      }
    });
  }

  render() {
    const classes = `${this.transition}`;

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
