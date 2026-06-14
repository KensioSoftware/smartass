import type { AssertionMatcher } from "../../match/match.js";

declare const objectWithPropertyMatcher: unique symbol;

export type ObjectWithProperty<K extends PropertyKey> = object &
  Record<K, unknown>;

export type ObjectWithPropertyMatcher<K extends PropertyKey> = AssertionMatcher<
  ObjectWithProperty<K>
> & {
  readonly [objectWithPropertyMatcher]: K;
};
