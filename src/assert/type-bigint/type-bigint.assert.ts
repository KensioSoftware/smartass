import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeBigInt } from "./type-bigint.match.js";

/**
 * Asserts that a value is a bigint, with type-narrowing.
 */
export function assertTypeBigInt(
  value: unknown,
  message = `Expected ${desc(value)} to be of type bigint.`,
): asserts value is bigint {
  const matcher = typeBigInt();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
