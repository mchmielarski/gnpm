import { User } from '../entities';

export function getUser(obj: any): User | null {
  return obj ? obj.user : null;
}
