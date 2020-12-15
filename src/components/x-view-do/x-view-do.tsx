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
  captureElementChildTimedNodes,
  resolveElementVisibility,
  resolveElementChildTimedNodesByTime,
  resolveElementValues,
  TimedNode,
} from '../..';
import { ActionActivationStrategy, forEachAsync } from '../../services';

@Component({
  tag: 'x-view-do',
  styleUrl: 'x-view-do.scss',
  shadow: true,
})
export class XViewDo implements ComponentInterface {
  private route: Route;
  private timedNodes: Array<TimedNode> = [];
  private timer: NodeJS.Timeout;
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
  * Set a duration for this view. When this value exists, the page will
  * automatically progress when the duration in seconds has passed.
  */
  @Prop() duration?: number;

  /**
  * To debug timed elements, set this value to true.
  */
  @Prop() debug: boolean = false;

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
  dataEvent() {
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

  private get actionActivators(): Array<HTMLXActionActivatorElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes).filter((c) => c.nodeName === 'X-ACTION-ACTIVATOR')
      .map((v) => v as HTMLXActionActivatorElement);
  }

  private async next(element:string, eventName: string) {
    debugIf(state.debug, `x-view-do: next fired from ${element}:${eventName}`);
    const inputElements = this.el.querySelectorAll('input');
    let valid = true;
    inputElements.forEach((i) => {
      i.blur();
      if (i.reportValidity() === false) {
        valid = false;
      }
    });
    if (valid) {
      markVisit(this.url);
      if (this.visit === VisitStrategy.once) {
        storeVisit(this.url);
      }
      clearInterval(this.timer);

      await forEachAsync(
        this.actionActivators
          .filter((activator) => activator.activate === ActionActivationStrategy.OnExit),
        async (activator) => {
          await activator.activateActions();
        });

      RouterService.instance?.returnToParent();
    }
  }

  componentWillLoad() {
    if (this.transition === undefined) {
      this.transition = this.parent?.transition;
    }

    if (this.childVideo) {
      this.duration = this.childVideo.duration;
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

    // Attach next
    const nextElement = this.el?.querySelector('.x-next');
    nextElement?.addEventListener('click', (e) => {
      this.next(nextElement?.localName, 'clicked');
      e.preventDefault();
    });

    // Attach back
    const backElement = this.el?.querySelector('.x-back');
    backElement?.addEventListener('click', (e) => {
      e.preventDefault();
      RouterService.instance?.history?.goBack();
    });

    // Attach enter-key for next
    const inputElements = this.el.querySelectorAll('input');
    if (inputElements) {
      const lastInput = inputElements[inputElements.length - 1];
      lastInput?.addEventListener('keypress', (ev:KeyboardEvent) => {
        if (ev.key === 'Enter') {
          this.next(lastInput.localName, 'enter-key');
        }
      });
    }

    // Capture timed nodes
    this.timedNodes = captureElementChildTimedNodes(this.el, this.duration);
    debugIf(this.debug && this.timedNodes.length > 0,
      `x-view-do: ${this.url} found time-child nodes: ${JSON.stringify(this.timedNodes)}`);
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
    clearInterval(this.timer);
    if (this.match?.isExact) {
      await forEachAsync(
        this.actionActivators
          .filter((activator) => activator.activate === ActionActivationStrategy.OnEnter),
        async (activator) => {
          await activator.activateActions();
        });

      this.setupTimer();
      resolveElementValues(this.el);
      resolveElementVisibility(this.el);
    }
  }

  private setupTimer() {
    const timeUpdateEvent = 'timeupdate';
    const video = this.childVideo;
    this.timeEvent = new EventEmitter();

    if (video) {
      video.addEventListener(timeUpdateEvent, () => {
        this.timeEvent.emit(timeUpdateEvent, video.currentTime);
      });
      video.addEventListener('click', () => {
        this.childVideo.play();
      });
    } else {
      let time = 0;
      this.timer = setInterval(() => {
        time = Math.ceil(time += 0.1);
        debugIf(this.debug, `x-view-do: ${time}`);
        this.timeEvent.emit(timeUpdateEvent, time);
      }, 1000);
    }

    this.timeEvent.on(timeUpdateEvent, async (time) => {
      const { debug, el, timedNodes, timer, duration } = this;

      await forEachAsync(
        this.actionActivators
          .filter((activator) => activator.activate === ActionActivationStrategy.AtTime
             && activator.time === time),
        async (activator) => {
          await activator.activateActions();
        });

      // monitor next-when
      if ((duration > 0) && (time >= duration)) {
        clearInterval(timer);
        debugIf(debug, `x-view-do: presentation ended at ${time} [not redirecting]`);
        if (!debug) {
          this.next('timer', timeUpdateEvent);
        }
      } else {
        resolveElementChildTimedNodesByTime(
          el,
          timedNodes,
          time,
          duration,
          debug);
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
