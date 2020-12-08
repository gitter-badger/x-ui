jest.mock('../logging');

import { InMemoryProvider, addProvider } from '..';
import { evaluatePredicate } from '../data';
import { IViewDo, VisitStrategy } from './interfaces';
import { resolveNext } from './next-resolver';

describe('next-resolver', () => {
  let toDos:Array<IViewDo>;
  var session: InMemoryProvider;
  beforeEach(() => {
    session = new InMemoryProvider();
    addProvider('session', session);
    toDos = [];
  });

  it('find next with only one item', async () => {
    await session.set('name', 'biden')

    const todo = {
      visit: VisitStrategy.always,
      when: '"{session:name}" != empty',
      visited: false,
      path: 'me'
    };

    toDos.push(todo);

    const result = await resolveNext(toDos);
    expect(result).toBe(todo);
  });

  it('find next with only one item visited', async () => {
    await session.set('name', 'biden')

    const todo = {
      visit: VisitStrategy.always,
      when: '"{session:name}" !== empty',
      visited: true,
      path: 'me'
    };

    toDos.push(todo);

    const result = await resolveNext(toDos);
    expect(result).toBe(todo);
  });

  it('find next with visited restriction still applicable', async () => {
    await session.set('name', 'biden')

    const todo1 = {
      visit: VisitStrategy.always,
      when: '"{session:name}" != empty',
      visited: true,
      path: 'me'
    };

    toDos.push(todo1);

    const pred = await evaluatePredicate(todo1.when);
    expect(pred)
      .toBe(true);

    const result = await resolveNext(toDos);
    expect(result).toBe(todo1);
  });

  it('find next with all open, should give first', async () => {

    const todo1 = {
      visit: VisitStrategy.always,
      visited: false
    };
    const todo2 = {
      visit: VisitStrategy.always,
      visited: false
    };

    toDos.push(todo1, todo2);

    const result = await resolveNext(toDos);
    expect(result).toBe(todo1);
  });

  it('one visited and one optional', async () => {

    const todo1 = {
      visit: VisitStrategy.optional,
      visited: false
    };
    const todo2 = {
      visit: VisitStrategy.always,
      visited: false
    };

    toDos.push(todo1, todo2);

    const result = await resolveNext(toDos);
    expect(result).toBe(todo2);
  });

  it('all optional', async () => {

    const todo1 = {
      visit: VisitStrategy.optional,
      visited: false
    };
    const todo2 = {
      visit: VisitStrategy.optional,
      visited: false
    };

    toDos.push(todo1, todo2);

    const result = await resolveNext(toDos);
    expect(result).toBe(null);
  });


});
