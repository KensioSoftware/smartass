import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { oneOf } from "./one-of.match.js";

type OneOfAssertion<TActual, TAllowed extends readonly unknown[]> = [
  Extract<TActual, TAllowed[number]>,
] extends [never]
  ? TActual & TAllowed[number]
  : Extract<TActual, TAllowed[number]>;

export function assertOneOf<TActual, const TAllowed extends readonly unknown[]>(
  value: TActual,
  allowed: TAllowed,
  message?: string,
): asserts value is OneOfAssertion<TActual, TAllowed>;

export function assertOneOf<const TAllowed extends readonly unknown[]>(
  value: unknown,
  allowed: TAllowed,
  message?: string,
): asserts value is TAllowed[number];

/**
 * Assert that a value is one of a set of expected values, with type-narrowing.
 */
export function assertOneOf<const TAllowed extends readonly unknown[]>(
  value: unknown,
  allowed: TAllowed,
  message?: string,
): void {
  const matcher = oneOf(allowed);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? `Expected ${desc(value)} to be ${matcher.describe()}.`,
      value,
      matcher.represent(),
    );
  }
}
