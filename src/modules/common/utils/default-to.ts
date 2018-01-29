import { isNothing } from './is-nothing';

export function defaultTo<T, P>(defaultValue: T): (value: P | undefined) => T | P;
export function defaultTo<T, P>(defaultValue: T, value: P | undefined): T | P;
export function defaultTo<T, P>(defaultValue: T, value?: P | undefined) {
  if (arguments.length === 1) {
    return (value2: P) => defaultTo(defaultValue, value2);
  }
  return isNothing(value) ? defaultValue : value;
}
