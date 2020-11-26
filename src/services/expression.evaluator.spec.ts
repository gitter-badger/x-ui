//import { ProviderFactory } from './provider.factory';
import { ExpressionEvaluator } from './expression.evaluator';
import { MockDataProvider } from './mocks/mock.provider';
import { IDataProvider } from '../../dist/types/types/interfaces';



describe('expression.evaluator:session', () => {
  var expressionEvaluator: ExpressionEvaluator;

  var session: MockDataProvider;
  var storage: MockDataProvider;

  beforeEach(() => {
    session = new MockDataProvider();
    storage = new MockDataProvider();

    const mockFactory = {
      getProvider(key: string): IDataProvider {
        return key == "session" ? session : storage
      }
    }

    expressionEvaluator = new ExpressionEvaluator(mockFactory);
  })

  it('returns null for non-existent value', async () => {
    let value = await expressionEvaluator.getValueFromExpression('{session:name}');
    expect(value).toBe(null);
  });

  it('returns the literal string if no expression is detected', async () => {
    let value = await expressionEvaluator.getValueFromExpression('my_value');
    expect(value).toBe('my_value');
  });

  it('returns the right value for a good expression', async () => {
    await session.set('name', 'biden')
    let value = await expressionEvaluator.getValueFromExpression('{session:name}');
    expect(value).toBe('biden');
  });

  it('replaces multiple expressions in the same string', async () => {
    await session.set('rate', '1');
    await session.set('vintage', '1985')
    let value = await expressionEvaluator.getValueFromExpression('${session:rate} in {session:vintage}');
    expect(value).toBe('$1 in 1985');
  });

});
