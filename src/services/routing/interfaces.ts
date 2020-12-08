export const ROUTE_TOPIC = 'xui:action-events:routing';

export enum ROUTE_COMMANDS {
  NavigateNext = 'navigate-next',
  NavigateTo = 'navigate-to',
}

export enum ROUTE_EVENTS {
  RouteChanged = 'route-changed',
}

export type NavigateTo = {
  url: string;
};

export type NavigateNext = {
};

export type Path = string | RegExp | Array<string | RegExp>;

// export interface ActiveRouter {
//   subscribe: (location: LocationSegments, nextListeners: RouteSubscription[], routeSubscription: RouteSubscription) => Listener
//   dispatch: (location: LocationSegments, nextListeners: RouteSubscription[]) => void;
// }

export type Prompt = (location: LocationSegments, action: string) => string;

export interface RouteRenderProps {
  history: RouterHistory;
  match: MatchResults;
  [key: string]: any;
}

export interface RouteViewOptions {
  scrollTopOffset?: number,
  scrollToId?: string
}

export interface RouteSubscription {
  isMatch: boolean;
  groupId?: string;
  groupIndex?: number;
}

export type HistoryType = 'browser' | 'hash';

export type Listener = () => void;

export interface LocationSegments {
  pathname: string;
  query: { [key: string]: any };
  key: string;
  scrollPosition?: [number, number];
  search?: string;
  hash?: string;
  state?: any;
  pathParts?: string[]
  hashParts?: string[];
}

export type LocationSegmentPart = 'pathname' | 'search' | 'hash' | 'state' | 'key';

export interface RouterHistory {
  length: number;
  action: string;
  location: LocationSegments;
  createHref: (location: LocationSegments) => string;
  push: (path: string | LocationSegments, state?: any) => void;
  replace: (path: string | LocationSegments, state?: any) => void;
  go: (n: number) => void;
  goBack: () => void;
  goForward: () => void;
  block: (prompt?: string | Prompt) => () => void;
  listen: (listener: Function) => () => void;
  win: Window;
}

export interface MatchOptions {
  path?: Path;
  exact?: boolean;
  strict?: boolean;
}

export interface MatchResults {
  path: string;
  url: string;
  isExact: boolean;
  params: {
    [key: string]: string
  };
}

export enum VisitStrategy {
  'once',
  'always',
  'optional'
}
export interface IViewDo {
  visit: VisitStrategy;
  when?: string;
  visited: boolean;
  [key: string]: any;
}
