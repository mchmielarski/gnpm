import { eq } from './eq';

export function isTrue(val: any): boolean {
  return eq(val, true);
}
