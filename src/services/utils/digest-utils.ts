import crypto from 'crypto';

// Delimeter to separate object items form each other
// when stringifying
const DELIMIT = '|';

/**
 * Stringifies a JSON object using sorted properties
 */
function stringify(obj: string | any[]) {
  if (Array.isArray(obj)) {
    const stringifiedArr = [];
    for (let i = 0; i < obj.length; i++) {
      stringifiedArr[i] = stringify(obj[i]);
    }

    return JSON.stringify(stringifiedArr);
  }
  if (typeof obj === 'object' && obj !== null) {
    const acc = [];
    const sortedKeys = Object.keys(obj).sort();

    for (let i = 0; i < sortedKeys.length; i++) {
      const k = sortedKeys[i];
      acc[i] = `${k}:${stringify(obj[k])}`;
    }

    return acc.join(DELIMIT);
  }

  return obj;
}

/**
 * Creates hash for a given JSON object.
 */
export function checksum(obj: any, algorithm = 'SHA256', digest: 'hex'|'base64' = 'hex') {
  const hash = crypto.createHash(algorithm);
  return hash.update(stringify(obj)).digest(digest);
}
