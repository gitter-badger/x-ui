import { Component, h, Prop, Element, State, Host, Watch, writeTask } from '@stencil/core';
import '../x-view/x-view';
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
  DATA_EVENTS,
  markVisit,
  storeVisit,
  ActionActivationStrategy,
  restoreElementChildTimedNodes,
  warn,
  wrapFragment,
  eventBus,
} from '../..';

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
  @State() content: any;

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
   *  How should this page be presented
   *  (coming soon)
   */
  @Prop() display: 'page' | 'modal' | 'full' = 'page';

  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug: boolean = false;

  @Watch('url')
  validatePath(newValue: string, _oldValue: string) {
    const isBlank = typeof newValue !== 'string' || newValue === '';
    const has2chars = typeof newValue === 'string' && newValue.length >= 2;
    if (isBlank) {
      throw new Error('url: required');
    }
    if (!has2chars) {
      throw new Error('url: too short');
    }
  }

  private get childVideo(): HTMLVideoElement {
    if (!this.el.hasChildNodes()) return null;
    const childVideos = Array.from(this.el.childNodes)
      .filter(c => c.nodeName === 'VIDEO')
      .map(v => v as HTMLVideoElement);

    if (childVideos.length > 0) {
      return childVideos[0];
    }
    return null;
  }

  private get actionActivators(): Array<HTMLXActionActivatorElement> {
    return Array.from(this.el.querySelectorAll('x-action-activator'));
  }

  componentWillLoad() {
    debugIf(this.debug, `x-view-do: ${this.url} loading`);

    this.route = new Route(RouterService.instance, this.el, this.url, true, this.pageTitle, this.transition, this.scrollTopOffset, async match => {
      this.match = !!match;
      this.exact = match?.isExact;
      await this.resolveView();
      writeTask(() => resolveElementVisibility(this.el));
    });

    eventBus.on(DATA_EVENTS.DataChanged, async () => {
      debugIf(this.debug, `x-view-do: data changed `);
      await this.resolveView();
      writeTask(() => resolveElementVisibility(this.el));
    });

    // Attach enter-key for next
    this.el.addEventListener('keypress', (ev: KeyboardEvent) => {
      if (ev.key === 'Enter') {
        this.next(this.el.localName, 'enter-key');
      }
    });
  }

  componentDidRender() {
    debugIf(this.debug, `x-view-do: ${this.url} did render`);
    writeTask(() => resolveElementVisibility(this.el));
  }

  private async fetchHtml() {
    if (!this.contentSrc) return;

    this.el.querySelector('#content')?.remove();
    try {
      const response = await fetch(this.contentSrc);
      if (response.status === 200) {
        const data = await response.text();
        this.content = data;
        this.el.appendChild(wrapFragment(data, 'content', 'content'));
      } else {
        warn(`x-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`);
      }
    } catch (error) {
      warn(`x-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`);
    }
  }

  private beforeExit() {
    const inputElements = this.el.querySelectorAll('input');
    let valid = true;
    inputElements.forEach(i => {
      i.blur();
      if (i.reportValidity() === false) {
        valid = false;
      }
    });
    if (valid) {
      this.actionActivators
        .filter(activator => activator.activate === ActionActivationStrategy.OnExit)
        .forEach(activator => {
          activator.activateActions();
        });
      restoreElementChildTimedNodes(this.el, this.timedNodes);
      clearInterval(this.timer);
      this.timer = null;
      this.lastTime = 0;


    }
    return valid;
  }

  private back(element: string, eventName: string) {
    debugIf(this.debug, `x-view-do: back fired from ${element}:${eventName}`);
    if (this.beforeExit()) {
      RouterService.instance.history.goBack();
    }
  }

  private next(element: string, eventName: string, route?: string) {
    debugIf(this.debug, `x-view-do: next fired from ${element}:${eventName}`);

    if (this.beforeExit()) {
      if (this.visit === VisitStrategy.once) {
        storeVisit(this.url);
      }
      markVisit(this.url);
      if (route) {
        RouterService.instance.history.push(route);
      } else {
        RouterService.instance.goToParentRoute();
      }
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
    nextElement?.addEventListener('click', e => {
      e.preventDefault();
      this.next(nextElement?.localName, 'clicked');
    });
    nextElement?.removeAttribute('x-next');

    // Attach route
    this.el.querySelectorAll('[x-link]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const route = el.getAttribute('x-link');
        this.next(el.localName, 'clicked', route);
      });
    });

    // Attach back
    const backElement = this.el?.querySelector('[x-back]');
    backElement?.addEventListener('click', e => {
      e.preventDefault();
      this.back(nextElement?.localName, 'clicked');
    });
    backElement?.removeAttribute('x-back');

    // Capture timed nodes
    this.timedNodes = captureElementChildTimedNodes(this.el, this.duration);
    debugIf(this.debug && this.timedNodes.length > 0, `x-view-do: ${this.url} found time-child nodes: ${JSON.stringify(this.timedNodes)}`);

    resolveElementValues(this.el);
    resolveElementVisibility(this.el);

    this.setupTimer();

    // activate on-enter actions
    this.actionActivators
      .filter(activator => activator.activate === ActionActivationStrategy.OnEnter)
      .forEach(activator => activator.activateActions());

    await this.route.loadCompleted();
  }

  private setupTimer() {
    const video = this.childVideo;
    const { debug, duration = video?.duration || 0 } = this;
    const timeUpdateEvent = 'timeupdate';

    this.timeEvent = new EventEmitter();
    this.lastTime = 0;

    if (video) {
      video.addEventListener(timeUpdateEvent, () => {
        this.timeEvent.emit(timeUpdateEvent, video.currentTime);
        this.lastTime = video.currentTime;
      });
      video.addEventListener('click', () => {
        this.childVideo.play();
      });
      video.addEventListener('end', () => {
        this.next('video', 'ended');
      });
    } else {
      let time = 0;
      const started = performance.now();
      const emitTime = (time?: number) => {
        time = (performance.now() - started) / 1000;
        debugIf(this.debug, `x-view-do: ${this.lastTime} - ${time}`);
        this.timeEvent.emit(timeUpdateEvent, time);

        if ((duration > 0 && time < duration) || duration == 0) {
          this.timer = setTimeout(() => {
            this.timer = requestAnimationFrame(() => {
              emitTime(time);
            });
          }, 500);

          this.lastTime = time;
        }
        if (duration > 0 && time > duration) {
          debugIf(debug, `x-view-do: presentation ended at ${time} [not redirecting]`);
          cancelAnimationFrame(this.timer);
          clearInterval(this.timer);
          this.next('timer', timeUpdateEvent);
        }
      };
      this.timer = requestAnimationFrame(() => {
        emitTime(time);
      });
    }

    this.timeEvent.on(timeUpdateEvent, time => {
      const { debug, el, timedNodes, duration = video?.duration } = this;

      this.actionActivators
        .filter(activator => activator.activate === ActionActivationStrategy.AtTime)
        .filter(activator => time >= activator.time )
        .forEach(activator => {
          activator.activateActions();
        });

      resolveElementChildTimedNodesByTime(el, timedNodes, time, duration, debug);
    });
  }


  get classes() {
    if (this.match == null) {
      return this.route?.transition;
    }
    if (this.exact) {
      return `${this.route?.transition || ''} active-route-exact`;
    }
    return '';
  }

  render() {
    debugIf(this.debug, `x-view-do: ${this.url} render`);

    return (
      <Host class={this.classes}>
        <slot />
        {this.exact ? (
          <slot name="content" />
        ) : null}
      </Host>
    );
  }
}
