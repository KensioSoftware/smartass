import { createMatcher, type AssertionMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

export type ArrayIncludingAll<T, E extends readonly T[]> = readonly [
  T,
  ...T[],
] & {
  includes(searchElement: E[number]): true;
};

/**
 * Matcher for an array including all specified elements.
 * Elements can appear in any order and do not need to be contiguous.
 * Each required element must be present at least once.
 */
export function arrayIncludingAll<const E extends readonly unknown[]>(
  elements: E,
): AssertionMatcher<ArrayIncludingAll<unknown, E>> {
  return createMatcher(
    (value): value is ArrayIncludingAll<unknown, E> =>
      Array.isArray(value) &&
      elements.every((element) => value.includes(element)),
    () => `array including all of ${desc(elements)}`,
    () => `[…,${reprArrayElements(elements)},…]`,
  );
}

function reprArrayElements(values: readonly unknown[]): string {
  if (values.length <= 5) {
    return values.map((value) => repr(value)).join(",");
  }

  const first = values.slice(0, 3).map((value) => repr(value));
  const last = values.slice(-1).map((value) => repr(value));

  return [...first, "…", ...last].join(",");
}
