/* eslint-disable no-mixed-operators */
/* istanbul ignore file */

import { parsePath, parseQueryString } from './path-utils';
import { LocationSegments } from '../interfaces';

const isAbsolute = (pathname: string) => pathname.charAt(0) === '/';

export const createKey = (keyLength: number) => Math.random().toString(36).substr(2, keyLength);

export const getUrl = (url: string, root: string) => {
  // Don't allow double slashes
  if (url.charAt(0) === '/' && root.charAt(root.length - 1) === '/') {
    return root.slice(0, root.length - 1) + url;
  }
  return root + url;
};


export const getLocation = (location: LocationSegments, root: string): LocationSegments => {
  // Remove the root URL if found at beginning of string
  const pathname = location.pathname.indexOf(root) === 0
    ? `/${location.pathname.slice(root.length)}`
    : location.pathname;

  return {
    ...location,
    pathname,
  };
};

// About 1.5x faster than the two-arg version of Array#splice()
const spliceOne = (list: string[], index: number) => {
  for (let i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    // eslint-disable-next-line no-param-reassign
    list[i] = list[k];
  }

  list.pop();
};

// This implementation is based heavily on node's url.parse
export const resolvePathname = (to: string, from = '') => {
  let fromParts = from && from.split('/') || [];
  let hasTrailingSlash: boolean;
  let up = 0;

  const toParts = to && to.split('/') || [];
  const isToAbs = to && isAbsolute(to);
  const isFromAbs = from && isAbsolute(from);
  const mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) {
    return '/';
  }

  if (fromParts.length) {
    const last = fromParts[fromParts.length - 1];
    hasTrailingSlash = (last === '.' || last === '..' || last === '');
  } else {
    hasTrailingSlash = false;
  }

  for (let i = fromParts.length; i >= 0; i--) {
    const part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) {
    for (; up--; up) {
      fromParts.unshift('..');
    }
  }

  if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) {
    fromParts.unshift('');
  }

  let result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') {
    result += '/';
  }

  return result;
};

export const valueEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true;
  }

  if (a == null || b == null) {
    return false;
  }

  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every((item, index) => valueEqual(item, b[index]));
  }

  const aType = typeof a;
  const bType = typeof b;

  if (aType !== bType) {
    return false;
  }

  if (aType === 'object') {
    const aValue = a.valueOf();
    const bValue = b.valueOf();

    if (aValue !== a || bValue !== b) {
      return valueEqual(aValue, bValue);
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    return aKeys.every((key) => valueEqual(a[key], b[key]));
  }

  return false;
};

export const locationsAreEqual = (a: LocationSegments, b: LocationSegments) => a.pathname === b.pathname
  && a.search === b.search
  && a.hash === b.hash
  && a.key === b.key
  && valueEqual(a.state, b.state);

export const createLocation = (path: string | LocationSegments, state: any, key: string, currentLocation?: LocationSegments) => {
  let location: LocationSegments;

  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    if (state !== undefined) {
      location.state = state;
    }
  } else {
    // One-arg form: push(location)
    location = {
      pathname: '',
      ...path,
    };

    if (location.search && location.search.charAt(0) !== '?') {
      location.search = `?${location.search}`;
    }

    if (location.hash && location.hash.charAt(0) !== '#') {
      location.hash = `#${location.hash}`;
    }

    if (state !== undefined && location.state === undefined) {
      location.state = state;
    }
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError(
        `Pathname "${location.pathname}" could not be decoded. `
        + 'This is likely caused by an invalid percent-encoding.',
      );
    } else {
      throw e;
    }
  }

  location.key = key;
  location.params = {};

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
    }
  } else if (!location.pathname) {
    location.pathname = '/';
  }

  location.query = parseQueryString(location.search || '');
  location.pathParts = location.pathname.split('/');
  location.hashParts = location.hash.split('/');
  return location;
};
