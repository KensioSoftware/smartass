import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { mapOfSize } from "./map-size.match.js";
import type { MapOfSize, MapOfSizeMatch } from "./map-size.type.js";

export function assertMapSize<
  TMap extends Map<unknown, unknown>,
  const N extends number,
>(
  value: TMap,
  expectedSize: N,
  message?: string,
): asserts value is TMap & MapOfSizeMatch<TMap, N>;

export function assertMapSize<const N extends number>(
  value: unknown,
  expectedSize: N,
  message?: string,
): asserts value is MapOfSize<unknown, unknown, N>;

/**
 * Assert that a Map has exactly the expected size, with type narrowing.
 * @example
 * ```ts
 * import { assertMapSize } from "@kensio/smartass";
 *
 * const value: unknown = new Map([["role", "admin"]]);
 *
 * assertMapSize(value, 1);
 *
 * // value is now narrowed to a Map with exactly 1 entry
 * ```
 */
export function assertMapSize(
  value: unknown,
  expectedSize: number,
  message?: string,
): void {
  const matcher = mapOfSize(expectedSize);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? buildMapSizeMessage(value, expectedSize),
      value,
      matcher.represent(),
    );
  }
}

function buildMapSizeMessage(value: unknown, expectedSize: number): string {
  if (!(value instanceof Map)) {
    return `Expected ${desc(value)} to be a Map of size ${repr(expectedSize)}.`;
  }

  return `Expected ${desc(value)} to have size ${repr(expectedSize)}, but it had size ${repr(value.size)}.`;
}
