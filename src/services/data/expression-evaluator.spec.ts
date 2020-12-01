import { evaluate, evaluateExpression, evaluatePredicate, resolveExpression  } from './expression-evaluator';
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

  it('returns null for non-existent value', async () => {
    let value = await resolveExpression('{session:name}');
    expect(value).toBe(null);
  });

  it('returns the literal string if no expression is detected', async () => {
    let value = await resolveExpression('my_value');
    expect(value).toBe('my_value');
  });

  it('returns the right value for a good expression', async () => {
    await session.set('name', 'biden')
    let value = await resolveExpression('{session:name}');
    expect(value).toBe('biden');
  });

  it('returns the right value for a JSON expression', async () => {
    await session.set('user', '{"name":"Joe"}')
    let value = await resolveExpression('{session:user.name}');
    expect(value).toBe('Joe');
  });

  it('returns the right value for a deep JSON expression', async () => {
    await session.set('user', '{"name": { "first":"Joe"}}')
    let value = await resolveExpression('{session:user.name.first}');
    expect(value).toBe('Joe');
  });


  it('replaces multiple expressions in the same string', async () => {
    await session.set('rate', '1');
    await session.set('vintage', '1985')
    let value = await resolveExpression('${session:rate} in {session:vintage}');
    expect(value).toBe('$1 in 1985');
  });
});

describe('evaluate', () => {

  it('evaluates simple math', async () => {
    let value = await evaluate('1 + 1');
    expect(value).toBe(2);
  });

  it('evaluates simple predicate', async () => {
    let value = await evaluate('2 == 2');
    expect(value).toBe(true);
  });

  it('evaluates string comparison expression', async () => {
    let value = await evaluate('"word" == "word"');
    expect(value).toBe(true);
  });

  it('evaluates string comparison expression (false)', async () => {
    let value = await evaluate('"word" != "word"');
    expect(value).toBe(false);
  });

  it('evaluates value in array expression', async () => {
    let value = await evaluate('1 in [1,2,3]');
    expect(value).toBe(true);
  });

  it('evaluates value in array expression (false)', async () => {
    let value = await evaluate('4 in [1,2,3]');
    expect(value).toBe(false);
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

  it('evaluates simple math', async () => {
    let value = await evaluateExpression('1+1');
    expect(value).toBe(2);
  });

  it('evaluates simple predicate', async () => {
    let value = await evaluateExpression('2==2');
    expect(value).toBe(true);
  });

  it('evaluates simple expression with data-provider values', async () => {
    await session.set('rate', '1');
    await session.set('vintage', '1985')
    let value = await evaluateExpression('{session:rate} + {session:vintage}');
    expect(value).toBe(1986);
  });

  it('evaluates array in expression', async () => {
    await session.set('items', '["foo","boo"]')
    await session.set('item', 'foo')
    let value = await evaluateExpression('"{session:item}" in {session:items}');
    expect(value).toBe(true);
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

  it('evaluates simple predicate with data-provider values', async () => {
    await session.set('a', '1');
    await session.set('b', '1985')
    let value = await evaluatePredicate('{session:a} < {session:b}');
    expect(value).toBe(true);
  });

  it('evaluates simple predicate with data-provider values reversed', async () => {
    await session.set('a', '1985');
    await session.set('b', '1')
    let value = await evaluatePredicate('{session:a} > {session:b}');
    expect(value).toBe(true);
  });

  it('evaluates simple predicate with data-provider values equal', async () => {
    await session.set('a', '5');
    await session.set('b', '5');
    let value = await evaluatePredicate('{session:a} == {session:b}');
    expect(value).toBe(true);
  });

  it('evaluates simple predicate with data-provider values not equal', async () => {
    await session.set('a', '5');
    await session.set('b', '5');
    let value = await evaluatePredicate('{session:a} != {session:b}');
    expect(value).toBe(false);
  });

  it('evaluates string predicate with data-provider values equal', async () => {
    await session.set('a', 'foo');
    let value = await evaluatePredicate('"{session:a}" == "foo"');
    expect(value).toBe(true);
  });

  it('string predicate with data-provider values not equal', async () => {
    await session.set('a', 'foo');
    let value = await evaluatePredicate('"{session:a}" != "foo"');
    expect(value).toBe(false);
  });

  it('evaluates string includes', async () => {
    await session.set('a', 'foo');
    let value = await evaluatePredicate('"f" in "{session:a}"');
    expect(value).toBe(true);
  });

  it('evaluates string includes false', async () => {
    await session.set('a', 'foo');
    let value = await evaluatePredicate('"d" in "{session:a}"');
    expect(value).toBe(false);
  });


});