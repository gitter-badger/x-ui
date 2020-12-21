export const storageAvailable = (win: any, type: 'localStorage' | 'sessionStorage') => {
  const storage = win[type];
  const x = '__storage_test__';

  try {
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
export const supportsHistory = (win: Window) => {
  const ua = win.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1)
    && ua.indexOf('Mobile Safari') !== -1
    && ua.indexOf('Chrome') === -1
    && ua.indexOf('Windows Phone') === -1
  ) {
    return false;
  }

  return win.history && 'pushState' in win.history;
};

export const getConfirmation = (win: Window, message: string, callback: (confirmed: boolean) => {}) => (
  callback(win.confirm(message))
);

export function removeAllChildNodes(parent: HTMLElement) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
