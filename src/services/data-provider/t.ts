import * as t from '@babel/types';

export const isIdentifier = (ast: t.Expression | t.PrivateName): ast is t.Identifier => ast.type === 'Identifier';

export const isBinaryExpression = (ast: t.Expression | t.PrivateName): ast is t.BinaryExpression => ast.type === 'BinaryExpression';
export const isMemberExpression = (ast: t.Expression | t.PrivateName): ast is t.MemberExpression => ast.type === 'MemberExpression';

export const isNumericLiteral = (ast: t.Expression | t.PrivateName): ast is t.NumericLiteral => ast.type === 'NumericLiteral';
export const isStringLiteral = (ast: t.Expression | t.PrivateName): ast is t.StringLiteral => ast.type === 'StringLiteral';
export const isBooleanLiteral = (ast: t.Expression | t.PrivateName): ast is t.BooleanLiteral => ast.type === 'BooleanLiteral';
export const isNullLiteral = (ast: t.Expression | t.PrivateName): ast is t.NullLiteral => ast.type === 'NullLiteral';

export const isArrayExpression = (ast: t.Expression): ast is t.ArrayExpression => ast.type === 'ArrayExpression';
export const isCallExpression = (ast: t.Expression): ast is t.CallExpression => ast.type === 'CallExpression';
export const isLogicalExpression = (ast: t.Expression | t.PrivateName): ast is t.LogicalExpression => ast.type === 'LogicalExpression';
export const isUnaryExpression = (ast: t.Expression): ast is t.UnaryExpression => ast.type === 'UnaryExpression';
export const isThisExpression = (ast: t.Expression): ast is t.ThisExpression => ast.type === 'ThisExpression';
export const isConditionalExpression = (ast: t.Expression): ast is t.ConditionalExpression => ast.type === 'ConditionalExpression';

export const isV8IntrinsicIdentifier = (node: t.Expression | t.V8IntrinsicIdentifier): node is t.V8IntrinsicIdentifier => node.type === 'V8IntrinsicIdentifier';

export type Expression = t.Expression;
export type PrivateName = t.PrivateName;
