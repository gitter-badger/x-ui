/**
 * Throws an error if the value parameter is not defined.
 * @param {string} value the value that should not be null
 * @param {string} name the name of the parameter/variable to use in the error
 */
export function requireValue(value: string, name: string): void {
  if (value === undefined || value === '') throw new Error(`A value for ${name} was not provided.`);
}

/**
   * Wraps a promise in a timeout, allowing the promise to reject if not resolve with a specific period of time
   * @param {integer} ms - milliseconds to wait before rejecting promise if not resolved
   * @param {Promise} promise to monitor
   * @example
   *  promiseTimeout(1000, fetch('https://path/to.json'))
   *      .then(function(cvData){
   *          alert(cvData);
   *      })
   *      .catch(function(){
   *          alert('request either failed or timed-out');
   *      });
   * @returns {Promise} resolves as normal if not timed-out, otherwise rejects
   */
export function promiseTimeout(ms: number, promise: Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    // create a timeout to reject promise if not resolved
    const timer = setTimeout(() => {
      reject(new Error('Promise Timed Out'));
    }, ms);

    promise.then((res) => {
      clearTimeout(timer);
      resolve(res);
    })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Wait ('await') for a specified amount of time.
 * @param {number} ms time in milliseconds to wait
 * @return {void}
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    hash = ((hash << 5) - hash) + char;
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
