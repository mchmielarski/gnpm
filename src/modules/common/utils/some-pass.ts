import { isSomething } from './is-something';

export function somePass<T>(predicates: ((item: T) => boolean)[], item: T): boolean;
export function somePass<T>(predicates: ((item: T) => boolean)[]): (item: T) => boolean;
export function somePass<T>(
  predicates: ((item: T) => boolean)[],
  item?: T
): boolean | ((item: T) => boolean) {
  if (arguments.length === 1) {
    return (item2: T) => somePass(predicates, item2);
  }
  const length = isSomething(predicates) ? predicates.length : 0;
  let index = -1;

  while (++index < length) {
    if (predicates[index](item as T)) {
      return true;
    }
  }
  return false;
}
