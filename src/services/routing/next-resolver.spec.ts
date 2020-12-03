import { InMemoryProvider, addProvider } from '..';
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
      when: '"{session:name}" == null',
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
      when: '"{session:name}" == null',
      visited: true,
      path: 'me'
    };

    toDos.push(todo);

    const result = await resolveNext(toDos);
    expect(result).toBe(null);
  });

  it('find next with one restricted one item visited', async () => {
    await session.set('name', 'biden')

    const todo1 = {
      visit: VisitStrategy.always,
      when: '"{session:name}" == null',
      visited: true,
      path: 'me'
    };
    const todo2 = {
      visit: VisitStrategy.always,
      unless: '"{session:name}" == null',
      visited: false,
      path: 'me'
    };

    toDos.push(todo1, todo2);

    const result = await resolveNext(toDos);
    expect(result).toBe(null);
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

  it('all are visited or optional', async () => {

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
    expect(result).toBe(null);
  });


});
