import { clearDataProviders } from '../../services/data/providers/factory';
import { Component, h, Host, Element, Event, EventEmitter, Listen, Prop, State, writeTask } from '@stencil/core';
import {
  ROUTE_EVENTS,
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
  eventBus,
  resolveElementVisibility,
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
  private eventSubscription: () => void;
  private actionsSubscription: () => void;
  private listeners: Array<IEventActionListener> = [];

  @Element() el: HTMLXUiElement;
  @State() location: LocationSegments;

  /**
   * This is the router service instantiated with this
   * component.
   */
  @Prop() router: RouterService;

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
  @Prop() mode: HistoryType = 'browser';

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

  @Listen('eventAction', {
    passive: true,
    target: 'body',
    capture: true,
  })
  delegateActionEventFromDOM(ev: CustomEvent<EventAction<any>>) {
    const action = ev.detail as EventAction<any>;
    actionBus.emit(action.topic, action);
  }

  /**
   * Listen for actionBus events.
   */
  @Event() actions: EventEmitter<any>;

  /**
   * Listen for eventBus events.
   */
  @Event() events: EventEmitter<any>;

  private get childViews(): Array<HTMLXViewElement> {
    if (!this.el.hasChildNodes()) return [];
    return Array.from(this.el.childNodes)
      .filter(c => c.nodeName === 'X-VIEW')
      .map(v => v as HTMLXViewElement);
  }

  componentWillLoad() {
    interfaceState.debug = this.debug;

    if (this.debug) log('x-ui: initializing <debug>');
    else log('x-ui: initializing');

    this.actionsSubscription = actionBus.on('*', (_topic, args) => {
      this.actions.emit(args);
    });

    this.eventSubscription = eventBus.on('*', (topic, args) => {
      this.events.emit(args);
      if (topic == ROUTE_EVENTS.RouteChanged) {
        this.el.querySelectorAll('.active-route-exact [no-render], .active-route [no-render]').forEach(async el => {
          el.removeAttribute('no-render');
        });
      }
    });

    this.router = new RouterService(writeTask, eventBus, actionBus, this.el, this.mode, this.root, this.appTitle, this.transition, this.scrollTopOffset);

    this.childViews.forEach(v => {
      if (v.url) v.url = this.router.normalizeChildUrl(v.url, this.root);
      v.transition = v.transition || this.transition;
    });

    if (this.startUrl !== '/' && this.router.location.pathname === this.root) {
      const startUrl = this.router.normalizeChildUrl(this.startUrl, this.root);
      this.router.history.push(this.router.getUrl(startUrl, this.root));
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

  componentDidLoad() {
    log('x-ui: initialized');
    resolveElementVisibility(this.el);
  }

  disconnectedCallback() {
    clearDataProviders();
    this.actionsSubscription();
    this.eventSubscription();
    eventBus.removeAllListeners();
    actionBus.removeAllListeners();
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
