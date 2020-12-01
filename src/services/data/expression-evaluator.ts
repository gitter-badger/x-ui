import { Parser } from 'expr-eval';
import { requireValue } from '../utils';
import { getProvider } from './provider-factory';

const expressionRegEx = /{([\w-]*):([\w_]*)(?:\.([\w_.]*))?}/g;
const expressionEvaluator = new Parser();

export async function evaluate(expression: string): Promise<any> {
  return expressionEvaluator.evaluate(expression, {});
}

export async function resolveExpression(valueExpression: string): Promise<string|null> {
  requireValue(valueExpression, 'valueExpression');

  // if this expression doesn't match, leave it alone
  if (!valueExpression.match(expressionRegEx)) {
    return valueExpression;
  }

  // make a copy to avoid side effects
  let result = valueExpression.slice();

  // replace each match
  let match: string | RegExpExecArray;
  // eslint-disable-next-line no-cond-assign
  while (match = expressionRegEx.exec(valueExpression)) {
    const expression = match[0];
    const providerKey = match[1];
    const dataKey = match[2];
    const propKey = match[3] || null;
    const provider = getProvider(providerKey);
    // eslint-disable-next-line no-await-in-loop
    let value = await provider?.get(dataKey);
    if (value != null) {
      if (propKey) {
        const obj = JSON.parse(value || '{}');
        const propSegments = propKey.split('.');
        let node = obj;
        propSegments.forEach((property) => {
          node = node[property];
        });
        value = `${node}`;
      }
      result = result.replace(expression, value);
    } else result = null;
  }
  return result || null;
}

export async function evaluateExpression(expression: string): Promise<any> {
  const detokenizedExpression = await resolveExpression(expression);
  return expressionEvaluator.evaluate(detokenizedExpression, {});
}

export async function evaluatePredicate(expression: string): Promise<boolean> {
  const result = await evaluateExpression(expression) === true;
  return result === true;
}
