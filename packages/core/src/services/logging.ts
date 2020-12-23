/* eslint-disable no-console */

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
  console.debug(prefix + message, ...colors.debug);
}

export function warn(warning: string) {
  console.warn(prefix + warning, ...colors.warn);
}

export function error(message: string, err?: Error) {
  console.error(prefix + message, ...colors.error, err);
}

export function warnIf(value:boolean, message: any) {
  if (value) {
    warn(message);
  }
}

export function logIf(value:boolean, message: any) {
  if (value) {
    log(message);
  }
}

export function debugIf(value:boolean, message: any) {
  if (value) {
    debug(message);
  }
}
