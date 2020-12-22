/**
 * Throws an error if the value parameter is not defined.
 * @param {string} value the value that should not be null
 * @param {string} name the name of the parameter/variable to use in the error
 */
export function requireValue(value: string, name: string): void {
  if (value === undefined || value === '') throw new Error(`A value for ${name} was not provided.`);
}

// Coerce anything into an array
export function arrify(any) {
  // eslint-disable-next-line no-nested-ternary
  return any ? (Array.isArray(any) ? any : [any]) : [];
}
