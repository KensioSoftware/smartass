import { arrayIncludingAll } from "./array-includes-all.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import type {
  ArrayElement,
  ArrayIncludingAll,
  ArrayIncludingAllElement,
} from "./array-includes-all.type.js";

export function assertArrayIncludesAll<
  TArray extends unknown[],
  const E extends readonly ArrayElement<TArray>[],
>(
  value: TArray,
  elements: E,
  message?: string,
): asserts value is TArray &
  ArrayIncludingAll<ArrayElement<TArray>, E["length"]>;

export function assertArrayIncludesAll<const E extends readonly unknown[]>(
  value: unknown,
  elements: E,
  message?: string,
): asserts value is ArrayIncludingAll<ArrayIncludingAllElement<E>, E["length"]>;

/**
 * Assert that an array includes all specified elements, with type narrowing.
 * Elements can appear in any order and do not need to be contiguous.
 * Repeated required elements must appear at least that many times.
 * Note that this uses the first n elements of the narrowed array type to
 * indicate that the elements are included, even though the elements could be
 * anywhere in the array.
 * @example
 * ```ts
 * import { assertArrayIncludesAll } from "@kensio/smartass";
 *
 * const roles: string[] = ["admin", "editor", "viewer"];
 *
 * assertArrayIncludesAll(roles, ["admin", "editor"]);
 *
 * // roles narrowed to ["admin"|"editor", "admin"|"editor", ...string[]]
 * ```
 */
export function assertArrayIncludesAll(
  value: unknown,
  elements: readonly unknown[],
  message?: string,
): void {
  const matcher = arrayIncludingAll(elements);
  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildArrayIncludesAllMessage(value, elements),
      value,
      matcher.represent(),
    );
  }
}

function buildArrayIncludesAllMessage(
  value: unknown,
  elements: readonly unknown[],
): string {
  if (!Array.isArray(value)) {
    return `Expected ${desc(value)} to be array including all of ${desc(elements)}.`;
  }

  const missing = findMissingElements(value, elements);

  return `Expected ${desc(value)} to include all of ${repr(elements)}, but missing ${repr(missing)}.`;
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
