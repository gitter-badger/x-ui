import {
  Component, h, Prop,
  Element, State, Host, Watch,
} from '@stencil/core';
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
  ActionBus,
  DATA_EVENTS,
  storeVisit,
  markVisit,
  ActionActivationStrategy,
  normalizeChildUrl,
} from '../../services';

@Component({
  tag: 'x-view-do',
  styleUrl: 'x-view-do.scss',
  shadow: true,
})
export class XViewDo {
  private route: Route;
  private timedNodes: Array<TimedNode> = [];
  private timer: NodeJS.Timeout;
  private timeEvent: EventEmitter;
  private lastTime: number;
  @Element() el: HTMLXViewDoElement;
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
  @Prop({ reflect: true, mutable: true }) url!: string;

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

  private get parent(): HTMLXViewElement {
    return this.el.parentElement.closest('x-view') as HTMLXViewElement;
  }

  private get parentUrl() {
    return this.parent?.getAttribute('url');
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

  componentWillLoad() {
    if (this.parentUrl && !this.url.startsWith(this.parentUrl)) {
      this.url = normalizeChildUrl(this.url, this.parentUrl);
    }
    debugIf(state.debug, `x-view-do: loading ${this.url}`);

    this.route = new Route(
      this.el,
      this.url,
      true,
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
    // Attach enter-key for next
    this.el.addEventListener('keypress', (ev:KeyboardEvent) => {
      if (ev.key === 'Enter') {
        this.next(this.el.localName, 'enter-key');
      }
    });
  }

  async componentDidLoad() {
    await this.route.loadCompleted();
  }

  async componentDidUpdate() {
    await this.route.loadCompleted();
  }

  private next(element:string, eventName: string) {
    debugIf(state.debug, `x-view-do: next fired from ${element}:${eventName}`);

    this.childVideo?.pause();

    clearInterval(this.timer);

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

      this.actionActivators
        .filter((activator) => activator.activate === ActionActivationStrategy.OnExit)
        .forEach((activator) => {
          activator.activateActions();
        });

      RouterService.instance?.returnToParent();
    }
  }

  async componentWillRender() {
    await this.resolveView();
  }

  private async resolveView() {
    clearInterval(this.timer);
    if (this.match?.isExact) {
      debugIf(state.debug, `x-view-do: ${this.url} on-enter`);
      // activate on-enter actions
      this.actionActivators
        .filter((activator) => activator.activate === ActionActivationStrategy.OnEnter)
        .forEach((activator) => activator.activateActions());

      setTimeout(() => this.resolveChildren(), 1000);
    }
  }

  private resolveChildren() {
    // Attach next
    const nextElement = this.el.querySelector('[x-next]');
    nextElement?.addEventListener('click', (e) => {
      this.next(nextElement?.localName, 'clicked');
      e.preventDefault();
    });
    nextElement?.removeAttribute('x-next');

    // Attach back
    const backElement = this.el?.querySelector('[x-back]');
    backElement?.addEventListener('click', (e) => {
      e.preventDefault();
      RouterService.instance?.history?.goBack();
    });
    backElement?.removeAttribute('x-back');

    // Capture timed nodes
    this.timedNodes = captureElementChildTimedNodes(this.el, this.duration);
    debugIf(this.debug && this.timedNodes.length > 0,
      `x-view-do: ${this.url} found time-child nodes: ${JSON.stringify(this.timedNodes)}`);

    resolveElementValues(this.el);
    resolveElementVisibility(this.el);

    this.setupTimer();
  }

  private setupTimer() {
    const timeUpdateEvent = 'timeupdate';
    const video = this.childVideo;
    this.timeEvent = new EventEmitter();
    this.lastTime = 0;
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
      const { debug, el, timedNodes, timer, duration = video?.duration } = this;

      this.actionActivators
        .filter((activator) => activator.activate === ActionActivationStrategy.AtTime
            && (activator.time >= this.lastTime && activator.time >= time))
        .forEach(async (activator) => {
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
      this.lastTime = time;
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
