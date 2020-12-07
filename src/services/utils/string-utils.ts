/**
 * Turns 'truthy' values into true and 'falsy' into false.
 * @param {any} value
 * @return {boolean}
 */
export function toBoolean(value: any) {
  if (typeof value === 'string') {
    const stringResult = value.slice().toLocaleLowerCase();
    if (['false', 'no', 'off'].includes(stringResult)) return false;
    if (['true', 'yes', 'on'].includes(stringResult)) return true;
  } else {
    if ([false, -1, 0, null].includes(value)) return false;
    if ([true, 1].includes(value)) return true;
  }
  return Boolean(value);
}
