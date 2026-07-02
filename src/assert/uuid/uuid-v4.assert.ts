import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { uuidV4 } from "./uuid-v4.match.js";
import type { UuidV4 } from "./uuid-v4.type.js";

export function assertUuidV4<TActual extends string>(
  value: TActual,
  message?: string,
): asserts value is TActual & UuidV4;

export function assertUuidV4(
  value: unknown,
  message?: string,
): asserts value is UuidV4;

/**
 * Assert that a value is a UUID v4 string, with type-narrowing.
 * @example
 * ```ts
 * import { assertUuidV4 } from "@kensio/smartass";
 *
 * const value: string = "d2f6b6c0-5f50-4f5d-9f08-2f98e93b6d8f";
 *
 * assertUuidV4(value);
 *
 * // value is now narrowed to a UUID v4 string
 * ```
 */
export function assertUuidV4(value: unknown, message?: string): void {
  const matcher = uuidV4();
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? `Expected ${desc(value)} to be a UUID v4 string.`,
      value,
      matcher.represent(),
    );
  }
}
