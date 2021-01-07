/**
 * Wait ('await') for a specified amount of time.
 * @param {number} ms time in milliseconds to wait
 * @return {void}
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
export async function findAsyncSequential<T>(array: T[], predicate: (t: T) => Promise<boolean>): Promise<T | undefined> {
  for (const t of array) {
    // eslint-disable-next-line no-await-in-loop
    if (await predicate(t)) {
      return t;
    }
  }
  return null;
}
