import {
  Component,
  h,
  Host,
  Element,
  Event,
  EventEmitter,
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
  interfaceState,
  ActionBus,
  DataListener,
  InterfaceListener,
  RoutingListener,
  ActionEvent,
  resolveChildRemoteHtml,
} from '../../services';

/**
 *  @set routing
 */
@Component({
  tag: 'x-ui',
  styleUrl: 'x-ui.scss',
  shadow: true,
})
export class XUI {
  private router: RouterService;
  private listeners: Array<IActionEventListener> = [];
  @Element() el!: HTMLXUiElement;
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
    target: 'body',
    capture: true,
  })
  delegateActionEventFromDOM(ev: CustomEvent<ActionEvent<any>>) {
    const action = ev.detail as ActionEvent<any>;
    ActionBus.emit(action.topic, action);
  }

  /**
   * Listen to all XUI events here.
   */
  @Event({
    eventName: 'innerEvents',
    composed: true,
  }) innerEvents: EventEmitter<any>;

  /**
   * Listen to all XUI events here.
   */
  @Event({
    eventName: 'routeChanged',
    composed: true,
  }) routeChanged: EventEmitter<any>;

  componentWillLoad() {
    if (this.debug) log('xui: initializing <debug>');
    else log('xui: initializing');

    interfaceState.debug = this.debug;

    ActionBus.on('*', (...args) => {
      this.innerEvents.emit(...args);
    });

    this.router = RouterService.initialize(
      writeTask,
      this.el,
      this.historyType,
      this.root,
      this.appTitle,
      this.transition,
      this.scrollTopOffset);

    this.router.onChange((location) => {
      this.location = location;
      setTimeout(() => {
        resolveChildRemoteHtml();
        this.routeChanged.emit(this.location);
      }, 100);
    });

    if (this.startUrl !== '/' && this.router.location.pathname === '/') {
      this.router.history.push(this.router.getUrl(this.startUrl, this.root));
    }

    const dataListener = new DataListener();
    this.addListener('data', dataListener);

    const routeListener = new RoutingListener();
    this.addListener('route', routeListener);

    const documentListener = new InterfaceListener(window);
    this.addListener('document', documentListener);
  }

  private addListener(name: string, listener: IActionEventListener) {
    debugIf(interfaceState.debug, `x-ui: ${name}-listener registered`);
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
    this.router.destroy();
    ActionBus.removeAllListeners();
  }

  componentDidLoad() {
    log('x-xui: initialized');
  }

  render() {
    return (
      <Host class={{ fill: this.fullPage }}>
        <slot></slot>
      </Host>
    );
  }
}
