import { defaultTo } from './default-to';
import { path } from './path';

export function pathOr<T, P extends keyof T>(
  defaultValue: T[P]
): (paths: string | string[], obj?: T) => T[P];
export function pathOr<T, P extends keyof T>(
  defaultValue: T[P],
  paths: string | string[]
): (obj: T) => T[P];
export function pathOr<T, P extends keyof T>(
  defaultValue: T[P],
  paths: string | string[],
  obj: T
): T[P];
export function pathOr<T, P extends keyof T>(
  defaultValue: T[P],
  paths?: string | string[],
  obj?: T
): T[P] | ((obj: T) => T[P]) | ((paths: string | string[], obj: T) => T[P]) {
  if (arguments.length === 1) {
    return (paths2: string | string[], obj2: T) => pathOr(defaultValue, paths2, obj2);
  } else if (arguments.length === 2) {
    return (obj2: T) => pathOr(defaultValue, paths, obj2);
  }
  return defaultTo(defaultValue, path(paths, obj)) as T[P];
}
