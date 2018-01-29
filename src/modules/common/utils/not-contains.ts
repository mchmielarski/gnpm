import { contains } from './contains';
import { not } from './not';

export function notContains<T>(item: T): (items: T[]) => boolean;
export function notContains<T>(item: T, items: T[]): boolean;
export function notContains<T>(item: T, items?: T[]): boolean | ((items: T[]) => boolean) {
  if (arguments.length === 1) {
    return (items2: T[]) => notContains(item, items2);
  }
  return not(contains(item, items));
}
