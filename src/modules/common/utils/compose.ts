export function compose<A>(): (i: A) => A;
export function compose<A, B>(b: (i: A) => B): (i: A) => B;
export function compose<A, B, C>(c: (i: B) => C, b: (i: A) => B): (i: A) => C;
export function compose<A, B, C, D>(d: (i: C) => D, c: (i: B) => C, b: (i: A) => B): (i: A) => D;
export function compose<A, B, C, D, E>(
  e: (i: D) => E,
  d: (i: C) => D,
  c: (i: B) => C,
  b: (i: A) => B
): (i: A) => E;
export function compose<A, B, C, D, E, F>(
  f: (i: E) => F,
  e: (i: D) => E,
  d: (i: C) => D,
  c: (i: B) => C,
  b: (i: A) => B
): (i: A) => F;
export function compose(...functions: any[]) {
  return (arg: any) => {
    if (functions.length === 0) {
      return arg;
    }

    const last = functions[functions.length - 1];
    const rest = functions.slice(0, -1);

    return rest.reduceRight((composed, fn) => fn(composed), last(arg));
  };
}
