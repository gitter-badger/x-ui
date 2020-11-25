import { LocationSegments, RouterHistory, RouteViewOptions, HistoryType, MatchOptions } from './routing/types';
import { matchPath } from './routing/utils/match-path';
import { getUrl, getLocation } from './routing/utils/location-utils';
import createHistory from './routing/createBrowserHistory';
import createHashHistory from './routing/createHashHistory';
import { RafCallback } from '@stencil/core/internal';

const HISTORIES: { [key in HistoryType]: (win: Window) => RouterHistory } = {
  'browser': createHistory,
  'hash': createHashHistory
};

export class RouterService {
  location: LocationSegments;
  history?: RouterHistory;

  constructor(
    private writeTask: (t:RafCallback) => void,
    public rootElement: HTMLElement,
    public historyType: HistoryType,
    public root: string,
    public titleSuffix: string,
    public transition?: string,
    public scrollTopOffset = 0,
    ) {

    this.history = HISTORIES[historyType]((rootElement.ownerDocument as any).defaultView);
    this.history.listen((location: LocationSegments) => {
      location = getLocation(location, root);
      this.location = getLocation(location, root);
    });
    this.location = getLocation(this.history.location, root);
  }

  viewsUpdated = (options: RouteViewOptions = {}) => {
    if (this.history && options.scrollToId && this.historyType === 'browser') {
      const elm = this.history.win.document.getElementById(options.scrollToId);
      if (elm) {
        return elm.scrollIntoView();
      }
    }
    this.scrollTo(options.scrollTopOffset || this.scrollTopOffset);
  }

  scrollTo(scrollToLocation?: number) {
    const history = this.history;

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
    return this.writeTask(() => history.win.scrollTo(0, scrollToLocation));
  }

  matchPath(options: MatchOptions = {}) {
    if(!this.location) return;

    return matchPath(this.location.pathname, options)
  }

  getUrl(url:string, root: string) {
    return getUrl(url, root)
  }

  isModifiedEvent (ev: MouseEvent) {
    return  ( ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey );
  }

  onRouteChange(listener: () => void) {
    this.history.listen(listener);
    listener();
  }


}



