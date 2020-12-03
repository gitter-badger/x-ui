/**
 * Returns the hash of string (slightly compressed)
 * @param {string} value - string to hash
 * @returns {string} hash of the value
 */
export function stringToHash(value: string): string {
  let hash = 0;

  if (value.length === 0) return hash.toString();

  for (let i = 0, l = value.length; i < l; i++) {
    const char = value.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
    // eslint-disable-next-line no-bitwise
    hash &= hash; // Convert to 32bit integer
  }

  return hash.toString();
}

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
