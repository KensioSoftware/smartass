import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Asserts that a value is a bigint, with type-narrowing.
 */
export function assertTypeBigInt(
  value: unknown,
  message = `Expected ${desc(value)} to be of type bigint.`,
): asserts value is bigint {
  if (typeof value !== "bigint") {
    throw new AssertionError(message, typeof value, "bigint");
  }
}
