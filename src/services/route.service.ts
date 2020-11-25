import { RouteViewOptions, MatchResults } from './routing/types';
import { matchesAreEqual } from './routing/utils/match-path';
import { RouterService } from './router.service';

export { MatchResults }
export class RouteService {

  public match: MatchResults;
  public scrollOnNextRender: boolean = false;
  public previousMatch: MatchResults | null = null;

  constructor(
    private router: RouterService,
    public routeElement: HTMLElement,
    public root: string,
    public url: string,
    public exact: boolean = false,
    public pageTitle: string,
    public transition: string,
    public scrollTopOffset: number,
    matchSetter: (m: MatchResults) => void
  ) {
    let self = this;
    this.router.onRouteChange(() => {
      self.match = self.router.matchPath({
        path: self.url,
        exact: self.exact,
        strict: true
      });
      matchSetter(self.match);
    });
  }

  async loadCompleted() {

    let routeViewOptions: RouteViewOptions = {};

    if (this.router.history && this.router.history.location.hash) {
      routeViewOptions = {
        scrollToId: this.router.history.location.hash.substr(1)
      };
    } else if (this.scrollTopOffset) {
      routeViewOptions = {
        scrollTopOffset: this.scrollTopOffset
      };
    }

    // If this is an independent route and it matches then routes have updated.
    // If the only change to location is a hash change then do not scroll.
    if (this.match && !matchesAreEqual(this.match, this.previousMatch) && this.router.viewsUpdated) {
      this.router.viewsUpdated(routeViewOptions);

      if (this.routeElement.ownerDocument && this.pageTitle) {
        this.routeElement.ownerDocument.title = `${this.pageTitle}${this.router.titleSuffix || ''}`;
      }
    }
  }

}
