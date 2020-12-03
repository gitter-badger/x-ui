/* eslint-disable no-console */

import { state } from "./state";

const prefix = '%cview.DO UI%c ';

const colors = {
  log: [
    'color: white;background:#7566A0;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    'color: black:background:none;font-weight:normal',
  ],
  debug: [
    'color: white;background:#44883E;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    'color: black:background:none;font-weight:normal',
  ],
  warn: [
    'color: white;background:#ffc409;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    'color: black:background:none;font-weight:normal;color:#FDD757;',
  ],
  error: [
    'color: white;background:#eb445a;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    'color: black:background:none;font-weight:normal;color:red;',
  ],
};

export function log(message: string) {
  console.log(prefix + message, ...colors.log);
}

export function debug(message: string) {
  if (state.debug) console.debug(prefix + message, ...colors.debug);
}

export function warn(warning: string, ...params: any[]) {
  console.warn(prefix + warning, ...colors.warn, params);
}

export function error(message: string, err?: Error) {
  console.error(prefix + message, ...colors.error, err);
}
