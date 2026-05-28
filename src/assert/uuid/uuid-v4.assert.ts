import type { UUID } from "node:crypto";
import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

const uuidV4Regex =
  /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

type UuidV4 = UUID &
  `${string}-${string}-4${string}-${"8" | "9" | "a" | "b"}${string}-${string}`;

/**
 * Assert that a value is a UUID v4 string, with type-narrowing.
 */
export function assertUuidV4(
  value: unknown,
  message = `Expected ${desc(value)} to be a UUID v4 string.`,
): asserts value is UuidV4 {
  if (typeof value !== "string" || !uuidV4Regex.test(value)) {
    throw new AssertionError(message, value, "UUID v4 string");
  }
}
