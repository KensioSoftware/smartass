import { AssertionError } from "../../assertion-error.js";

/**
 * Asserts that a value is a bigint, with type-narrowing.
 */
export function assertTypeBigInt(
  value: unknown,
  message = `Expected ${String(value)} to be of type BigInt, but it was of type ${typeof value}.`,
): asserts value is bigint {
  if (typeof value !== "bigint") {
    throw new AssertionError(message);
  }
}
