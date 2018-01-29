import { not } from './not';
import { isNothing } from './is-nothing';

export function isSomething(value: any): boolean {
  return not(isNothing(value));
}
