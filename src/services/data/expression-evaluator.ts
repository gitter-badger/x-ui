import { Parser } from 'expr-eval';
import { requireValue } from '../utils/misc-utils';
import { getProvider } from './provider-factory';
import { ExpressionContext } from './interfaces';
import { warn } from '../logging';
import { toBoolean } from '../utils/string-utils';

const expressionRegEx = /{([\w-]*):([\w_]*)(?:\.([\w_.]*))?(?:\?([\w_.]*))?}/g;
const expressionEvaluator = new Parser();

/**
 * This function replaces all {provider:key} values with the actual values
 * from the expressed provider & key. This is used by {evaluateExpression}
 * before it is sent to {evaluate} for calculation.
 *
 * @export resolveExpression
 * @param {string} valueExpression
 * @return {*}  {(Promise<string|null>)}
 */
export async function resolveExpression(valueExpression: string): Promise<string|null> {
  requireValue(valueExpression, 'valueExpression');

  // if this expression doesn't match, leave it alone
  if (!valueExpression.match(expressionRegEx)) {
    return valueExpression;
  }

  // make a copy to avoid side effects
  let result = valueExpression.slice();

  if (result == null || '') return result;

  // replace each match
  let match: string | RegExpExecArray;
  // eslint-disable-next-line no-cond-assign
  while (match = expressionRegEx.exec(valueExpression)) {
    const expression = match[0];
    const providerKey = match[1];
    const dataKey = match[2];
    const propKey = match[3] || null;
    const defaultValue = match[4] || '';
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
    } else {
      result = result.replace(expression, defaultValue);
    }
  }
  return result || null;
}

/**
 * This base expression parsing is performed by the library: expr-eval
 * Documentation: https://github.com/silentmatt/expr-eval
 *
 * @export evaluate
 * @param {string} expression A js-based expression for value comparisons or calculations
 * @param {object} context An object holding any variables for the expression.
 */
export function evaluate(expression: string, context:ExpressionContext = {}): number|boolean|string {
  requireValue(expression, 'expression');
  try {
    return expressionEvaluator.evaluate(expression.toLowerCase(), context);
  } catch (err) {
    warn(`An exception was raised evaluating expression '${expression}': ${err}`, err);
    return expression;
  }
}

/**
 * This function first resolves any data-tokens, then passes the response to the
 * {evaluate} function.
 *
 * @export evaluateExpression
 * @param {string} expression
 * @param {*} [context={}]
 * @return {*}  {Promise<any>}
 */
export async function evaluateExpression(expression: string, context: ExpressionContext = {}): Promise<any> {
  requireValue(expression, 'expression');
  const detokenizedExpression = await resolveExpression(expression);
  return evaluate(detokenizedExpression, context);
}

/**
 * This function first resolves any data-tokens, then passes the response to the
 * {evaluate} function, but uses the value to determine a true/false.
 *
 * @export
 * @param {string} expression
 * @param {ExpressionContext} [context={}]
 * @return {*}  {Promise<boolean>}
 */
export async function evaluatePredicate(expression: string, context:ExpressionContext = {}): Promise<boolean> {
  const result = await evaluateExpression(expression, context);
  return toBoolean(result);
}
