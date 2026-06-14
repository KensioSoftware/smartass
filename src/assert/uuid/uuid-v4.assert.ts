import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { uuidV4 } from "./uuid-v4.match.js";
import type { UuidV4 } from "./uuid-v4.type.js";

/**
 * Assert that a value is a UUID v4 string, with type-narrowing.
 */
export function assertUuidV4(
  value: unknown,
  message = `Expected ${desc(value)} to be a UUID v4 string.`,
): asserts value is UuidV4 {
  const matcher = uuidV4();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
