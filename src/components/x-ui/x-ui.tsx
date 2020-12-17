import {
  Component,
  h,
  Host,
  Element,
  Listen,
  Prop,
  State,
  writeTask } from '@stencil/core';
import {
  HistoryType,
  IActionEventListener,
  LocationSegments,
  log,
  debugIf,
  RouterService,
  state,
  ActionBus,
  DataListener,
  DocumentListener,
  RoutingListener,
  ActionEvent,
  resolveChildRemoteHtml,
} from '../../services';

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

  @Listen('actionEvent', {
    passive: true,
  })
  delegateActionEventFromDOM(ev: CustomEvent<ActionEvent<any>>) {
    const action = ev.detail as ActionEvent<any>;
    ActionBus.emit(action.topic, action);
  }

  componentWillLoad() {
    this.debug ? log('xui: initializing <debug>') : log('xui: initializing');

    state.debug = this.debug;

    const router = RouterService.initialize(writeTask, this.el, this.historyType, this.root, this.appTitle, this.transition, this.scrollTopOffset);
    router.onRouteChange(() => {
      this.location = router.location;
      setTimeout(() => resolveChildRemoteHtml(), 100);
    });

    if (this.startUrl && router.location.pathname == '/') {
      router.history.replace(this.startUrl);
    }

    const dataListener = new DataListener();
    this.addListener('data', dataListener);

    const routeListener = new RoutingListener();
    this.addListener('route', routeListener);

    const documentListener = new DocumentListener();
    this.addListener('document', documentListener);
  }

  private addListener(name: string, listener: IActionEventListener) {
    debugIf(state.debug, `x-ui: ${name}-listener registered`);
    listener.initialize(ActionBus);
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
