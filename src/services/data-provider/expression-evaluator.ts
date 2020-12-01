/* eslint-disable default-case */
/* eslint-disable eqeqeq */
import { parseExpression } from '@babel/parser';
import { requireValue } from '../utils';
import * as t from './t';
import { getFunction } from './functions-factory';
import { getProvider } from './provider-factory';

export type HandlerTypes =
  | 'BinaryExpression'
  | 'NumericLiteral'
  | 'StringLiteral'
  | 'BooleanLiteral'
  | 'ArrayExpression'
  | 'NullLiteral'
  | 'Identifier'
  | 'CallExpression'
  | 'MemberExpression'
  | 'LogicalExpression'
  | 'UnaryExpression'
  | 'ThisExpression'
  | 'ConditionalExpression';

export type Context = {
  [key: string]: any;
};

const Handlers = {
  evaluate(code: t.Expression | t.PrivateName, context: Context) {
    return this[code.type as HandlerTypes](code, context);
  },
  BinaryExpression(ast: t.Expression, context: Context) {
    if (t.isBinaryExpression(ast)) {
      switch (ast.operator) {
        case '+':
          return this.evaluate(ast.left, context) + this.evaluate(ast.right, context);
        case '-':
          return this.evaluate(ast.left, context) - this.evaluate(ast.right, context);
        case '*':
          return this.evaluate(ast.left, context) * this.evaluate(ast.right, context);
        case '/':
          return this.evaluate(ast.left, context) / this.evaluate(ast.right, context);
        case '===':
          return this.evaluate(ast.left, context) === this.evaluate(ast.right, context);
        case '==':
          return this.evaluate(ast.left, context) == this.evaluate(ast.right, context);
        case '!==':
          return this.evaluate(ast.left, context) !== this.evaluate(ast.right, context);
        case '!=':
          return this.evaluate(ast.left, context) != this.evaluate(ast.right, context);
        case '>':
          return this.evaluate(ast.left, context) > this.evaluate(ast.right, context);
        case '>=':
          return this.evaluate(ast.left, context) >= this.evaluate(ast.right, context);
        case '<':
          return this.evaluate(ast.left, context) < this.evaluate(ast.right, context);
        case '<=':
          return this.evaluate(ast.left, context) <= this.evaluate(ast.right, context);
        case 'in': {
          const right = this.evaluate(ast.right, context);
          if (!right) return false;
          if (typeof right === 'object' && right instanceof Array) {
            return right.indexOf(this.evaluate(ast.left, context)) !== -1;
          }
          if (typeof right === 'string') {
            return right.includes(this.evaluate(ast.left, context));
          }
          return false;
        }
      }
    }
    throw new Error();
  },

  ConditionalExpression(ast: t.Expression, context: Context) {
    if (t.isConditionalExpression(ast)) {
      return this.evaluate(ast.test, context) ? this.evaluate(ast.consequent, context) : this.evaluate(ast.alternate, context);
    }
    throw new Error();
  },

  LogicalExpression(ast: t.Expression, context: Context): boolean {
    if (t.isLogicalExpression(ast)) {
      switch (ast.operator) {
        case '&&':
          return this.evaluate(ast.left, context) && this.evaluate(ast.right, context);
        case '||':
          return this.evaluate(ast.left, context) || this.evaluate(ast.right, context);
      }
    }
    throw new Error();
  },

  UnaryExpression(ast: t.Expression, context: Context): boolean | number {
    if (t.isUnaryExpression(ast)) {
      switch (ast.operator) {
        case '!':
          return !this.evaluate(ast.argument, context);
        case '-':
          return -this.evaluate(ast.argument, context);
      }
    }
    throw new Error();
  },

  Identifier(ast: t.Expression, context: Context) {
    if (t.isIdentifier(ast)) {
      switch (ast.name) {
        case 'undefined':
          return undefined;
        default:
          return context[ast.name];
      }
    }
    throw new Error();
  },

  CallExpression(ast: t.Expression, context: Context) {
    if (t.isCallExpression(ast)) {
      if (!t.isV8IntrinsicIdentifier(ast.callee) && t.isIdentifier(ast.callee)) {
        const func = getFunction(ast.callee.name);
        const args: t.Expression[] = ast.arguments.map((arg) => this.evaluate(arg as t.Expression, context));
        return func.call(null, ...args);
      }
    }
    throw new Error();
  },

  MemberExpression(ast: t.Expression, context: Context) {
    if (t.isMemberExpression(ast)) {
      const obj = this.evaluate(ast.object, context);
      if (!obj) return undefined;
      if (t.isIdentifier(ast.property)) {
        return this.evaluate(ast.property, obj);
      }
      if (t.isMemberExpression(ast.property)) {
        return obj[this.evaluate(ast.property, context)];
      }
      if (t.isNumericLiteral(ast.property) || t.isStringLiteral(ast.property)) {
        return obj[ast.property.value];
      }
      if ((t.isBinaryExpression(ast.property) || t.isLogicalExpression(ast.property)) && typeof obj.filter === 'function') {
        return obj.filter((item: {}) => this.evaluate(ast.property, { context, __scope: item }));
      }
    }
    throw new Error();
  },

  ThisExpression(ast: t.Expression, context: Context) {
    if (t.isThisExpression(ast)) {
      // eslint-disable-next-line no-underscore-dangle
      return context.__scope;
    }
    throw new Error();
  },

  NumericLiteral(ast: t.Expression) {
    if (t.isNumericLiteral(ast)) {
      return ast.value;
    }
    throw new Error();
  },

  StringLiteral(ast: t.Expression) {
    if (t.isStringLiteral(ast)) {
      return ast.value;
    }
    throw new Error();
  },

  BooleanLiteral(ast: t.Expression) {
    if (t.isBooleanLiteral(ast)) {
      return ast.value;
    }
    throw new Error();
  },

  NullLiteral(ast: t.Expression) {
    if (t.isNullLiteral(ast)) {
      return null;
    }
    throw new Error();
  },

  ArrayExpression(ast: t.Expression, context: Context) {
    if (t.isArrayExpression(ast)) {
      return ast.elements.map((elem) => this.evaluate(elem as t.Expression, context));
    }
    throw new Error();
  },
};

function evaluate(code: string, context: Context) {
  const ast = parseExpression(code, { tokens: true }) as t.Expression;
  return Handlers[ast.type as HandlerTypes](ast, context);
}

const expressionRegEx = /{([\w-]*):([\w-.]*)}/gi;

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
    const provider = getProvider(providerKey);
    // eslint-disable-next-line no-await-in-loop
    const value = await provider?.get(dataKey);
    if (value == null) result = null;
    else result = result.replace(expression, value);
  }
  return result || null;
}

export async function evaluateExpression(expression: string): Promise<any> {
  const detokenizedExpression = await resolveExpression(expression);
  return evaluate(detokenizedExpression, {});
}

export async function evaluatePredicate(expression: string) {
  const result = await evaluateExpression(expression) === true;
  return result === true;
}
