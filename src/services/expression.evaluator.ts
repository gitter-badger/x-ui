import { requireValue } from './utils';
import { IProviderFactory } from './provider.factory';

const expressionRegEx = /{([\w-]*):([\w-\.]*)}/gi;

export class ExpressionEvaluator {

  constructor(
    private providerFactory: IProviderFactory) {

  }

  async getValueFromExpression(valueExpression: string): Promise<string|null>{
    requireValue(valueExpression, 'valueExpression');

    // if this expression doesn't match, leave it alone
    if(!valueExpression.match(expressionRegEx))
      return valueExpression;

    // make a copy to avoid side effects
    let result = valueExpression.slice();

    // replace each match
    var match: string | RegExpExecArray;
    while (match = expressionRegEx.exec(valueExpression)) {
      let expression = match[0];
      let providerKey = match[1];
      let dataKey = match[2];
      let provider = this.providerFactory.getProvider(providerKey);
      let value = await provider?.get(dataKey);
      if(value == null)
        result = null
      else
        result = result.replace(expression, value);
    }
    return result || null;
  }

}
