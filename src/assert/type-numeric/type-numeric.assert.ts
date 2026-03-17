import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is numeric (number or bigint), with type-narrowing.
 */
export function assertTypeNumeric(
  value: unknown,
  message = `Expected ${desc(value)} to be of type number or bigint.`,
): asserts value is number | bigint {
  if (typeof value !== "number" && typeof value !== "bigint") {
    throw new AssertionError(message, typeof value, "number | bigint");
  }
}
