import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { findUnpairedSetMembers } from "../../compare/object-comparison.js";
import { setMemberComparison, setOf } from "./set-equals.match.js";

/**
 * Assert that a Set holds exactly the expected members, with type narrowing.
 *
 * Members are compared by value. Plain objects and nested arrays are compared
 * recursively, and object keys must match exactly. Dates are compared by the
 * instant they hold. Class instances and other values are compared using
 * Object.is.
 *
 * A Set finds its own members with SameValueZero, so pairing members here is a
 * search rather than a lookup. Order carries no meaning and is never reported.
 * @example
 * ```ts
 * import { assertSetEquals } from "@kensio/smartass";
 *
 * const value: unknown = new Set(["draft", "featured"]);
 *
 * assertSetEquals(value, new Set(["draft", "featured"] as const));
 *
 * // value is now narrowed to ReadonlySet<"draft" | "featured">
 * ```
 */
export function assertSetEquals<TExpected extends ReadonlySet<unknown>>(
  actual: unknown,
  expected: TExpected,
  message?: string,
): asserts actual is TExpected {
  if (!setOf(expected).isMatch(actual)) {
    throw new AssertionError(
      message ?? buildSetEqualsMessage(actual, expected),
      actual,
      expected,
    );
  }
}

function buildSetEqualsMessage(
  actual: unknown,
  expected: ReadonlySet<unknown>,
): string {
  if (!(actual instanceof Set)) {
    return `Expected ${desc(actual)} to be a Set equal to ${desc(expected)}.`;
  }

  const { missing, unexpected } = findUnpairedSetMembers(
    actual,
    expected,
    setMemberComparison,
  );
  const parts: string[] = [];

  if (missing.length > 0) {
    parts.push(`missing ${repr(missing)}`);
  }

  if (unexpected.length > 0) {
    parts.push(`unexpected ${repr(unexpected)}`);
  }

  // A failed match always leaves at least one member unpaired, so parts is never empty here.
  return `Expected ${desc(actual)} to equal ${desc(expected)}, ${parts.join(", ")}.`;
}
