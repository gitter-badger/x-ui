export type Functions = {
  [key: string]: Function;
};

const functions: Functions = {

};

export const registerFunction = (name: string, func: Function) => {
  functions[name] = func;
};

export const registerFunctions = (funcs: { [key: string]: Function }) => {
  Object.keys(funcs)
    // eslint-disable-next-line no-return-assign
    .forEach((key) => functions[key] = funcs[key]);
};

export const getFunction = (name: string): Function => {
  if (functions[name]) {
    return functions[name];
  }
  throw new Error(`Function(${name}) does not exist.`);
};
