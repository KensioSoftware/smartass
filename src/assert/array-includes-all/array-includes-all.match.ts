import { createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";
import type {
  ArrayIncludingAll,
  ArrayIncludingAllElement,
  ArrayIncludingAllMatcher,
} from "./array-includes-all.type.js";

/**
 * Matcher for an array including all specified elements.
 * Elements can appear in any order and do not need to be contiguous.
 * Repeated required elements must appear at least that many times.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { arrayIncludingAll, assertObjectMatches } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   roles: ["admin", "editor", "viewer"],
 * };
 *
 * assertObjectMatches(value, {
 *   roles: arrayIncludingAll(["admin", "editor"] as const),
 * });
 *
 * // value is now narrowed to an object with roles including both values
 * // {
 * //   roles: ["admin" | "editor", "admin" | "editor", ...("admin" | "editor")[]];
 * // }
 * ```
 */
export function arrayIncludingAll<const E extends readonly unknown[]>(
  elements: E,
): ArrayIncludingAllMatcher<ArrayIncludingAllElement<E>, E["length"]> {
  return createMatcher(
    (
      value,
    ): value is ArrayIncludingAll<ArrayIncludingAllElement<E>, E["length"]> =>
      Array.isArray(value) && includesAll(value, elements),
    () => `array including all of ${desc(elements)}`,
    () => `[…,${reprArrayElements(elements)},…]`,
  );
}

function includesAll(
  value: readonly unknown[],
  elements: readonly unknown[],
): boolean {
  const remaining = [...value];

  return elements.every((element) => {
    const index = remaining.findIndex((candidate) =>
      sameValueZero(candidate, element),
    );

    if (index === -1) {
      return false;
    }

    remaining.splice(index, 1);
    return true;
  });
}

function sameValueZero(left: unknown, right: unknown): boolean {
  return left === right || (Number.isNaN(left) && Number.isNaN(right));
}

function reprArrayElements(values: readonly unknown[]): string {
  if (values.length <= 5) {
    return values.map((value) => repr(value)).join(",");
  }

  const first = values.slice(0, 3).map((value) => repr(value));
  const last = values.slice(-1).map((value) => repr(value));

  return [...first, "…", ...last].join(",");
}
