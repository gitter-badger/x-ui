import { findAsyncSequential } from '../utils/promise-utils';
import { evaluatePredicate } from '../data';
import { IViewDo } from './interfaces';
// import { debug } from '../logging';

async function shouldVisit(item:IViewDo) {
  if (item.when) {
    const when = await evaluatePredicate(item.when);
    return when;
  } return true;
}

export async function resolveNext(doList: Array<IViewDo>): Promise<IViewDo|null> {
  const filtered = doList.filter((d) => d.when || !d.visited);
  // debug(`Filtered: ${JSON.stringify(filtered)}`);
  const found = await findAsyncSequential(filtered, shouldVisit);
  // debug(`Found do: ${JSON.stringify(found)}`);
  return found || null;
}
