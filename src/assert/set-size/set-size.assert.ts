import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { setOfSize } from "./set-size.match.js";
import type { SetOfSize, SetOfSizeMatch } from "./set-size.type.js";

export function assertSetSize<
  TSet extends Set<unknown>,
  const N extends number,
>(
  value: TSet,
  expectedSize: N,
  message?: string,
): asserts value is TSet & SetOfSizeMatch<TSet, N>;

export function assertSetSize<const N extends number>(
  value: unknown,
  expectedSize: N,
  message?: string,
): asserts value is SetOfSize<unknown, N>;

/**
 * Assert that a Set has exactly the expected size, with type narrowing.
 */
export function assertSetSize(
  value: unknown,
  expectedSize: number,
  message?: string,
): void {
  const matcher = setOfSize(expectedSize);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? buildSetSizeMessage(value, expectedSize),
      value,
      matcher.represent(),
    );
  }
}

function buildSetSizeMessage(value: unknown, expectedSize: number): string {
  if (!(value instanceof Set)) {
    return `Expected ${desc(value)} to be a Set of size ${repr(expectedSize)}.`;
  }

  return `Expected ${desc(value)} to have size ${repr(expectedSize)}, but it had size ${repr(value.size)}.`;
}
