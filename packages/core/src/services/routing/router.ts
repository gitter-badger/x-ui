import { RafCallback } from '@stencil/core/internal';
import { createBrowserHistory } from './factories/createBrowserHistory';
import { createHashHistory } from './factories/createHashHistory';
import { matchPath } from './utils/match-path';
import { getUrl, getLocation, normalizeChildUrl } from './utils/location-utils';
import { addDataProvider } from '../data/providers/factory';
import { RoutingDataProvider } from './data-provider';
import { EventEmitter } from '../actions';
import {
  LocationSegments,
  RouterHistory,
  RouteViewOptions,
  HistoryType,
  MatchOptions,
  MatchResults,
} from './interfaces';

const HISTORIES: { [key in HistoryType]: (win: Window) => RouterHistory } = {
  browser: createBrowserHistory,
  hash: createHashHistory,
};

export class RouterService {
  location: LocationSegments;
  history: RouterHistory;
  events: EventEmitter;

  private constructor(
    private writeTask: (t:RafCallback) => void,
    public rootElement: HTMLElement,
    public historyType: HistoryType,
    public root: string,
    public appTitle: string,
    public transition?: string,
    public scrollTopOffset = 0,
  ) {
    this.history = HISTORIES[historyType]((rootElement.ownerDocument as any).defaultView);
    if (!this.history) return;

    this.events = new EventEmitter();

    this.history.listen((location: LocationSegments) => {
      const newLocation =  getLocation(location, root);
      this.history.location = newLocation
      this.location = newLocation;
      this.events.emit('changed', newLocation)
    });

    this.location = getLocation(this.history.location, root);

    addDataProvider('route', new RoutingDataProvider(
      (key:string) => this.location?.params[key]));

    addDataProvider('query', new RoutingDataProvider(
      (key:string) => this.location?.query[key]));
  }

  viewsUpdated = (options: RouteViewOptions = {}) => {
    if (this.history && options.scrollToId && this.historyType === 'browser') {
      const elm = this.history?.win.document.getElementById(options.scrollToId);
      if (elm) {
        return elm.scrollIntoView();
      }
    }
    this.scrollTo(options.scrollTopOffset || this.scrollTopOffset);
  };

  goToParentRoute() {
    const {history} = this;
    if (!history) return;

    const parentSegments = history.location.pathParts.slice(0, history.location?.pathParts.length - 1);
    if (parentSegments == null) {
      history.goBack();
    } else {
      history.push(parentSegments.join('/'));
    }
  }

  scrollTo(scrollToLocation?: number) {
    const {history} = this;
    if (!history) return;

    if (scrollToLocation == null || !history) {
      return;
    }

    if (history.action === 'POP' && Array.isArray(history.location.scrollPosition)) {
      if (history && history.location && Array.isArray(history.location.scrollPosition)) {
        history.win.scrollTo(history.location.scrollPosition[0], history.location.scrollPosition[1]);
      }
      return;
    }
    // okay, the frame has passed. Go ahead and render now
    this.writeTask(() => history.win.scrollTo(0, scrollToLocation));
  }

  matchPath(options: MatchOptions = {}): MatchResults|null {
    if (!this.location) return null;

    return matchPath(this.location, options);
  }

  getUrl(url:string, root?: string) {
    return getUrl(url, root || this.root);
  }

  normalizeChildUrl(childUrl:string, parentUrl: string) {
    return normalizeChildUrl(childUrl, parentUrl);
  }

  isModifiedEvent(ev: MouseEvent) {
    return (ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey);
  }

  onChange(listener: (location: LocationSegments) => void) {
    this.events.on('changed', (l) => listener(l))
    listener(this.location);
  }

  destroy() {
    this.events.removeAllListeners();
  }

  static instance: RouterService;

  static initialize(
    writeTask: (t:RafCallback) => void,
    rootElement: HTMLElement,
    historyType: HistoryType,
    root: string,
    titleSuffix: string,
    transition?: string,
    scrollTopOffset = 0,
  ) {
    this.instance = new RouterService(
      writeTask,
      rootElement,
      historyType,
      root,
      titleSuffix,
      transition,
      scrollTopOffset);

    return this.instance;
  }
}
