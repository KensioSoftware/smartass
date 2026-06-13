import { desc, repr } from "../../describe/describe.js";
import {
  type AssertionMatcher,
  createMatcher,
  type refinement,
} from "../../match/match.js";

export type ObjectWithProperty<
  K extends PropertyKey,
  TActual = unknown,
> = K extends keyof NonNullable<TActual>
  ? Omit<NonNullable<TActual>, K> & {
      [P in K]-?: Exclude<NonNullable<TActual>[P], undefined>;
    }
  : object & Record<K, unknown>;

export type ObjectWithPropertyMatcher<K extends PropertyKey> = AssertionMatcher<
  ObjectWithProperty<K>
> & {
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ObjectWithProperty<K, TActual>;
};

/**
 * Matcher for an object with a certain named property.
 * The property only has to exist on the object, but could be undefined.
 */
export function objectWithProperty<K extends PropertyKey>(
  key: K,
): ObjectWithPropertyMatcher<K> {
  return createMatcher(
    (value): value is ObjectWithProperty<K> =>
      typeof value === "object" && value !== null && key in value,
    () => `object with property ${desc(key)}`,
    () => `{${repr(key)}}`,
  );
}
