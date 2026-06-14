import { arrayIncludingAll } from "./array-includes-all.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import type { ArrayIncludingAll } from "./array-includes-all.type.js";

/**
 * Assert that an array includes all specified elements, with type narrowing.
 * Elements can appear in any order and do not need to be contiguous.
 * Repeated required elements must appear at least that many times.
 */
export function assertArrayIncludesAll<T, const E extends readonly T[]>(
  value: readonly T[],
  elements: E,
  message?: string,
): asserts value is ArrayIncludingAll<T, E["length"]> {
  const matcher = arrayIncludingAll(elements);
  if (!matcher.matches(value)) {
    const missing = findMissingElements(value, elements);
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to include all of ${repr(elements)}, but missing ${repr(missing)}.`,
      value,
      matcher.represent(),
    );
  }
}

function findMissingElements(
  value: readonly unknown[],
  elements: readonly unknown[],
): unknown[] {
  const remaining = [...value];
  const missing: unknown[] = [];

  for (const element of elements) {
    const index = remaining.findIndex((candidate) =>
      sameValueZero(candidate, element),
    );

    if (index === -1) {
      missing.push(element);
    } else {
      remaining.splice(index, 1);
    }
  }

  return missing;
}

function sameValueZero(left: unknown, right: unknown): boolean {
  return left === right || (Number.isNaN(left) && Number.isNaN(right));
}
