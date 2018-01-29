import { eq } from './eq';

export function isFalse(val: any): boolean {
  return eq(val, false);
}
