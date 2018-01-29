import { eq } from './eq';
import { not } from './not';

export function notEq(v1: any, v2: any): boolean {
  return not(eq(v1, v2));
}
