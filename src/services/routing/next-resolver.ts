import { findAsyncSequential } from '../utils/promise-utils';
import { evaluatePredicate } from '../data';
import { IViewDo, VisitStrategy } from './interfaces';

async function shouldVisit(item:IViewDo) {
  return (item.when) ? evaluatePredicate(item.when) : true;
}

export async function resolveNext(doList: Array<IViewDo>): Promise<IViewDo|null> {
  const filtered = doList.filter((d) => d.visit !== VisitStrategy.optional && (!d.visited || d.when));
  const found = await findAsyncSequential(filtered, shouldVisit);
  return found || null;
}
