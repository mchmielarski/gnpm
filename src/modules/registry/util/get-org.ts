import { Org } from '../entities';

export function getOrg(obj: any): Org | null {
  return obj ? obj.org : null;
}
