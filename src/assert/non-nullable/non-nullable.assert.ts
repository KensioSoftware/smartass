import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is non-nullable, with type-narrowing.
 * @example
 * ```ts
 * import { assertNonNullable } from "@kensio/smartass";
 *
 * const user: { name: string } | undefined = { name: "Ada" };
 *
 * assertNonNullable(user);
 *
 * // user is now narrowed to { name: string }
 * ```
 */
export function assertNonNullable<T>(
  value: T,
  message?: string,
): asserts value is NonNullable<T> {
  if (value === null) {
    throw new AssertionError(
      message ?? `Expected ${desc(value)} not to be null.`,
      value,
      // eslint-disable-next-line unicorn/no-null
      null,
    );
  }
  if (value === undefined) {
    throw new AssertionError(
      message ?? `Expected ${desc(value)} not to be undefined.`,
      value,
      undefined,
    );
  }
}
