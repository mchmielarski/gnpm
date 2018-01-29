import { notEq } from './not-eq';

export function set<T, P extends keyof T>(obj: T, key: string, value: T[P]) {
  obj[key] = value;
}
