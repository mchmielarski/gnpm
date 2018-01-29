import { isSomething } from './is-something';

export function contains<T>(item: T): (items: T[]) => boolean;
export function contains<T>(item: T, items: T[]): boolean;
export function contains<T>(item: T, items?: T[]): boolean | ((items: T[]) => boolean) {
  if (arguments.length === 1) {
    return (items2: T[]) => contains(item, items2);
  }

  return isSomething(items) ? items.indexOf(item) > -1 : false;
}
