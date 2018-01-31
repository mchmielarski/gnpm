export function path<T, P extends keyof T>(
  paths: string | number | (number | string)[]
): (obj: T) => T[P];
export function path<T, P extends keyof T>(
  paths: string | number | (number | string)[],
  obj: T
): T[P];
export function path<T, P extends keyof T>(
  paths: string | number | (number | string)[],
  obj?: T
): T[P] | ((obj: any) => T[P]) {
  if (arguments.length === 1) {
    return (obj2: T) => path(paths, obj2);
  }
  let val: T[P] = obj as any;
  let idx = 0;
  paths = Array.isArray(paths) ? paths : [paths];

  while (idx < paths.length) {
    if (val == null) {
      return;
    }
    val = val[paths[idx]];
    idx += 1;
  }
  return val;
}
