export function ifElse<T>(
  predicate: (value: T) => boolean,
  ifFn: (value: T) => any,
  elseFn: (value: T) => any
) {
  return (value: T) => (predicate(value) ? ifFn(value) : elseFn(value));
}
