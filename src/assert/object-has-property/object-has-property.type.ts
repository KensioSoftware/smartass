import type { AssertionMatcher } from "../../match/match.js";

declare const objectWithPropertyMatcher: unique symbol;

export type ObjectWithProperty<K extends PropertyKey, T = unknown> = object & {
  [P in K]: T extends object ? (P extends keyof T ? T[P] : unknown) : unknown;
};

export type ObjectWithPropertyMatcher<K extends PropertyKey> = AssertionMatcher<
  ObjectWithProperty<K>
> & {
  readonly [objectWithPropertyMatcher]: K;
};
