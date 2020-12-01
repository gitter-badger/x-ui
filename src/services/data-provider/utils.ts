const operators = ['=', '+', '-', '*', '/', '>', '<', '>=', '<=', '==', '!='];
export function isOp(v: string) {
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === v) return true;
  }
  return false;
}

export function isNum(v: string) {
  return !Number.isNaN(parseFloat(v)) && Number.isFinite(v);
}

export enum DataType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  date = 'date'
}

export function coerce(value:any, type: DataType) : string|boolean|number|Date {
  switch (type) {
    case DataType.boolean:
      return Boolean(value);
    case DataType.number:
      return Number(value);
    case DataType.date:
      return Date.parse(value);
    default:
      return `${value}`;
  }
}
