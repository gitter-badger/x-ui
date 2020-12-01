import { evaluateExpression, evaluatePredicate, resolveExpression  } from './expression-evaluator';
import { InMemoryProvider } from './provider-memory';
import { addProvider } from './provider-factory';

describe('resolveExpression', () => {

  var session: InMemoryProvider;
  var storage: InMemoryProvider;

  beforeEach(() => {
    session = new InMemoryProvider();
    storage = new InMemoryProvider();

    addProvider('session', session);
    addProvider('storage', storage);
  });

  it(' returns null for non-existent value', async () => {
    let value = await resolveExpression('{session:name}');
    expect(value).toBe(null);
  });

  it(' returns the literal string if no expression is detected', async () => {
    let value = await resolveExpression('my_value');
    expect(value).toBe('my_value');
  });

  it('returns the right value for a good expression', async () => {
    await session.set('name', 'biden')
    let value = await resolveExpression('{session:name}');
    expect(value).toBe('biden');
  });

  it('replaces multiple expressions in the same string', async () => {
    await session.set('rate', '1');
    await session.set('vintage', '1985')
    let value = await resolveExpression('${session:rate} in {session:vintage}');
    expect(value).toBe('$1 in 1985');
  });
});

describe('evaluateExpression', () => {

  var session: InMemoryProvider;
  var storage: InMemoryProvider;

  beforeEach(() => {
    session = new InMemoryProvider();
    storage = new InMemoryProvider();

    addProvider('session', session);
    addProvider('storage', storage);
  });

  it('simple math', async () => {
    let value = await evaluateExpression('1+1');
    expect(value).toBe(2);
  });

  it('simple predicate', async () => {
    let value = await evaluateExpression('1+1==2');
    expect(value).toBe(true);
  });

  it('simple expression with data-provider values', async () => {
    await session.set('rate', '1');
    await session.set('vintage', '1985')
    let value = await evaluateExpression('{session:rate} + {session:vintage}');
    expect(value).toBe(1986);
  });

});

describe('evaluatePredicate', () => {

  var session: InMemoryProvider;
  var storage: InMemoryProvider;

  beforeEach(() => {
    session = new InMemoryProvider();
    storage = new InMemoryProvider();

    addProvider('session', session);
    addProvider('storage', storage);
  });

  it('simple predicate with data-provider values', async () => {
    await session.set('a', '1');
    await session.set('b', '1985')
    let value = await evaluatePredicate('{session:b} > {session:a}');
    expect(value).toBe(true);
  });

  it('simple predicate with data-provider values reversed', async () => {
    await session.set('a', '1');
    await session.set('b', '1985')
    let value = await evaluatePredicate('{session:a} > {session:b}');
    expect(value).toBe(false);
  });

});
