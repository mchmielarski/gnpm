import { isSomething } from './is-something';

export function first<T>(items: T[]): T {
  return isSomething(items[0]) ? items[0] : null;
}
