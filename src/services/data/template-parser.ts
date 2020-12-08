import { warn } from '../logging';
import { checksum } from '../utils/digest-utils';
import { resolveExpression } from './expression-evaluator';

const tokenTypes = {
  UNDEFINED: 0,
  VAR: 1,
  NESTED_VAR: 2,
  IF: 3,
  ENDIF: 4,
};

const memoryCache = new Map();

class Parser {
  parseToken(token: { type: string; value: any }, data: any) {
    return this[`parseToken${token.type}`](token.value, data);
  }

  // VAR
  parseToken1(value: string | number, data: { [x: string]: { toString: () => any } }) {
    if (data[value] === undefined) {
      return '';
    }
    return data[value].toString();
  }

  // NESTED_VAR
  parseToken2(value: string, data: any) {
    const parts = value.split('.');
    const l = parts.length;
    let curNestData = JSON.parse(data || '{}');
    for (let k = 0; k < l; k++) {
      if (curNestData[parts[k]] === undefined) {
        return '';
      }
      curNestData = curNestData[parts[k]];
    }
    return curNestData;
  }

  // IF
  parseToken3() {
    return 'if';
  }

  // ENDIF
  parseToken4() {
    return 'endif';
  }
}

const parser = new Parser();

function getTokenTypeByValue(value: string | string[]) {
  if (value.indexOf('if') === 0) {
    return tokenTypes.IF;
  } if (value === 'endif') {
    return tokenTypes.ENDIF;
  } if (value.indexOf('.') !== -1) {
    return tokenTypes.NESTED_VAR;
  }
  return tokenTypes.VAR;
}

// gets next token from an HTML string starting at startAt position
// if no more tokens found - returns false
// if token is not closed with }} - throws a SyntaxError
// if token is found - returns an object:
// {
//   value: string - contents of expression between {{ }},
//   startsAt: position of {{
//   endsAt: position of }}
//   length: total length of expression starting from the first "{" and ending with last "}"
// }
function getNextToken(template: string, startAt = 0) {
  let startPos = template.indexOf('{{', startAt);
  if (startPos === -1) {
    return false;
  }
  let endPos = template.indexOf('}}', startPos);
  if (endPos === -1) {
    throw new SyntaxError('Template expression is not closed with }}');
  }
  startPos += 2;
  const value = template.substr(startPos, endPos - startPos).trim();
  startPos -= 2;
  endPos += 2;
  return {
    type: getTokenTypeByValue(value),
    value,
    startsAt: startPos,
    endsAt: endPos,
    length: endPos - startPos,
  };
}

// get all the strings within {{ }} in template root node
function getTokens(template: string) {
  const cacheKey = `tokens:${checksum(template)}}`;

  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  let token: any = false;
  const tokens = [];
  let startAt = 0;
  // eslint-disable-next-line no-cond-assign
  while (token = getNextToken(template, startAt)) {
    tokens.push(token);
    startAt = token.endsAt;
  }
  return tokens;
}

export function resolveTemplate(template: string, data: any): string {
  let results = template.slice();
  const cacheKey = `${checksum(data)}:${checksum(results)}`;

  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  const tokens = getTokens(results);
  let delta = 0; // when replacing tokens, increase/decrease delta length so next token would be replaced in correct position of html
  tokens.forEach((token) => {
    const replaceWith = parser.parseToken(token, data);
    // eslint-disable-next-line no-param-reassign
    results = results.substr(0, token.startsAt - delta) + replaceWith + results.substr(token.endsAt - delta);
    delta += token.length - replaceWith.length;
  });

  memoryCache.set(cacheKey, results);
  return results;
}

export async function resolveTemplateFromElementData(
  element: HTMLElement,
  template: string): Promise<string> {
  if (template === undefined || template === '') return <string>null;

  const data = {};
  const tokens = getTokens(template);

  // distinct token values; only the first part if there's dot-notation
  const promises = [...new Set(tokens.filter((t) => t.type === 1 || t.type === 2)
    .map((t: { value: string; }) => t.value.split('.')[0]))]
    .map(async (v:string) => {
      const attr = element.getAttribute(`data-${v}`);
      if (attr) {
        const val = await resolveExpression(attr);
        data[v] = val;
      }
      return null;
    });

  await Promise.all(promises);

  return resolveTemplate(template, data);
}
