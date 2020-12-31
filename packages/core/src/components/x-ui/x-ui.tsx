import { ROUTE_EVENTS } from '../../services/routing/interfaces';
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
  IEventActionListener,
  LocationSegments,
  log,
  debugIf,
  RouterService,
  interfaceState,
  actionBus,
  DataListener,
  InterfaceListener,
  EventAction,
  resolveChildRemoteHtml,
  eventBus,
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
  private listeners: Array<IEventActionListener> = [];
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
  delegateActionEventFromDOM(ev: CustomEvent<EventAction<any>>) {
    const action = ev.detail as EventAction<any>;
    actionBus.emit(action.topic, action);
  }

  /**
   * Listen to all X-UI actions here.
   */
  @Event({
    composed: true,
  }) action: EventEmitter<any>;

  /**
   * Listen to all X-UI events here.
   */
  @Event({
    eventName: 'routeChanged',
    composed: true,
  }) event: EventEmitter<any>;

  componentWillLoad() {
    interfaceState.debug = this.debug;

    if (this.debug) log('x-ui: initializing <debug>');
    else log('x-ui: initializing');

    actionBus.on('*', (_topic, args) => {
      this.action.emit(args);
    });

    eventBus.on('*', (topic, args) => {
      this.event.emit(args);
      if (topic == ROUTE_EVENTS.RouteChanged) {
        this.location = args as LocationSegments;
        setTimeout(() => {
          resolveChildRemoteHtml();
        }, 100);
      }
    });

    this.router = RouterService.initialize(
      writeTask,
      eventBus,
      actionBus,
      this.el,
      this.historyType,
      this.root,
      this.appTitle,
      this.transition,
      this.scrollTopOffset);

    if (this.startUrl !== '/' && this.router.location.pathname === '/') {
      this.router.history.push(this.router.getUrl(this.startUrl, this.root));
    }

    const dataListener = new DataListener();
    this.addListener('data', dataListener);

    const documentListener = new InterfaceListener();
    this.addListener('document', documentListener);
  }

  private addListener(name: string, listener: IEventActionListener) {
    debugIf(interfaceState.debug, `x-ui: ${name}-listener registered`);
    listener.initialize(window, actionBus, eventBus);
    this.listeners.push(listener);
  }

  disconnectedCallback() {
    this.destroyListeners();
  }

  private destroyListeners() {
    eventBus.removeAllListeners();
    actionBus.removeAllListeners();
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
