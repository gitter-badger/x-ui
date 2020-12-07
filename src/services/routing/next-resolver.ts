import { findAsyncSequential } from '../utils/promise-utils';
import { evaluatePredicate } from '../data';
import { IViewDo } from './interfaces';

async function shouldVisit(item:IViewDo) {
  return (item.when) ? evaluatePredicate(item.when) : true;
}

export async function resolveNext(doList: Array<IViewDo>): Promise<IViewDo|null> {
  const filtered = doList.filter((d) => d.when || !d.visited);
  const found = await findAsyncSequential(filtered, shouldVisit);
  return found || null;
}
