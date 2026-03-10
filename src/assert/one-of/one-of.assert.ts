/**
 * Assert that a value is one of a set of expected values, with type-narrowing.
 */
export function assertOneOf<const TAllowed extends readonly unknown[]>(
  value: unknown,
  allowed: TAllowed,
  message = `Expected value to be one of: ${allowed.join(", ")}`,
): asserts value is TAllowed[number] {
  if (!allowed.includes(value)) {
    throw new Error(message);
  }
}
