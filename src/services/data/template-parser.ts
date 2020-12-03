import { stringToHash } from '../utils/string-utils';
/* eslint-disable @typescript-eslint/no-unused-vars */
const tokenTypes = {
  UNDEFINED: 0,
  VAR: 1,
  NESTED_VAR: 2,
  IF: 3,
  ENDIF: 4,
};

const memoryCache = {};

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
  parseToken3(_value: any, _data: any) {
    return 'if';
  }

  // ENDIF
  parseToken4(_value: any, _data: any) {
    return 'endif';
  }
}

const parser = new Parser();

function getRootNode(content: { childNodes: any }) {
  const nodes = content.childNodes;
  const l = nodes.length;
  for (let k = 0; k < l; k++) {
    const node = nodes[k];
    if (node.nodeType === Node.ELEMENT_NODE) {
      return node;
    }
  }
  throw new SyntaxError('Template has no root element node');
}

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
function getNextToken(html: string, startAt = 0) {
  let startPos = html.indexOf('{{', startAt);
  if (startPos === -1) {
    return false;
  }
  let endPos = html.indexOf('}}', startPos);
  if (endPos === -1) {
    throw new SyntaxError('Template expression is not closed with }}');
  }
  startPos += 2;
  const value = html.substr(startPos, endPos - startPos).trim();
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
export function getTokens(content: { childNodes: any }) {
  const node = getRootNode(content);
  let token: any = false;
  const tokens = [];
  let startAt = 0;
  // eslint-disable-next-line no-cond-assign
  while (token = getNextToken(node.outerHTML, startAt)) {
    tokens.push(token);
    startAt = token.endsAt;
  }
  return tokens;
}

export function evaluateHTML(content: { childNodes: any }, data: any): string {
  let html = getRootNode(content).outerHTML;
  const cacheKey = stringToHash(`${JSON.stringify(data)}:${html}`);

  if (memoryCache[cacheKey]) return memoryCache[cacheKey];

  const tokens = getTokens(content);
  let delta = 0; // when replacing tokens, increase/decrease delta length so next token would be replaced in correct position of html
  tokens.forEach((token) => {
    const replaceWith = parser.parseToken(token, data);
    // eslint-disable-next-line no-param-reassign
    html = html.substr(0, token.startsAt - delta) + replaceWith + html.substr(token.endsAt - delta);
    delta += token.length - replaceWith.length;
  });

  memoryCache[cacheKey] = html;
  return html;
}
