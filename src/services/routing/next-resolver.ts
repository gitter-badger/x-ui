import { findAsyncSequential } from '../utils';
import { evaluatePredicate } from '../data';
import { IViewDo, VisitStrategy } from './interfaces';

async function shouldVisit(item:IViewDo) {
  if (item.when) {
    const when = await evaluatePredicate(item.when);
    return when;
  } return true;
}

export async function resolveNext(doList: Array<IViewDo>): Promise<IViewDo|null> {
  const found = await findAsyncSequential(doList
    .filter((d) => d.visited === false && d.visit !== VisitStrategy.optional), shouldVisit);
  return found || null;
}
