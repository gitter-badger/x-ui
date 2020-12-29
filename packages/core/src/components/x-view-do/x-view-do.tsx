import {
  Component, h, Prop,
  Element, State, Host, Watch, writeTask,
} from '@stencil/core';
import {
  EventEmitter,
  Route,
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
  markVisit,
  storeVisit,
  ActionActivationStrategy,
  restoreElementChildTimedNodes,
  warn,
  wrapFragment,
} from '../../services';

/**
 *  @system routing
 */
@Component({
  tag: 'x-view-do',
  styleUrl: 'x-view-do.scss',
  shadow: true,
})
export class XViewDo {
  private timedNodes: Array<TimedNode> = [];
  private timer: any;
  private timeEvent: EventEmitter;
  private lastTime: number;
  private route: Route;
  @Element() el: HTMLXViewDoElement;
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
  * Set a duration in milliseconds for this view. When this value exists, the page will
  * automatically progress when the duration in seconds has passed.
  */
  @Prop() duration?: number;

  /**
   * Remote URL for this Route's content.
   */
  @Prop() contentSrc: string;

  /**
  * To debug timed elements, set this value to true.
  */
  @Prop() debug: boolean = false;

  @Watch('url')
  validatePath(newValue: string, _oldValue: string) {
    const isBlank = typeof newValue !== 'string' || newValue === '';
    const has2chars = typeof newValue === 'string' && newValue.length >= 2;
    if (isBlank) { throw new Error('url: required'); }
    if (!has2chars) { throw new Error('url: too short'); }
  }


  private get childVideo(): HTMLVideoElement {
    if (!this.el.hasChildNodes()) return null;
    const childVideos = Array.from(this.el.childNodes).filter((c) => c.nodeName === 'VIDEO')
      .map((v) => v as HTMLVideoElement);

    if (childVideos.length > 0) {
      return childVideos[0];
    }
    return null;
  }

  private get actionActivators(): Array<HTMLXActionActivatorElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes).filter((c) => c.nodeName === 'X-ACTION-ACTIVATOR')
      .map((v) => v as HTMLXActionActivatorElement);
  }

  componentWillLoad() {
    debugIf(this.debug, `x-view-do: ${this.url} loading`);

    this.route = new Route(
      this.el,
      this.url,
      true,
      this.pageTitle,
      this.transition,
      this.scrollTopOffset,
      async (match) => {
        this.match = !!match;
        this.exact = match?.isExact;
        debugIf(this.debug, `x-view-do: ${this.url} location changed match: ${JSON.stringify(this.match || null)}`);
        await this.resolveView();
      },
    );

    ActionBus.on(DATA_EVENTS.DataChanged, async () => {
      debugIf(this.debug, `x-view-do: data changed `);
      await this.resolveView();
    });

    // Attach enter-key for next
    this.el.addEventListener('keypress', (ev:KeyboardEvent) => {
      if (ev.key === 'Enter') {
        this.next(this.el.localName, 'enter-key');
      }
    });
  }

  componentDidRender() {
    debugIf(this.debug, `x-view-do: ${this.url} did render`);
  }

  private async fetchHtml() {
    if (!this.contentSrc) return;
    this.el.querySelector('#content')?.remove();
    try {
      const response = await fetch(this.contentSrc);
      if (response.status === 200) {
        const data = await response.text();
        this.el.appendChild(wrapFragment(data, 'content', 'content'));
      } else {
        warn(`x-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`);
      }
    } catch (error) {
      warn(`x-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`);
    }
  }

  private next(element:string, eventName: string) {
    debugIf(this.debug, `x-view-do: next fired from ${element}:${eventName}`);

    const inputElements = this.el.querySelectorAll('input');
    let valid = true;
    inputElements.forEach((i) => {
      i.blur();
      if (i.reportValidity() === false) {
        valid = false;
      }
    });
    if (valid) {
      if (this.visit === VisitStrategy.once) {
        storeVisit(this.url);
      }
      markVisit(this.url);
      this.beforeExit();
      RouterService.instance.goToParentRoute();
    }
  }

  private async resolveView() {
    debugIf(this.debug, `x-view-do: ${this.url} resolve view called`);
    clearInterval(this.timer);

    if (this.exact) {
      debugIf(this.debug, `x-view-do: ${this.url} on-enter`);
      await this.fetchHtml();
      this.el.removeAttribute('hidden');
      writeTask(() => this.resolveChildren());
    } else {
      this.el.setAttribute('hidden', '');
    }
  }

  private async resolveChildren() {
    debugIf(this.debug, `x-view-do: ${this.url} resolve children called`);

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
      this.beforeExit();
      RouterService.instance.history.goBack();
    });
    backElement?.removeAttribute('x-back');

    // Capture timed nodes
    this.timedNodes = captureElementChildTimedNodes(this.el, this.duration);
    debugIf(this.debug && this.timedNodes.length > 0,
      `x-view-do: ${this.url} found time-child nodes: ${JSON.stringify(this.timedNodes)}`);

    resolveElementValues(this.el);
    resolveElementVisibility(this.el);

    this.setupTimer();

    // activate on-enter actions
    this.actionActivators
      .filter((activator) => activator.activate === ActionActivationStrategy.OnEnter)
      .forEach((activator) => activator.activateActions());

    await this.route.loadCompleted();
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
      const started = performance.now();

      const emitTime = () => {
        time = (performance.now() - started) / 1000;
        debugIf(true, `x-view-do: ${time}`);
        this.timeEvent.emit(timeUpdateEvent, time);

        if (time < this.duration) {
          this.timer = requestAnimationFrame(emitTime);
        }
      }

      this.timer = requestAnimationFrame(emitTime);
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
      if ((duration > 0) && (time > duration)) {
        cancelAnimationFrame(timer);
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

  private beforeExit() {
    this.childVideo?.pause();

    clearInterval(this.timer);
    this.timer = null;

    this.lastTime = 0;

    restoreElementChildTimedNodes(
      this.el,
      this.timedNodes);

    this.actionActivators
      .filter((activator) => activator.activate === ActionActivationStrategy.OnExit)
      .forEach((activator) => {
        activator.activateActions();
      });
  }

  render() {
    return (
      <Host class={this.route?.transition}>
        <slot />
        <slot name="content"/>
      </Host>
    );
  }
}
