import {
  Component, h,
  Host,
  Element,
  Prop,
  State,
  writeTask,
  Event,
  EventEmitter } from '@stencil/core';
import {
  HistoryType,
  IActionEventListener,
  LocationSegments,
  log,
  debugIf,
  ProviderListener,
  RouterService,
  state } from '../../services';
import { RouteListener } from '../../services/routing/route-listener';
import { DataEvent, DATA_EVENTS } from '../../services/data/interfaces';
@Component({
  tag: 'x-ui',
  styleUrl: 'x-ui.scss',
  shadow: true,
})
export class XUI {
  listeners: Array<IActionEventListener> = [];
  @Element() el!: any;
  @State() location: LocationSegments;

  /**
   * This is the root path that the actual page is,
   * if it isn't '/', then the router needs to know
   * where to begin creating paths.
   */
  @Prop() root: string = '/';

  /**
   * Browser (paths) or Hash (#) routing.
   * To support browser history, the HTTP server
   * must be setup for a PWA
   */
  @Prop() historyType: HistoryType = 'browser';

  /**
   * Header height or offset for scroll-top on this
   * and all views.
   */
  @Prop() scrollTopOffset?: number;

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition = 'fade-in';

  /**
   * This is the application / site title.
   * If the views or dos have titles,
   * this is added as a suffix.
   */
  @Prop() appTitle: string;

  /**
   * This is the start path a user should
   * land on when they first land on this app.
   */
  @Prop() startUrl: string = '/';

  /**
   * When true, the global audio component is loaded
   * and subscribed for Event Action requests to
   * play sounds.
   */
  @Prop() audio: boolean;

  /**
   * Set this to false if you don't want the UI component
   * to take up the full page size.   *
   */
  @Prop() fullPage: boolean = true;

  /**
   * Turn on debugging to get helpful messages from the
   * routing, data and action systems.
   */
  @Prop() debug: boolean = false;

  @Event({
    eventName: 'xui:action-events:data',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) dataEvent: EventEmitter<DataEvent>;

  componentWillLoad() {
    this.debug ? log('xui: initializing <debug>') : log('xui: initializing');

    state.debug = this.debug;

    const router = RouterService.initialize(writeTask, this.el, this.historyType, this.root, this.appTitle, this.transition, this.scrollTopOffset);

    router.onRouteChange(() => {
      this.location = router.location;
    });

    if (this.startUrl && router.location.pathname == '/') {
      router.history.replace(this.startUrl);
    }

    const dataListener = new ProviderListener();
    dataListener.changed.on(DATA_EVENTS.DataChanged, () => {
      debugIf(state.debug, `x-ui: <data-provider~changed>`)
      this.dataEvent.emit({ type: DATA_EVENTS.DataChanged })
    });

    this.addListener('data', dataListener);
    this.addListener('route', new RouteListener());
  }

  private addListener(name: string, listener: IActionEventListener) {
    debugIf(state.debug, `x-ui: <${name}-listener~registered>`);
    listener.initialize(window);
    this.listeners.push(listener);
  }

  disconnectedCallback() {
    this.destroyListeners();
  }

  private destroyListeners() {
    let listener = this.listeners.pop();
    while (listener) {
      listener.destroy();
      listener = this.listeners.pop();
    }
  }

  componentDidLoad() {
    log('x-xui: initialized');
  }

  render() {
    {this.audio ? <x-audio-player></x-audio-player> : null}
    return (
      <Host class={{ fill: this.fullPage }}>
        <slot></slot>
      </Host>
    );
  }
}
