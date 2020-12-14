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

    promise
      .then((res) => {
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
 * A synchronous way to find an item in a array with
 * an asynchronous predicate
 *
 * @export
 * @template T
 * @param {T[]} array
 * @param {(t: T) => Promise<boolean>} predicate
 * @return {*}  {(Promise<T | undefined>)}
 */
export async function findAsyncSequential<T>(
  array: T[],
  predicate: (t: T) => Promise<boolean>,
): Promise<T | undefined> {
  for (const t of array) {
    // eslint-disable-next-line no-await-in-loop
    if (await predicate(t)) {
      return t;
    }
  }
  return null;
}


/**
 * A synchronous way to find an item in a array with
 * an asynchronous predicate
 *
 * @export
 * @template T
 * @param {T[]} array
 * @param {(t: T) => Promise<boolean>} predicate
 * @return {*}  {(Promise<T | undefined>)}
 */
export async function forEachAsync<T>(
  array: T[],
  promiseFunc: (t: T) => Promise<void>) {
  return Promise.all(array.map(promiseFunc));
}
