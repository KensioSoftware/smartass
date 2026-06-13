import { createMatcher, type AssertionMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

export type ArrayIncludingAll<T, N extends number> = N extends 0
  ? T[]
  : N extends 1
    ? [T, ...T[]]
    : N extends 2
      ? [T, T, ...T[]]
      : N extends 3
        ? [T, T, T, ...T[]]
        : N extends 4
          ? [T, T, T, T, ...T[]]
          : N extends 5
            ? [T, T, T, T, T, ...T[]]
            : [T, T, T, T, T, ...T[]];

export type ArrayIncludingAllMatcher<N extends number> = AssertionMatcher<
  ArrayIncludingAll<unknown, N>
>;

/**
 * Matcher for an array including all specified elements.
 * Elements can appear in any order and do not need to be contiguous.
 * Each required element must be present at least once.
 */
export function arrayIncludingAll<const E extends readonly unknown[]>(
  elements: E,
): ArrayIncludingAllMatcher<E["length"]> {
  return createMatcher(
    (value): value is ArrayIncludingAll<unknown, E["length"]> =>
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
