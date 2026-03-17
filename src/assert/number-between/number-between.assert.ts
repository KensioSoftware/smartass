import { AssertionError } from "../../assertion-error.js";
import { assertTypeNumeric } from "../type-numeric/type-numeric.assert.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Assert that a numeric value is between min and max inclusive, with
 * type-narrowing.
 */
export function assertNumberBetween(
  value: unknown,
  min: number | bigint,
  max: number | bigint,
  message = `Expected ${desc(value)} to be between ${desc(min)} and ${desc(max)} inclusive.`,
): asserts value is number | bigint {
  assertTypeNumeric(value, message);

  if (value < min || value > max) {
    throw new AssertionError(
      message,
      value,
      `${repr(min)} ≤ ${repr(value)} ≤ ${repr(max)}`,
    );
  }
}
