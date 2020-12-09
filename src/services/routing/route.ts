import { RouteViewOptions, MatchResults } from './interfaces';
import { matchesAreEqual } from './utils/match-path';
import { RouterService } from './router-service';

export class Route {
  public match: MatchResults;
  public scrollOnNextRender: boolean = false;
  public previousMatch: MatchResults | null = null;
  private router: RouterService;
  constructor(
    public routeElement: HTMLElement,
    public path: string,
    public exact: boolean = false,
    public pageTitle: string,
    public transition: string,
    public scrollTopOffset: number,
    matchSetter: (m: MatchResults) => void,
  ) {
    this.router = RouterService.instance;
    this.router?.onRouteChange(() => {
      this.previousMatch = this.match;
      this.match = this.router.matchPath({
        path: this.path,
        exact: this.exact,
        strict: true,
      });
      matchSetter(this.match);
    });
  }

  async loadCompleted() {
    let routeViewOptions: RouteViewOptions = {};

    if (this.router?.history && this.router?.history.location.hash) {
      routeViewOptions = {
        scrollToId: this.router?.history.location.hash.substr(1),
      };
    } else if (this.scrollTopOffset) {
      routeViewOptions = {
        scrollTopOffset: this.scrollTopOffset,
      };
    }

    // If this is an independent route and it matches then routes have updated.
    // If the only change to location is a hash change then do not scroll.
    if (this.match?.isExact && !matchesAreEqual(this.match, this.previousMatch) && this.router.viewsUpdated) {
      this.router.viewsUpdated(routeViewOptions);
      if (this.routeElement.ownerDocument) {
        if (this.pageTitle) {
          this.routeElement.ownerDocument.title = `${this.pageTitle} | ${this.router.appTitle || ''}`;
        } else if (this.router.appTitle) {
          this.routeElement.ownerDocument.title = `${this.router.appTitle}`;
        }
      }
    }
  }
}
