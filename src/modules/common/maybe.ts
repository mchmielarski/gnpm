import { isNothing, isSomething } from './utils';

export type F0<R> = () => R;
export type F1<A0, R> = (a0: A0) => R;
export type F2<A0, A1, R> = (a0: A0, a1: A1) => R;
export type F3<A0, A1, A2, R> = (a0: A0, a1: A1, a2: A2) => R;

export class Maybe<T> {
  get isNothing() {
    return isNothing(this.value);
  }

  get isSomething() {
    return isSomething(this.value);
  }

  static nothing = new Maybe<any>(undefined);

  static lift<T>(value: T) {
    if (isNothing(value)) {
      return Maybe.nothing;
    }
    return new Maybe(value);
  }

  private constructor(private value: T | undefined) {}

  bind<R>(fn: F1<T | undefined, Maybe<R>>): Maybe<R> {
    if (isSomething(this.value)) {
      return fn(this.value);
    }
    return Maybe.nothing;
  }

  map<R>(fn: F1<T | undefined, R>): Maybe<R> {
    return this.bind(value => Maybe.lift(fn(value)));
  }

  unwrap(): T | undefined {
    return this.value;
  }
}
